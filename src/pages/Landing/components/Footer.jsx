import { HeartIcon } from "@heroicons/react/24/outline";

const links = [
  {
    name: "Github",
    href: "https://github.com/GuidoCarda/doguihabits",
    iconSrc: "/github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/guido-cardarelli/",
    iconSrc: "/linkedin.svg",
  },
];

const Footer = () => {
  return (
    <footer className="border-t-[1px] border-zinc-800 pt-10">
      <div>
        <div className="flex flex-col gap-10 items-center md:gap-0 md:flex-row md:justify-center">
          <span className="font-bold text-xl text-zinc-100">Doguihabits</span>

          <ul className="flex gap-10 md:ml-auto">
            {links.map((item) => {
              return (
                <li key={item.name} className="">
                  <a
                    target="_black"
                    rel="noopener"
                    className="active:text-white font-medium hover:text-white transition-colors durations-100 text-zinc-400 flex gap-4 items-center"
                    href={item.href}
                  >
                    <img src={item.iconSrc} className="h-8 w-8" />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <span className="font-medium text-zinc-400 mb-4 mt-16 md:mt-10 flex items-center justify-center">
        Developed by
        <a
          className="mx-1 hover:text-emerald-500 transition-colors duration-300"
          target="_blank"
          rel="noopener"
          href="https://github.com/guidocarda"
        >
          Guido Cardarelli
        </a>{" "}
        with
        <HeartIcon className="ml-2 h-5 hover:scale-110 transition-transform w-5 text-emerald-500" />
      </span>
    </footer>
  );
};

export default Footer;
