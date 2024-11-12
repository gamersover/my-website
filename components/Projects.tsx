import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  {
    title: "博客",
    description:
      "使用Hexo搭建的个人博客，主要用于记录学习笔记，以及一些生活点滴。会分享各种技术文章和学习笔记，记录了我在人工智能、算法领域和前后端方向的探索与实践经验。博客内容涵盖深度学习、机器学习、算法优化等多方面内容。在这里，我分享前沿技术的学习笔记，以及解决问题的思路方法。",
    imgSrc: "/blog-light.jpg",
    darkImgeSrc: "/blog-dark.jpg",
    link: "https://blog.caoqinping.com",
    technologies: ["Hexo"],
  },
  {
    title: "四人纸牌游戏",
    description:
      "这是我开发的四人联机纸牌游戏，使用 Next.js、React 和 Tailwind CSS 构建，使用WebSocket技术实现实时通信。游戏支持玩家创建或加入房间，与其他三名玩家实时对战，并提供房间内的聊天功能和背景音乐，使游戏体验更具互动性和娱乐性。",
    imgSrc: "/game-light.jpg",
    darkImgeSrc: "/game-dark.jpg",
    link: "https://game.caoqinping.com",
    technologies: ["Nextjs", "React", "Tailwindcss", "WebSocket"],
  },
  {
    title: "LLM游乐场",
    description:
      "这是一个复刻 OpenAI 大模型调试平台的项目，使用 Nuxt.js、Vue3 和 Tailwind CSS 搭建，支持对私有化部署的大模型进行便捷的调试操作。该平台为大模型的本地化开发和实验提供了直观的界面，方便用户测试、优化和验证模型性能。",
    imgSrc: "/playground-light.jpg",
    darkImgeSrc: "/playground-dark.jpg",
    link: "https://playground.caoqinping.com",
    technologies: ["Nuxtjs", "Vue", "Tailwindcss"],
  },
];

type ProjectType = (typeof projects)[0];

const ScrollReveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

const ProjectCard = ({
  project,
  theme,
}: {
  project: ProjectType;
  theme: string;
}) => {
  return (
    <ScrollReveal>
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-24">
        <Image
          src={theme === "dark" ? project.darkImgeSrc : project.imgSrc}
          alt=""
          width={1000}
          height={1000}
          onClick={() => (window.location.href = project.link)}
          className="cursor-pointer w-full rounded-2xl transition-all duration-300 hover:scale-105 md:w-[300px]"
        />
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="text-xl font-semibold">{project.title}</div>
            <p className="text-gray-700 dark:text-slate-200">
              {project.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="rounded-lg bg-black text-white dark:bg-neutral-900 dark:text-slate-100 p-3"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default function Projects({ theme }: { theme: string }) {
  return (
    <div
      id="projects"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-16 p-4 md:px-14 md:py-24"
    >
      <h1 className="text-4xl font-light md:text-6xl">我的项目</h1>
      <div className="flex w-full max-w-[1000px] flex-col gap-16">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} theme={theme} />
        ))}
      </div>
    </div>
  );
}
