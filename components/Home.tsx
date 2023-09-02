import { Card, CardHeader } from "@nextui-org/card"
import {Image} from "@nextui-org/image"

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center dark:bg-black">
      <p className="text-5xl mb-10 dark:text-white">欢迎来到我的网站</p>
      <div className="flex flex-wrap gap-8 justify-center">
        <Card
          isPressable
          onPress={() => {
            window.location.replace("https://blog.caoqinping.com");
          }}
          className="bg-amber-100/50 dark:bg-amber-800/50 w-[90%] md:w-1/3 h-1/2 md:h-full hover:-translate-y-3 transition-transform"
        >
          <CardHeader className="flex-col !items-center">
            <p className="font-bold text-amber-800 dark:text-amber-100">
              我的博客
            </p>
          </CardHeader>
          <Image src="/blog.jpg" alt="blog" className="w-full h-full" />
        </Card>
        <Card
          isPressable
          onPress={() => {
            window.location.replace("https://game.caoqinping.com");
          }}
          className="bg-sky-100/50 dark:bg-sky-800/50 w-[90%] md:w-1/3 h-1/2 md:h-full hover:-translate-y-3 transition-transform"
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
