import { ChevronDownIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/Buttons";
import { cn } from "../utils";

const Landing = () => {
  return (
    <main className="max-w-7xl mx-auto px-4">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <GetStarted />
      <Footer />
    </main>
  );
};

const navItems = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "How it works",
    href: "#how-it-works",
  },
  {
    name: "Get started",
    href: "#get-started",
  },
];

const Header = () => {
  return (
    <header className="flex h-20 justify-between items-center">
      <span className="font-bold text-xl text-zinc-100">Doguihabits</span>

      <ul className="flex gap-4">
        {navItems.map((item) => {
          return (
            <li key={item.name}>
              <a
                className="active:text-white font-medium text-zinc-400"
                href={item.href}
              >
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>

      <Button className={cn("bg-emerald-600 font-medium text-white")}>
        Sign Up
      </Button>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative py-40">
      <span className="uppercase tracking-widest block  text-emerald-500">
        doguihabits
      </span>
      <h1 className="text-5xl font-bold text-white max-w-[20ch] leading-tight">
        Your Personal Habit Transformation Journey
      </h1>
      <p className="text-lg text-zinc-400 font-medium mt-10 max-w-[60ch]">
        Welcome to doguihabits, the simple yet powerful habit tracker designed
        to empower your journey towards personal growth and transformation.
      </p>
      <div className="flex gap-4 items-center mt-12">
        <Button className={"bg-emerald-600 text-white font-medium"}>
          Sign up
        </Button>
        <Button className={"text-white font-medium"}>Contact us</Button>
      </div>
      <ChevronDownIcon className="animate-bounce absolute left-0 right-0 mx-auto bottom-0 h-10 w-10 text-zinc-50" />
    </section>
  );
};

const Features = () => {
  return <section id="features"></section>;
};

const Layout = () => {
  return <div></div>;
};

const HowItWorks = () => {
  return <section></section>;
};

const GetStarted = () => {
  return <section></section>;
};

const footerLinks = [
  {
    name: "Github",
    href: "https://github.com/GuidoCarda/doguihabits",
    iconSrc: "../public/github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/guido-cardarelli/",
    iconSrc: "../public/linkedin.svg",
  },
];

const Footer = () => {
  return (
    <footer className="border-t-[1px] border-zinc-800 pt-10">
      <div>
        <div className="flex flex-col gap-10 items-center md:gap-0 md:flex-row md:justify-center">
          <span className="font-bold text-xl text-zinc-100">Doguihabits</span>

          <ul className="flex gap-10 md:ml-auto">
            {footerLinks.map((item) => {
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

export default Landing;
