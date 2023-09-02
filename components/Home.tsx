import { Card, CardHeader } from "@nextui-org/card"
import {Image} from "@nextui-org/image"

export default function Home() {
  return (
    <div className="h-full min-h-screen flex flex-col justify-center items-center dark:bg-black">
      <p className="text-5xl mb-10 dark:text-white">欢迎来到我的网站</p>
      <div className="container mx-auto p-8 gap-8 grid grid-cols-1 md:grid-cols-2">
        <Card
          isPressable
          onPress={() => {
            window.location.replace("https://blog.caoqinping.com");
          }}
          className="bg-amber-100/50 dark:bg-amber-800/50 hover:-translate-y-3 transition-transform"
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
          className="bg-sky-100/50 dark:bg-sky-800/50 hover:-translate-y-3 transition-transform"
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
