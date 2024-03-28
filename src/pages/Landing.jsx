import {
  CheckBadgeIcon,
  CheckIcon,
  ChevronDownIcon,
  FireIcon,
  HeartIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { cn, getPast7Days, getWeekDayString, nextState } from "../utils";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { IconButton } from "../components/Buttons";
import { useState } from "react";
import { ENTRY_STATE, HABIT_MILESTONES } from "../constants";

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
      <Link to={"/"} className="font-bold leading-none text-xl text-zinc-100">
        Doguihabits
      </Link>

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
    <section className="relative min-h-[calc(100vh-_5rem)] py-36 md:py-40 flex flex-col items-center">
      <div className="min-w-fit text-center">
        <span className="uppercase tracking-widest block  text-emerald-500">
          doguihabits
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white max-w-[18ch] leading-tight">
          Your Personal Habit Transformation Journey
        </h1>
        <p className="md:text-lg text-zinc-400 font-medium mt-6 md:mt-10 max-w-[50ch]">
          Welcome to doguihabits, the simple yet powerful habit tracker designed
          to empower your journey towards personal growth and transformation.
        </p>
        <div className="flex gap-4 justify-center items-center mt-12">
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
      </div>

      <div className="absolute bottom-0 flex items-end justify-center overflow-hidden h-full border-green-600/5 w-full">
        <motion.div
          initial={{ y: 100, scale: 0.1, x: 380, opacity: 0, rotate: 0 }}
          animate={{ y: -125, x: 385, scale: 0.7, opacity: 1, rotate: -20 }}
          transition={{ duration: 1.2 }}
          className="h-20 place-content-center text-center grid w-20 border justify-self-center rounded-md"
        >
          <span className="text-zinc-400 text-2xl font-bold">14</span>
          <span className="text-zinc-400">days</span>
        </motion.div>

        <motion.div
          initial={{ y: 80, scale: 0.1, x: -320, opacity: 0, rotate: -5 }}
          animate={{ y: -100, x: -320, scale: 0.7, opacity: 1, rotate: 25 }}
          transition={{ duration: 1.7 }}
          className="h-20 place-content-center text-center grid w-20 border justify-self-center rounded-md"
        >
          <span className="text-zinc-400 text-2xl font-bold">30</span>
          <span className="text-zinc-400">days</span>
        </motion.div>
        {/* <motion.div
          initial={{ y: 0, x: -50, opacity: 0, rotate: 0 }}
          animate={{ y: -120, x: -400, opacity: 1, rotate: 40 }}
          transition={{ duration: 1.5 }}
          className="h-20 w-20 border justify-self-center border-white rounded-md"
        /> */}
        <motion.span
          initial={{ y: 50, x: -20, opacity: 0, rotate: 0 }}
          animate={{ y: -45, x: -20, opacity: 1, rotate: -40 }}
          transition={{ duration: 1 }}
          className="h-10 w-10 rounded-md bg-emerald-500 block"
        />
        <motion.span
          initial={{ y: 50, x: -300, opacity: 0, rotate: 0 }}
          animate={{ y: -80, x: -300, opacity: 1, rotate: 40 }}
          transition={{ duration: 1 }}
          className="h-10 w-10 rounded-md bg-emerald-500 block"
        />
        <motion.span
          initial={{ y: 50, x: 300, opacity: 0, rotate: 0 }}
          animate={{ y: -30, x: 300, opacity: 1, rotate: 20 }}
          transition={{ duration: 1 }}
          className="h-10 w-10 rounded-md bg-emerald-500 block"
        />
        <motion.span
          initial={{ y: 50, x: 25, opacity: 0, rotate: 0 }}
          animate={{ y: -75, x: 25, opacity: 1, rotate: -35 }}
          transition={{ duration: 1 }}
          className="h-10 w-10 rounded-md bg-red-500 block"
        />
      </div>

      <div>
        <div className="h-4 w-32 block absolute -bottom-2 left-0 bg-gradient-to-r from-zinc-900 z-10"></div>
        <div className="h-4 w-32 block absolute -bottom-2 right-0 bg-gradient-to-l from-zinc-900 z-10 "></div>
        <span className="border-t absolute left-0  right-0 w-full bottom-0 border-white/10 block" />
      </div>
    </section>
  );
};

