"use client";
import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  targetR: number;
  opacity: number;
  maxOpacity: number;
  age: number;
  maxAge: number;
  sx: number;
  sy: number;
}

function parseHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function InkCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const blobs = useRef<Blob[]>([]);
  const raf = useRef(0);
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnBlobs = (x: number, y: number, vx: number, vy: number) => {
      const speed = Math.hypot(vx, vy);
      const n = Math.min(Math.ceil(speed / 10) + 1, 4);
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const d = Math.random() * 10;
        blobs.current.push({
          x: x + Math.cos(ang) * d,
          y: y + Math.sin(ang) * d,
          vx: vx * 0.1 + (Math.random() - 0.5) * 1.5,
          vy: vy * 0.1 + (Math.random() - 0.5) * 1.5,
          r: 4 + Math.random() * 5,
          targetR: 55 + Math.random() * 90,
          opacity: 0,
          maxOpacity: 0.09 + Math.random() * 0.1,
          age: 0,
          maxAge: 110 + Math.random() * 90,
          sx: 0.75 + Math.random() * 0.5,
          sy: 0.75 + Math.random() * 0.5,
        });
      }
      if (blobs.current.length > 300) {
        blobs.current = blobs.current.slice(-300);
      }
    };

    let px = 0;
    let py = 0;
    const onMove = (e: MouseEvent) => {
      const vx = e.clientX - px;
      const vy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      if (Math.hypot(vx, vy) > 2) {
        spawnBlobs(e.clientX, e.clientY, vx, vy);
      }
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.current = blobs.current.filter((b) => {
        b.age++;
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.97;
        b.vy *= 0.97;
        // Ink drop expands quickly at first, then slows
        b.r += (b.targetR - b.r) * 0.022;

        const t = b.age / b.maxAge;
        // Fade in fast, fade out smoothly
        b.opacity =
          t < 0.12
            ? b.maxOpacity * (t / 0.12)
            : b.maxOpacity * Math.pow(1 - (t - 0.12) / 0.88, 1.6);

        if (b.age >= b.maxAge) return false;

        const [r, g, bv] = parseHex(colorRef.current);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.sx, b.sy);

        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, b.r);
        grd.addColorStop(0, `rgba(${r},${g},${bv},${b.opacity})`);
        grd.addColorStop(0.4, `rgba(${r},${g},${bv},${b.opacity * 0.55})`);
        grd.addColorStop(0.75, `rgba(${r},${g},${bv},${b.opacity * 0.18})`);
        grd.addColorStop(1, `rgba(${r},${g},${bv},0)`);

        ctx.beginPath();
        ctx.arc(0, 0, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();

        return true;
      });

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
