import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export default function Home({ theme }: { theme: string }) {
  return (
    <div className="flex-1 flex flex-col justify-evenly items-center dark:bg-black">
      <p className="flex items-center h-20 text-3xl md:text-5xl dark:text-white">
        欢迎来到
        <span className="font-bold text-marquee">
          尘雨尘风
        </span>
        的网站
      </p>
      <div className="container px-8 py-8 lg:px-48 gap-10 lg:gap-24 grid grid-cols-1 md:grid-cols-2">
        <Card
          isPressable
          onPress={() => {
            window.location.href = "https://blog.caoqinping.com";
          }}
          className="bg-slate-100/50 dark:bg-slate-800/50"
        >
          <CardHeader className="flex-col !items-center">
            <p className="font-bold text-slate-800 dark:text-slate-100">
              我的博客
            </p>
          </CardHeader>
          <CardBody className="w-full h-full p-0 overflow-hidden">
            <Image
              src={`${theme == "dark" ? "/blog-dark.jpg" : "/blog-light.jpg"}`}
              alt="blog"
              className="w-full h-full hover:scale-110 transition-transform"
            />
          </CardBody>
        </Card>
        <Card
          isPressable
          onPress={() => {
            window.location.href = "https://game.caoqinping.com";
          }}
          className="bg-blue-50 dark:bg-neutral-900"
        >
          <CardHeader className="flex-col !items-center">
            <p className="font-bold text-sky-800 dark:text-sky-100">扑克游戏</p>
          </CardHeader>
          <CardBody className="w-full h-full p-0 overflow-hidden">
            <Image
              src={`${theme == "dark" ? "/game-dark.jpg" : "/game-light.jpg"}`}
              alt="game"
              className="w-full h-full hover:scale-110 transition-transform"
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
