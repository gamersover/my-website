import { Card, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-full min-h-screen flex flex-col justify-evenly items-center dark:bg-black">
      <p className="flex items-center h-20 text-3xl md:text-5xl dark:text-white">
        欢迎来到
        <span className="text-cyan-600 dark:text-cyan-100 font-bold">尘雨尘风</span>
        的网站
      </p>
      <div className="container px-8 py-8 lg:px-48 gap-10 lg:gap-24 grid grid-cols-1 md:grid-cols-2">
        <Card
          isPressable
          onPress={() => {
            window.location.href = "https://blog.caoqinping.com"
          }}
          className="bg-slate-100/50 dark:bg-slate-800/50 hover:scale-105 transition-transform"
        >
          <CardHeader className="flex-col !items-center">
            <p className="font-bold text-slate-800 dark:text-slate-100">
              我的博客
            </p>
          </CardHeader>
          <Image src={`${theme == "dark" ? "/blog-dark.jpg" : "/blog-light.jpg"}`} alt="blog" className="w-full h-full" />
        </Card>
        <Card
          isPressable
          onPress={() => {
            window.location.href = "https://game.caoqinping.com"
          }}
          className="bg-sky-100/50 dark:bg-sky-800/50 hover:scale-105 transition-transform"
        >
          <CardHeader className="flex-col !items-center">
            <p className="font-bold text-sky-800 dark:text-sky-100">扑克游戏</p>
          </CardHeader>
          <Image src="/game.jpg" alt="game" className="w-full h-full" />
        </Card>
      </div>
    </div>
  );
}
