import { BiLogoApple, BiLogoGithub, BiLogoGmail } from "react-icons/bi";

export default function Contact() {
  return (
    <div
      id="contact"
      className="flex min-h-[100vh] min-w-full items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center gap-3 space-y-6 p-14">
        <h1 className="text-center text-5xl md:text-7xl">
          <span className="text-4xl font-light md:text-6xl">联系</span>
        </h1>

        <p className="text-center text-lg font-semibold">
          通过下方的按钮发送邮件，可以直接与我联系
        </p>
        <div className="gap-5 flex flex-wrap">
          <a
            href="mailto:cmathking@gmail.com"
            className="group flex items-center gap-2 rounded-lg border px-5 py-3 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <BiLogoGmail className="text-2xl group-hover:text-red-500 dark:group-hover:text-red-700" />
            <span className="text-lg font-bold group-hover:text-red-500 dark:group-hover:text-red-700">Email</span>
          </a>
          <a href="https://github.com/gamersover" className="group flex items-center gap-2 rounded-lg border px-5 py-3 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <BiLogoGithub className="text-2xl group-hover:text-blue-500 dark:group-hover:text-blue-700" />
            <span className="text-lg font-bold group-hover:text-blue-500 dark:group-hover:text-blue-700">Github</span>
          </a>
        </div>
      </div>
    </div>
  );
}
