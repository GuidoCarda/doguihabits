import { ChevronDownIcon, HeartIcon } from "@heroicons/react/24/outline";
import { cn } from "../utils";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <main className="scroll-smooth max-w-7xl mx-auto px-4">
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
  const { user, isLoading } = useAuth();

  return (
    <header className="flex h-20  items-center">
      <span className="font-bold leading-none text-xl text-zinc-100">
        Doguihabits
      </span>

      <ul className="hidden sm:ml-10 sm:flex sm:justify-self-center sm:gap-4">
        {navItems.map((item) => {
          return (
            <li key={item.name}>
              <a
                className="active:text-white leading-none font-medium text-zinc-400 hover:text-white transition-color duration-150"
                href={item.href}
              >
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>

      {!isLoading && (
        <Link
          className={
            "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white ml-auto"
          }
          to={user ? "/habits" : "/login"}
        >
          {user ? "My Habits" : "Sign Up Now"}
        </Link>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative py-36 md:py-40">
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
        <Link
          className={
            "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white "
          }
          to={"/login"}
        >
          Sign Up
        </Link>
        <Link
          className={
            "font-medium h-10 px-6 grid place-content-center rounded-md text-white "
          }
          to={"/contact"}
        >
          Contact us
        </Link>
      </div>
      <ChevronDownIcon className="animate-bounce absolute left-0 right-0 mx-auto bottom-0 h-10 w-10 text-zinc-50" />
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-10 md:py-20">
      <h2 className="text-4xl font-bold text-white  text-center mb-12">
        Key features
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="border-l-2 border-zinc-800 pl-4">
          <h3 className="text-white text-xl font-bold mb-2">
            Effortless Habit Tracking:{" "}
          </h3>
          <p className="text-zinc-300 text-lg font-medium">
            Create, update, and delete habits with ease.
          </p>
        </div>
        <div className="border-l-2 border-zinc-800 pl-4">
          <h3 className="text-white text-xl font-bold mb-2">
            Visual Summary:{" "}
          </h3>
          <p className="text-zinc-300 text-lg font-medium">
            See your habits at a glance with a clean and intuitive interface.
          </p>
        </div>
        <div className="border-l-2 border-zinc-800 pl-4">
          <h3 className="text-white text-xl font-bold mb-2">
            Milestones and Badges
          </h3>
          <p className="text-zinc-300 text-lg font-medium">
            Achieve milestones and earn badges for your dedication.
          </p>
        </div>
      </div>
    </section>
  );
};

const Layout = () => {
  return <div></div>;
};

const howItWorks = [
  {
    title: "Create Your Habits",
    description: "Input your habit details and start tracking from day one",
  },
  {
    title: "Visualize Your Progress",
    description:
      "Use the summary view for a quick overview and the calendar-like view for detailed history.",
  },
  {
    title: "Celebrate Achievements",
    description: "Reach milestones, earn badges and keep the motivation high.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-10 md:py-20">
      <h2 className="text-4xl font-bold text-white text-center mb-12 ">
        How it works?
      </h2>
      <div className="select-none flex flex-col max-w-4xl mx-auto gap-10">
        {howItWorks.map((item, index) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: "all" }}
              className={cn(
                `group md:flex md:items-center md:gap-10  max-w-lg`,
                {
                  "self-center": index === 1,
                  "self-end": index === 2,
                }
              )}
            >
              <h3 className="group-hover:text-emerald-600 transition-colors text-5xl mb-4 text-zinc-400 font-bold  md:h-20 md:w-20 flex-shrink-0 md:grid md:place-content-center">
                {index + 1}
              </h3>
              <div className="p-4 rounded-lg bg-zinc-800 border-[1px] border-zinc-600">
                <p className="text-white mb-1 text-lg font-medium ">
                  {item.title}
                </p>
                <p className="text-zinc-400  font-medium">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="text-center flex items-center flex-col my-10  md:my-20 "
    >
      <h2 className="text-4xl font-bold text-white mb-6">Get Started Today!</h2>
      <p className="text-zinc-300 text-lg font-medium max-w-[60ch]">
        Ready to embark on your habit transformation journey? Join DoguiHabits
        now and take the first step towards a more disciplined, healthier, and
        happier you.
      </p>

      <Link
        className={
          "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white mt-10"
        }
        to={"/login"}
      >
        Sign Up Now
      </Link>
    </section>
  );
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
