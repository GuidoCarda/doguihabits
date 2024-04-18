import ReactDom from "react-dom";
import { forwardRef } from "react";
import { Button } from "./Buttons";
import { Backdrop } from "./Modal";
import { MilestoneBadge } from "../pages/HabitDetail";
import { cn } from "../utils";

import { motion } from "framer-motion";
import useMilestoneDialogStore from "../store/useMilestoneDialogStore";
import { HABIT_MILESTONES_MESSAGES } from "../constants";

const MilestoneDialog = ({ open, onClose }, ref) => {
  const milestone = useMilestoneDialogStore((state) => state.milestone);

  if (!open) return;

  return ReactDom.createPortal(
    <Backdrop>
      <motion.div
        ref={ref}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        key={"confirmDialog"}
        aria-modal="true"
        className="bg-zinc-900 border-2 border-zinc-800 mx-10 px-4 py-10 rounded-lg text-center w-11/12 sm:w-full sm:max-w-lg"
      >
        <header className=" mb-10">
          <h2 className="text-2xl  text-zinc-200 font-semibold">
            Congratulations!
          </h2>
          <span className="text-zinc-400">You've reached a new milestone.</span>
        </header>

        <div className="flex items-center flex-col mb-10">
          <MilestoneBadge milestone={milestone} isCompleted={true} />
          <p className="text-zinc-300 mt-4 max-w-[30ch]">
            {HABIT_MILESTONES_MESSAGES[milestone]}
          </p>
        </div>

        <footer className="flex flex-col gap-4">
          <Button
            tabIndex="0"
            onClick={onClose}
            className={cn(
              "w-full capitalize bg-emerald-500/20 border-2 border-emerald-700 text-neutral-100",
              "outline-none focus-visible:ring-2 focus:ring-zinc-500 focus:ring-2",
              "disabled:bg-emerald-500/20 disabled:cursor-not-allowed"
            )}
          >
            {"Continue"}
          </Button>
          {/* <Button
            tabIndex="0"
            onClick={onClose}
            className={cn(
              "w-full capitalize bg-zinc-500/20  text-neutral-100",
              "hover:bg-zinc-500/30 border-2 border-zinc-800 hover:border-zinc-700",
              "outline-none focus-visible:ring-2 focus:ring-zinc-500 focus:ring-2",
              "disabled:bg-zinc-800 disabled:cursor-not-allowed"
            )}
          >
            share
          </Button> */}
        </footer>
      </motion.div>
    </Backdrop>,
    document.getElementById("portal")
  );
};

export default forwardRef(MilestoneDialog);