// const Hero = () => {
//   return (
//     <section className="relative py-36 md:py-40  flex lg:gap-10 overflow-visible">
//       <div className="min-w-fit ">
//         <span className="uppercase tracking-widest block  text-emerald-500">
//           doguihabits
//         </span>
//         <h1 className="text-4xl md:text-5xl font-bold text-white max-w-[18ch] leading-tight">
//           Your Personal Habit Transformation Journey
//         </h1>
//         <p className="md:text-lg text-zinc-400 font-medium mt-6 md:mt-10 max-w-[50ch]">
//           Welcome to doguihabits, the simple yet powerful habit tracker designed
//           to empower your journey towards personal growth and transformation.
//         </p>
//         <div className="flex gap-4 items-center mt-12">
//           <Link
//             className={
//               "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white "
//             }
//             to={"/login"}
//           >
//             Sign Up
//           </Link>
//           <Link
//             className={
//               "font-medium h-10 px-6 grid place-content-center rounded-md text-white "
//             }
//             to={"/contact"}
//           >
//             Contact us
//           </Link>
//         </div>
//       </div>

//       <div className="relative  hidden lg:block self-center md:w-full">
//         <div className="flex flex-col gap-6">
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="w-max"
//           >
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-zinc-50 mb-2 text-sm"
//             >
//               Code everyday
//             </motion.p>
//             <motion.ul className="flex gap-2">
//               {Array.from({ length: 7 }).map((_, index) => {
//                 return (
//                   <motion.li
//                     animate={{
//                       backgroundColor:
//                         Math.random() < 0.9 ? "#10B981" : "#EF4444",
//                     }}
//                     transition={{ delay: index * 0.4 }}
//                     key={index}
//                     className={cn(
//                       "h-10 w-10 grid place-content-center border border-white/5 rounded-md"
//                     )}
//                   ></motion.li>
//                 );
//               })}
//             </motion.ul>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{
//               delay: 0.5,
//             }}
//             className="w-max self-center"
//           >
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-zinc-50 mb-2 text-sm"
//             >
//               Code everyday
//             </motion.p>
//             <ul className="flex gap-2">
//               {Array.from({ length: 7 }).map((_, index) => {
//                 return (
//                   <motion.li
//                     animate={{
//                       backgroundColor:
//                         Math.random() < 0.9 ? "#10B981" : "#EF4444",
//                     }}
//                     transition={{ delay: index * 0.4 }}
//                     key={index}
//                     className={cn(
//                       "h-10 w-10 grid place-content-center border border-white/5 rounded-md"
//                     )}
//                   ></motion.li>
//                 );
//               })}
//             </ul>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{
//               delay: 1,
//             }}
//             className="w-max self-end"
//           >
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-zinc-50 mb-2 text-sm"
//             >
//               Code everyday
//             </motion.p>
//             <motion.ul className="flex gap-2">
//               {Array.from({ length: 7 }).map((_, index) => {
//                 return (
//                   <motion.li
//                     animate={{
//                       backgroundColor:
//                         Math.random() < 0.9 ? "#10B981" : "#EF4444",
//                     }}
//                     transition={{ delay: index * 0.4 }}
//                     key={index}
//                     className={cn(
//                       "h-10 w-10 grid place-content-center border border-white/5 rounded-md"
//                     )}
//                   ></motion.li>
//                 );
//               })}
//             </motion.ul>
//           </motion.div>
//         </div>
//         <Badge
//           motionConfig={{
//             initial: { opacity: 0, y: -10, scale: 0 },
//             animate: { opacity: 1, y: 0, scale: 0.5 },
//             transition: { delay: 1.5 },
//           }}
//           milestone={7}
//           className={"absolute rotate-12 top-0 right-0"}
//         />
//         <Badge
//           motionConfig={{
//             initial: { opacity: 0, y: -10, scale: 0 },
//             animate: { opacity: 1, y: 0, rotate: -20, scale: 0.7 },
//             transition: { delay: 1.5 },
//           }}
//           milestone={30}
//           className={"absolute  -rotate-6 bottom-0 left-0"}
//         />
//       </div>
//       <div>
//         <div className="h-4 w-32 block absolute -bottom-2 left-0 bg-gradient-to-r from-zinc-900 z-10"></div>
//         <div className="h-4 w-32 block absolute -bottom-2 right-0 bg-gradient-to-l from-zinc-900 z-10 "></div>
//         <span className="border-t absolute left-0  right-0 w-full bottom-0 border-white/10 block" />
//       </div>
//     </section>
//   );
// };

