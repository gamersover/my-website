import { motion } from "framer-motion";
import Image from "next/image";

export default function Home({ theme }: { theme: string }) {
  return (
    <div id="home" className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/logo.svg"
            priority={true}
            alt="logo"
            width={300}
            height={300}
            className="cursor-pointer transition-all duration-300 hover:-translate-y-5 hover:scale-105 md:w-[350px]"
          />
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex max-w-[600px] flex-col items-center justify-center gap-4 text-center"
        >
          <h1 className="bg-gradient-to-r from-blue-800 to-pink-800 dark:from-blue-500 dark:to-pink-500 bg-clip-text text-transparent text-5xl md:text-7xl font-light">陈华杰</h1>
          <h3 className="bg-gradient-to-r from-blue-800 to-pink-800 dark:from-pink-500 dark:to-blue-500 bg-clip-text text-transparent text-2xl md:text-3xl">算法工程师</h3>
          <p className="md:text-base text-sm text-gray-700 dark:text-gray-400">
          我是一名经验丰富的算法工程师，除了专注于人工智能和算法领域外，也会使用前后端多种技术栈。在前端开发中，熟练使用Vue 3、React框架，并应用Tailwind CSS进行高效布局。后端方面，具备使用FastAPI构建高效API的能力。也积极分享知识，撰写技术博客，帮助更多开发者了解和应用前沿技术。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
