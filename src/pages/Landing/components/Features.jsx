import {
  CheckBadgeIcon,
  FireIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { cn, getPast7Days, getWeekDayString, nextState } from "../../../utils";
import { motion } from "framer-motion";
import { ENTRY_STATE } from "../../../constants";
import { IconButton } from "../../../components/Buttons";
import { useState } from "react";

const Features = () => {
  return (
    <section id="features" className="py-10 md:py-20">
      <h2 className="text-4xl font-bold text-white mt-20  text-center mb-12">
        Key features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-3">
        {/* Feature card 1 */}
        <div className="relative group md:row-span-2 w-full h-80 md:h-full p-6 hover:border-white/20 transition-colors duration-200 border border-white/10  rounded-md">
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
      </div>
    </section>
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

export default Features;