const Features = () => {
  return (
    <>
      <h2 className="text-4xl font-bold text-white mt-20  text-center mb-12">
        Key features
      </h2>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-3 mb-20">
        {/* Feature card 1 */}
        <div className="relative group md:row-span-2 w-full h-80 md:h-full p-6 hover:border-white/20 transition-colors duration-200 border border-white/10  rounded-md ">
          <h3 className="text-white text-xl font-bold mb-2">
            Effortless Habit Tracking:{" "}
          </h3>
          <p className="text-zinc-300 text-lg font-medium">
            Create, update, and delete habits with ease.
          </p>

          <div className="absolute bottom-20  border-white/5 w-[calc(100%-_3rem)] flex items-start justify-center gap-10 px-4 ">
            <div className="border bg-zinc-900 border-white/5 rounded z-10 py-1 px-2 absolute flex gap-4 justify-center group-hover:-translate-y-12 group-hover:opacity-100 opacity-0  transition-all duration-300 delay-200 ">
              <span className="text-sm block text-transparent group-hover:text-zinc-500 transition-colors select-none ">
                Coding
              </span>
              <span className="text-sm block  text-transparent group-hover:text-zinc-500 transition-colors select-none ">
                Reading
              </span>
              <span className="text-sm block text-transparent group-hover:text-zinc-500 transition-colors select-none ">
                Studying
              </span>
              <span className="text-sm block  text-transparent group-hover:text-zinc-500 transition-colors select-none ">
                Meditating
              </span>
            </div>

            <span className="group/action grid translate-y-12 rotate-3 group-hover:rotate-0 group-hover:translate-y-0 place-content-center group-hover:text-zinc-100 hover:border-emerald-500/50 group-hover:bg-zinc-800 transition-all duration-500 text-zinc-700 border border-white/5  rounded-md h-16 w-16">
              <span className="absolute w-px h-6 -z-10 -top-6 opacity-0 place-self-center bg-emerald-500/50 transition-colors delay-200 group-hover/action:opacity-100" />
              <PlusIcon className="h-8 w-8" strokeWidth={2} />
            </span>
            <span className="group/action grid -translate-y-4 -rotate-6 group-hover:rotate-0 group-hover:translate-y-0 place-content-center group-hover:text-zinc-100 hover:border-emerald-500/50 group-hover:bg-zinc-800 transition-all duration-500 text-zinc-700 border border-white/5  rounded-md h-16 w-16">
              <span className="absolute w-px h-6 -z-10 -top-6 opacity-0 place-self-center bg-emerald-500/50 transition-colors delay-200 group-hover/action:opacity-100" />
              <PencilIcon className="h-8 w-8" strokeWidth={2} />
            </span>
            <span className="group/action grid translate-y-10 rotate-2 group-hover:rotate-0 group-hover:translate-y-0 place-content-center group-hover:text-zinc-100  hover:border-emerald-500/50  group-hover:bg-zinc-800 transition-all duration-500 text-zinc-700 border border-white/5  rounded-md h-16 w-16">
              <span className="absolute w-px h-6 -z-10 -top-6 opacity-0 place-self-center bg-emerald-500/50 transition-colors delay-200 group-hover/action:opacity-100 " />
              <TrashIcon className="h-8 w-8" strokeWidth={2} />
            </span>
          </div>
        </div>
        {/* Feature card 2 */}
        <div className="relative group md:row-span-2 w-full h-80 md:col-span-2 md:h-full  p-6 overflow-hidden  hover:border-white/20 transition-colors duration-200 border border-white/10  rounded-md ">
          <h3 className="text-white text-xl font-bold mb-2">
            Visual Summary:{" "}
          </h3>
          <p className="text-zinc-300 z-10 text-lg font-medium">
            See your habits at a glance with a clean and interactive interface.
          </p>
          <div className="absolute h-full w-full z-10 inset-0 bg-gradient-to-tl  pointer-events-none transtion-all duration-500 from-zinc-900 to-transparent group-hover:opacity-0"></div>
          <div
            className={
              "absolute bottom-0 right-0 flex gap-10 translate-y-10 translate-x-16  group-hover:translate-y-4 md:translate-y-10 md:translate-x-24  md:group-hover:-translate-y-4 md:group-hover:translate-x-10 transition-transform duration-500"
            }
          >
            <WeekView
              habitTitle={"Code"}
              className={
                "flex-shrink-0 grayscale max-w-max  group-hover:grayscale-0 transition-colors"
              }
            />
            <WeekView
              habitTitle={"meditate"}
              className={
                "flex-shrink-0 grayscale max-w-max  group-hover:grayscale-0 transition-colors"
              }
            />
          </div>
        </div>
        {/* Feature card 3 */}
        <div className="relative group md:col-span-3 w-full h-80 sm:h-40  p-6  overflow-hidden  hover:border-white/20 transition-colors duration-200 border  border-white/10   rounded-md ">
          <h3 className="text-white text-xl font-bold mb-2">
            Milestones and Badges
          </h3>
          <p className="text-zinc-300 text-lg font-medium">
            Achieve milestones and earn badges for your dedication.
          </p>
          <div className="-z-10 absolute flex items-center w-full bottom-10 justify-between mx-auto sm:w-auto sm:gap-10 sm:mx-0 sm:inset-y-0 sm:right-10">
            <Badge
              milestone={7}
              className={
                "-translate-y-5 rotate-3  group-hover:translate-y-0 group-hover:rotate-0"
              }
            />
            <Badge
              milestone={21}
              className={
                "translate-y-5 -rotate-3 group-hover:delay-75 group-hover:translate-y-0 group-hover:rotate-0"
              }
            />
            <Badge
              milestone={60}
              className={
                "-translate-y-5 rotate-3 group-hover:delay-100  group-hover:translate-y-0 group-hover:rotate-0"
              }
            />
            <Badge
              milestone={365}
              className={
                "translate-y-5 rotate-3  group-hover:delay-150 group-hover:translate-y-0 group-hover:rotate-0"
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

const Badge = ({ className, milestone, motionConfig }) => {
  return (
    <motion.div
      {...motionConfig}
      className={cn(
        " bg-transparent border border-white/5 text-center group-hover:bg-zinc-800 h-[90px] w-[90px] rounded-lg  grid content-center transition-color duration-500 flex-shrink-0",
        className
      )}
    >
      <span
        className={cn(
          "block text-4xl font-bold group-hover:text-emerald-500 text-zinc-600"
        )}
      >
        {milestone}
      </span>
      <span className={cn("block group-hover:text-zinc-400 text-zinc-700")}>
        days
      </span>
    </motion.div>
  );
};

function WeekView({ habitTitle, className }) {
  const [week, setWeek] = useState(() =>
    getPast7Days().map((date) => {
      const state =
        Math.random * 1 < 0.3 ? ENTRY_STATE.pending : ENTRY_STATE.completed;

      return { date, state };
    })
  );

  const currentStreak = week.reduce(
    (acum, val) => (val.state === ENTRY_STATE.completed ? (acum += 1) : acum),
    0
  );

  const completionPercentage = Math.round((currentStreak * 100) / 7);

  return (
    <motion.div
      layout="preserve-aspect"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "bg-zinc-800 rounded-xl text-neutral-100 space-y-4 w-full mx-auto select-none",
        "md:max-w-max md:mx-0",
        className
      )}
    >
      <div className="flex px-4 pt-4 items-center justify-between gap-4">
        <div>
          <span className="block font-bold text-lg capitalize">
            {habitTitle}
          </span>
          <span className="text-xs  bg-zinc-700 text-zinc-300   h-4 leading-2 grid place-items-center px-2 rounded-sm">
            Created {new Date().toLocaleDateString()}
          </span>
        </div>
        <IconButton
          aria-label="delete habit"
          className={
            "group/delete hover:bg-red-700/30 bg-zinc-700 flex-shrink-0"
          }
        >
          <TrashIcon className="h-4 transition-transform group-hover/delete:text-red-500 group-hover/delete:scale-110" />
        </IconButton>
      </div>

      <div className="grid grid-cols-7 gap-4 px-4">
        {week
          .sort((a, b) => a.date - b.date)
          .map(({ date, state }, index) => {
            return (
              <div key={`day-${index}`}>
                <span className="block text-xs w-10 text-center font-semibold text-zinc-400 pb-1">
                  {getWeekDayString(date.getDay()).slice(0, 3)}
                </span>
                <button
                  aria-label="toggle habit state"
                  onClick={() => {
                    setWeek((prev) =>
                      prev.map((entry) =>
                        entry.date.getDate() === date.getDate()
                          ? { ...entry, state: nextState(state) }
                          : entry
                      )
                    );
                  }}
                  className={cn(
                    "rounded-md h-10 w-10 font-semibold border-2 border-transparent transition-colors duration-300",
                    {
                      "bg-success": state === ENTRY_STATE.completed,
                      "bg-failed": state === ENTRY_STATE.failed,
                      "bg-zinc-700":
                        state !== ENTRY_STATE.failed &&
                        state !== ENTRY_STATE.completed,
                    },
                    "outline-none enabled:hover:border-white/30 focus:ring-2 focus:ring-white/20",
                    "disabled:cursor-not-allowed disabled:text-white/30 disabled:bg-transparent"
                  )}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
      </div>

      <div className="border-t-2 px-4 pb-2 pt-2  text-zinc-400  border-zinc-700 flex gap-2">
        <div className="flex  items-center gap-1">
          <FireIcon className="h-5 w-5 stroke-red-500" strokeWidth="2" />
          <span className="text-sm   font-semibold select-none">
            {currentStreak}
          </span>
        </div>
        <div className="flex group items-center gap-1 ">
          <CheckBadgeIcon
            className="h-5 w-5 stroke-emerald-500"
            strokeWidth="2"
          />
          <span className="text-sm  font-semibold select-none">
            {completionPercentage}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

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
