"use client";

// GPU fluid simulation (Navier-Stokes) for a Chinese ink-wash background.
// The velocity field is stirred by the cursor; dye (ink) is advected through
// it, swirling and diffusing like ink dropped in water. The ink is rendered as
// a single colour — the active theme colour — over the page's light background.
// Adapted (trimmed) from Pavel Dobryakov's WebGL-Fluid-Simulation (MIT).

import { useEffect, useRef } from "react";

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

export function InkFluidCanvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<[number, number, number]>(hexToRgb(color));

  useEffect(() => {
    inkRef.current = hexToRgb(color);
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // ---- config ----
    const SIM_RESOLUTION = 128;
    const DYE_RESOLUTION = 1024;
    const DYE_DISSIPATION = 0.14; // fades in roughly five seconds
    const VELOCITY_DISSIPATION = 0.25;
    const PRESSURE = 0.8;
    const PRESSURE_ITERATIONS = 20;
    const CURL = 22; // swirl strength
    const SPLAT_RADIUS = 0.002;
    const SPLAT_FORCE = 2000;

    // ---- WebGL context ----
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    } as WebGLContextAttributes;

    let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!gl;
    if (!gl) {
      gl = (canvas.getContext("webgl", params) ||
        canvas.getContext(
          "experimental-webgl",
          params
        )) as unknown as WebGL2RenderingContext | null;
    }
    if (!gl) return;
    const glc = gl;

    let halfFloat: number;
    let supportLinear: boolean;
    if (isWebGL2) {
      glc.getExtension("EXT_color_buffer_float");
      supportLinear = !!glc.getExtension("OES_texture_float_linear");
      halfFloat = (glc as WebGL2RenderingContext).HALF_FLOAT;
    } else {
      const hf = glc.getExtension("OES_texture_half_float");
      supportLinear = !!glc.getExtension("OES_texture_half_float_linear");
      halfFloat = hf ? hf.HALF_FLOAT_OES : glc.UNSIGNED_BYTE;
    }

    type FormatRGBA = { internalFormat: number; format: number } | null;

    const getSupportedFormat = (
      internalFormat: number,
      format: number,
      type: number
    ): FormatRGBA => {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (isWebGL2) {
          const g2 = glc as WebGL2RenderingContext;
          if (internalFormat === g2.R16F)
            return getSupportedFormat(g2.RG16F, g2.RG, type);
          if (internalFormat === g2.RG16F)
            return getSupportedFormat(g2.RGBA16F, glc.RGBA, type);
        }
        return null;
      }
      return { internalFormat, format };
    };

    function supportRenderTextureFormat(
      internalFormat: number,
      format: number,
      type: number
    ): boolean {
      const texture = glc.createTexture();
      glc.bindTexture(glc.TEXTURE_2D, texture);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.NEAREST);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.NEAREST);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
      glc.texImage2D(
        glc.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );
      const fbo = glc.createFramebuffer();
      glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
      glc.framebufferTexture2D(
        glc.FRAMEBUFFER,
        glc.COLOR_ATTACHMENT0,
        glc.TEXTURE_2D,
        texture,
        0
      );
      const status = glc.checkFramebufferStatus(glc.FRAMEBUFFER);
      glc.bindFramebuffer(glc.FRAMEBUFFER, null);
      glc.deleteFramebuffer(fbo);
      glc.deleteTexture(texture);
      return status === glc.FRAMEBUFFER_COMPLETE;
    }

    const rgba = isWebGL2
      ? getSupportedFormat((glc as WebGL2RenderingContext).RGBA16F, glc.RGBA, halfFloat)
      : getSupportedFormat(glc.RGBA, glc.RGBA, halfFloat);
    const rg = isWebGL2
      ? getSupportedFormat((glc as WebGL2RenderingContext).RG16F, (glc as WebGL2RenderingContext).RG, halfFloat)
      : getSupportedFormat(glc.RGBA, glc.RGBA, halfFloat);
    const r = isWebGL2
      ? getSupportedFormat((glc as WebGL2RenderingContext).R16F, (glc as WebGL2RenderingContext).RED, halfFloat)
      : getSupportedFormat(glc.RGBA, glc.RGBA, halfFloat);

    if (!rgba || !rg || !r) return;
    const texType = halfFloat;
    const filtering = supportLinear ? glc.LINEAR : glc.NEAREST;

    // ---- shader helpers ----
    const compile = (type: number, source: string): WebGLShader => {
      const shader = glc.createShader(type)!;
      glc.shaderSource(shader, source);
      glc.compileShader(shader);
      if (!glc.getShaderParameter(shader, glc.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.warn(glc.getShaderInfoLog(shader));
      }
      return shader;
    };

    const program = (vs: WebGLShader, fs: WebGLShader): WebGLProgram => {
      const p = glc.createProgram()!;
      glc.attachShader(p, vs);
      glc.attachShader(p, fs);
      // GLSL ES 1.00 has no layout qualifier — pin aPosition to location 0
      // so the single shared quad VBO binds correctly across every program.
      glc.bindAttribLocation(p, 0, "aPosition");
      glc.linkProgram(p);
      return p;
    };

    const uniforms = (p: WebGLProgram): Record<string, WebGLUniformLocation> => {
      const u: Record<string, WebGLUniformLocation> = {};
      const count = glc.getProgramParameter(p, glc.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = glc.getActiveUniform(p, i)!.name;
        u[name] = glc.getUniformLocation(p, name)!;
      }
      return u;
    };

    // WebGL1 vs WebGL2 GLSL differences handled with small shims.
    const v1 = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`;

    const baseVertex = compile(glc.VERTEX_SHADER, v1);

    const fs = (src: string) => compile(glc.FRAGMENT_SHADER, src);

    const HEAD = "precision highp float;\nprecision highp sampler2D;\n";

    const clearShader = fs(
      HEAD +
        `varying vec2 vUv; uniform sampler2D uTexture; uniform float value;
         void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`
    );

    const splatShader = fs(
      HEAD +
        `varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
         uniform vec3 color; uniform vec2 point; uniform float radius;
         void main () {
           vec2 p = vUv - point.xy; p.x *= aspectRatio;
           vec3 splat = exp(-dot(p, p) / radius) * color;
           vec3 base = texture2D(uTarget, vUv).xyz;
           gl_FragColor = vec4(base + splat, 1.0);
         }`
    );

    const advectionManual = !supportLinear;
    const advectionShader = fs(
      HEAD +
        `varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
         uniform vec2 texelSize; uniform vec2 dyeTexelSize;
         uniform float dt; uniform float dissipation;
         vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
           vec2 st = uv / tsize - 0.5;
           vec2 iuv = floor(st); vec2 fuv = fract(st);
           vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
           vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
           vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
           vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
           return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
         }
         void main () {
         ${
           advectionManual
             ? `vec2 vel = bilerp(uVelocity, vUv, texelSize).xy;
                if (!(vel.x == vel.x)) vel.x = 0.0; // kill NaN
                if (!(vel.y == vel.y)) vel.y = 0.0;
                vel = clamp(vel, -300.0, 300.0);
                vec2 coord = vUv - dt * vel * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);`
             : `vec2 vel = texture2D(uVelocity, vUv).xy;
                if (!(vel.x == vel.x)) vel.x = 0.0; // kill NaN
                if (!(vel.y == vel.y)) vel.y = 0.0;
                vel = clamp(vel, -300.0, 300.0);
                vec2 coord = vUv - dt * vel * texelSize;
                vec4 result = texture2D(uSource, coord);`
         }
           float decay = 1.0 + dissipation * dt;
           gl_FragColor = result / decay;
         }`
    );

    const divergenceShader = fs(
      HEAD +
        `varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
         uniform sampler2D uVelocity;
         void main () {
           float L = texture2D(uVelocity, vL).x;
           float R = texture2D(uVelocity, vR).x;
           float T = texture2D(uVelocity, vT).y;
           float B = texture2D(uVelocity, vB).y;
           vec2 C = texture2D(uVelocity, vUv).xy;
           if (vL.x < 0.0) L = -C.x;
           if (vR.x > 1.0) R = -C.x;
           if (vT.y > 1.0) T = -C.y;
           if (vB.y < 0.0) B = -C.y;
           float div = 0.5 * (R - L + T - B);
           gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
         }`
    );

    const curlShader = fs(
      HEAD +
        `varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
         uniform sampler2D uVelocity;
         void main () {
           float L = texture2D(uVelocity, vL).y;
           float R = texture2D(uVelocity, vR).y;
           float T = texture2D(uVelocity, vT).x;
           float B = texture2D(uVelocity, vB).x;
           float vorticity = R - L - T + B;
           gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
         }`
    );

    const vorticityShader = fs(
      HEAD +
        `varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
         uniform sampler2D uVelocity; uniform sampler2D uCurl;
         uniform float curl; uniform float dt;
         void main () {
           float L = texture2D(uCurl, vL).x;
           float R = texture2D(uCurl, vR).x;
           float T = texture2D(uCurl, vT).x;
           float B = texture2D(uCurl, vB).x;
           float C = texture2D(uCurl, vUv).x;
           vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
           force /= length(force) + 0.0001;
           force *= curl * C;
           force.y *= -1.0;
           vec2 velocity = texture2D(uVelocity, vUv).xy;
           velocity += force * dt;
           velocity = min(max(velocity, -1000.0), 1000.0);
           gl_FragColor = vec4(velocity, 0.0, 1.0);
         }`
    );

    const pressureShader = fs(
      HEAD +
        `varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
         uniform sampler2D uPressure; uniform sampler2D uDivergence;
         void main () {
           float L = texture2D(uPressure, vL).x;
           float R = texture2D(uPressure, vR).x;
           float T = texture2D(uPressure, vT).x;
           float B = texture2D(uPressure, vB).x;
           float divergence = texture2D(uDivergence, vUv).x;
           float pressure = (L + R + B + T - divergence) * 0.25;
           gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
         }`
    );

    const gradientShader = fs(
      HEAD +
        `varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
         uniform sampler2D uPressure; uniform sampler2D uVelocity;
         void main () {
           float L = texture2D(uPressure, vL).x;
           float R = texture2D(uPressure, vR).x;
           float T = texture2D(uPressure, vT).x;
           float B = texture2D(uPressure, vB).x;
           vec2 velocity = texture2D(uVelocity, vUv).xy;
           velocity.xy -= vec2(R - L, T - B);
           gl_FragColor = vec4(velocity, 0.0, 1.0);
         }`
    );

    // Combined dye update: advect the ink through the velocity field, fade it,
    // and inject the new splat — all in a single ping-pong pass. RGB stores the
    // density-weighted ink colour and alpha stores density, so existing trails
    // keep the colour they had when they were created.
    const dyeUpdateShader = fs(
      HEAD +
        `varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
         uniform vec2 texelSize; uniform float dt; uniform float dissipation;
         uniform vec2 point; uniform float radius; uniform float amount;
         uniform float aspectRatio; uniform vec3 uInk;
         void main () {
           vec2 vel = texture2D(uVelocity, vUv).xy;
           if (!(vel.x == vel.x)) vel.x = 0.0;
           if (!(vel.y == vel.y)) vel.y = 0.0;
           vel = clamp(vel, -300.0, 300.0);
           vec2 coord = vUv - dt * vel * texelSize;
           vec4 base = texture2D(uSource, coord);
           base /= 1.0 + dissipation * dt;
           vec2 p = vUv - point; p.x *= aspectRatio;
           float blob = exp(-dot(p, p) / radius) * amount;
           gl_FragColor = base + vec4(uInk * blob, blob);
         }`
    );

    // Display the colour carried by each dye sample instead of recolouring the
    // whole buffer whenever the active theme changes.
    const displayShader = fs(
      HEAD +
        `varying vec2 vUv; uniform sampler2D uTexture;
         uniform float uIntensity;
         void main () {
           vec4 dye = texture2D(uTexture, vUv);
           float d = dye.a;
           // soft non-linear ramp for natural ink density falloff
           float a = clamp(d * uIntensity, 0.0, 1.0);
           a = a * a * (3.0 - 2.0 * a);
           a *= 0.28;
           vec3 ink = d > 0.00001 ? dye.rgb / d : vec3(0.0);
           gl_FragColor = vec4(ink, a);
         }`
    );

    type Prog = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation> };
    const mk = (shader: WebGLShader): Prog => {
      const p = program(baseVertex, shader);
      return { program: p, uniforms: uniforms(p) };
    };

    const clearProg = mk(clearShader);
    const splatProg = mk(splatShader);
    const advectionProg = mk(advectionShader);
    const divergenceProg = mk(divergenceShader);
    const curlProg = mk(curlShader);
    const vorticityProg = mk(vorticityShader);
    const pressureProg = mk(pressureShader);
    const gradientProg = mk(gradientShader);
    const dyeUpdateProg = mk(dyeUpdateShader);
    const displayProg = mk(displayShader);

    // ---- geometry (full screen quad) ----
    const quad = glc.createBuffer();
    glc.bindBuffer(glc.ARRAY_BUFFER, quad);
    glc.bufferData(
      glc.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      glc.STATIC_DRAW
    );
    const elem = glc.createBuffer();
    glc.bindBuffer(glc.ELEMENT_ARRAY_BUFFER, elem);
    glc.bufferData(
      glc.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      glc.STATIC_DRAW
    );
    glc.vertexAttribPointer(0, 2, glc.FLOAT, false, 0, 0);
    glc.enableVertexAttribArray(0);

    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };
    type DoubleFBO = {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    };

    const createFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO => {
      glc.activeTexture(glc.TEXTURE0);
      const texture = glc.createTexture()!;
      glc.bindTexture(glc.TEXTURE_2D, texture);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, param);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, param);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
      glc.texImage2D(glc.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = glc.createFramebuffer()!;
      glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
      glc.framebufferTexture2D(
        glc.FRAMEBUFFER,
        glc.COLOR_ATTACHMENT0,
        glc.TEXTURE_2D,
        texture,
        0
      );
      const st = glc.checkFramebufferStatus(glc.FRAMEBUFFER);
      if (st !== glc.FRAMEBUFFER_COMPLETE) {
        // eslint-disable-next-line no-console
        console.warn("FBO incomplete", internalFormat, format, type, st);
      }
      glc.viewport(0, 0, w, h);
      // Half-float textures start as undefined garbage (often NaN). Explicitly
      // zero them, or at-rest advection samples itself and NaN never leaves.
      glc.clearColor(0, 0, 0, 0);
      glc.clear(glc.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          glc.activeTexture(glc.TEXTURE0 + id);
          glc.bindTexture(glc.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO => {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        get read() {
          return fbo1;
        },
        set read(v) {
          fbo1 = v;
        },
        get write() {
          return fbo2;
        },
        set write(v) {
          fbo2 = v;
        },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          fbo2 = t;
        },
      };
    };

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curlFBO: FBO;
    let pressure: DoubleFBO;

    const getResolution = (resolution: number) => {
      let aspect = glc.drawingBufferWidth / glc.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      if (glc.drawingBufferWidth > glc.drawingBufferHeight)
        return { width: max, height: min };
      return { width: min, height: max };
    };

    const initFramebuffers = () => {
      const simRes = getResolution(SIM_RESOLUTION);
      const dyeRes = getResolution(DYE_RESOLUTION);

      dye = createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgba!.internalFormat,
        rgba!.format,
        texType,
        filtering
      );
      velocity = createDoubleFBO(
        simRes.width,
        simRes.height,
        rg!.internalFormat,
        rg!.format,
        texType,
        filtering
      );
      divergence = createFBO(
        simRes.width,
        simRes.height,
        r!.internalFormat,
        r!.format,
        texType,
        glc.NEAREST
      );
      curlFBO = createFBO(
        simRes.width,
        simRes.height,
        r!.internalFormat,
        r!.format,
        texType,
        glc.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r!.internalFormat,
        r!.format,
        texType,
        glc.NEAREST
      );
    };

    const blit = (target: FBO | null) => {
      if (target == null) {
        glc.viewport(0, 0, glc.drawingBufferWidth, glc.drawingBufferHeight);
        glc.bindFramebuffer(glc.FRAMEBUFFER, null);
      } else {
        glc.viewport(0, 0, target.width, target.height);
        glc.bindFramebuffer(glc.FRAMEBUFFER, target.fbo);
      }
      glc.drawElements(glc.TRIANGLES, 6, glc.UNSIGNED_SHORT, 0);
    };

    const resizeCanvas = () => {
      const w = Math.floor(window.innerWidth * Math.min(window.devicePixelRatio, 2));
      const h = Math.floor(window.innerHeight * Math.min(window.devicePixelRatio, 2));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };

    resizeCanvas();
    initFramebuffers();

    // ---- pointer input ----
    type Pointer = {
      init: boolean;
      down: boolean;
      moved: boolean;
      x: number;
      y: number;
      dx: number;
      dy: number;
    };
    const pointer: Pointer = {
      init: false,
      down: false,
      moved: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
    };

    const correctDelta = (delta: number, axis: "x" | "y") => {
      const aspect = canvas.width / canvas.height;
      if (axis === "x") return aspect < 1 ? delta * aspect : delta;
      return aspect > 1 ? delta / aspect : delta;
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const x = clientX / window.innerWidth;
      const y = 1 - clientY / window.innerHeight;
      // First event only seeds the position — a delta against (0,0) would be
      // enormous and blow the fluid solver up into NaN, poisoning everything.
      if (!pointer.init) {
        pointer.init = true;
        pointer.x = x;
        pointer.y = y;
        return;
      }
      // Clamp per-frame delta so a single fast jump can't destabilise the sim.
      const clamp = (v: number) => Math.max(-0.04, Math.min(0.04, v));
      pointer.dx = correctDelta(clamp(x - pointer.x), "x") * SPLAT_FORCE;
      pointer.dy = correctDelta(clamp(y - pointer.y), "y") * SPLAT_FORCE;
      pointer.x = x;
      pointer.y = y;
      pointer.moved = Math.abs(pointer.dx) > 0 || Math.abs(pointer.dy) > 0;
    };

    const onMove = (e: MouseEvent) => {
      if (pointer.down) updatePointer(e.clientX, e.clientY);
    };
    const onDown = (e: MouseEvent) => {
      pointer.down = true;
      pointer.init = true;
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = 1 - e.clientY / window.innerHeight;
    };
    const onUp = () => {
      pointer.down = false;
      pointer.moved = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onUp);

    // Pending ink injection for this frame, consumed by the combined dye pass.
    const inkSplat = { x: 0, y: 0, amount: 0 };

    // ---- splat (velocity only; dye ink is injected in the combined dye pass) ----
    const splatVelocity = (x: number, y: number, dx: number, dy: number) => {
      glc.useProgram(splatProg.program);
      glc.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      glc.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      glc.uniform2f(splatProg.uniforms.point, x, y);
      glc.uniform3f(splatProg.uniforms.color, dx, dy, 0);
      glc.uniform1f(splatProg.uniforms.radius, SPLAT_RADIUS);
      blit(velocity.write);
      velocity.swap();
    };

    const applyInput = () => {
      inkSplat.amount = 0;
      if (pointer.moved) {
        pointer.moved = false;
        const amount = Math.min(
          0.2,
          0.05 + Math.hypot(pointer.dx, pointer.dy) / SPLAT_FORCE * 1.6
        );
        splatVelocity(pointer.x, pointer.y, pointer.dx, pointer.dy);
        inkSplat.x = pointer.x;
        inkSplat.y = pointer.y;
        inkSplat.amount = amount;
      }
    };

    // ---- step ----
    const step = (dt: number) => {
      glc.disable(glc.BLEND);

      // curl
      glc.useProgram(curlProg.program);
      glc.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      // vorticity
      glc.useProgram(vorticityProg.program);
      glc.uniform2f(vorticityProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
      glc.uniform1i(vorticityProg.uniforms.uCurl, curlFBO.attach(1));
      glc.uniform1f(vorticityProg.uniforms.curl, CURL);
      glc.uniform1f(vorticityProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      // divergence
      glc.useProgram(divergenceProg.program);
      glc.uniform2f(divergenceProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // clear pressure
      glc.useProgram(clearProg.program);
      glc.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      glc.uniform1f(clearProg.uniforms.value, PRESSURE);
      blit(pressure.write);
      pressure.swap();

      // pressure jacobi
      glc.useProgram(pressureProg.program);
      glc.uniform2f(pressureProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        glc.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      // gradient subtract
      glc.useProgram(gradientProg.program);
      glc.uniform2f(gradientProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(gradientProg.uniforms.uPressure, pressure.read.attach(0));
      glc.uniform1i(gradientProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // advect velocity
      glc.useProgram(advectionProg.program);
      glc.uniform2f(advectionProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (advectionProg.uniforms.dyeTexelSize)
        glc.uniform2f(advectionProg.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      glc.uniform1i(advectionProg.uniforms.uSource, velocity.read.attach(0));
      glc.uniform1f(advectionProg.uniforms.dt, dt);
      glc.uniform1f(advectionProg.uniforms.dissipation, VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

    };

    // Combined dye update: advect + fade + inject ink (single ping-pong).
    // Runs right after applyInput (before the velocity solver) — the buffer
    // region where dye ping-pong is reliable across drivers.
    const updateDye = (dt: number) => {
      const [ir, ig, ib] = inkRef.current;
      glc.disable(glc.BLEND);
      glc.useProgram(dyeUpdateProg.program);
      glc.uniform2f(dyeUpdateProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(dyeUpdateProg.uniforms.uVelocity, velocity.read.attach(0));
      glc.uniform1i(dyeUpdateProg.uniforms.uSource, dye.read.attach(1));
      glc.uniform1f(dyeUpdateProg.uniforms.dt, dt);
      glc.uniform1f(dyeUpdateProg.uniforms.dissipation, DYE_DISSIPATION);
      glc.uniform1f(dyeUpdateProg.uniforms.aspectRatio, canvas.width / canvas.height);
      glc.uniform2f(dyeUpdateProg.uniforms.point, inkSplat.x, inkSplat.y);
      glc.uniform1f(dyeUpdateProg.uniforms.radius, SPLAT_RADIUS);
      glc.uniform1f(dyeUpdateProg.uniforms.amount, inkSplat.amount);
      glc.uniform3f(dyeUpdateProg.uniforms.uInk, ir, ig, ib);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      glc.enable(glc.BLEND);
      glc.blendFunc(glc.SRC_ALPHA, glc.ONE_MINUS_SRC_ALPHA);
      glc.useProgram(displayProg.program);
      glc.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      glc.uniform1f(displayProg.uniforms.uIntensity, 1.7);
      blit(null);
    };


    let lastTime = performance.now();
    let raf = 0;
    let running = true;

    const frame = () => {
      if (!running) return;
      if (resizeCanvas()) initFramebuffers();
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastTime = now;

      applyInput();
      updateDye(dt);
      step(dt);

      // step() leaves its last offscreen velocity framebuffer bound. Bind the
      // default framebuffer explicitly before clearing the visible canvas, or
      // the clear would erase the freshly computed velocity field instead.
      glc.bindFramebuffer(glc.FRAMEBUFFER, null);
      glc.viewport(0, 0, glc.drawingBufferWidth, glc.drawingBufferHeight);
      glc.clearColor(0, 0, 0, 0);
      glc.clear(glc.COLOR_BUFFER_BIT);
      render();

      raf = requestAnimationFrame(frame);
    };
    frame();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastTime = performance.now();
        frame();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
      const ext = glc.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
