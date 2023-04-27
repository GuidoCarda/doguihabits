import React from "react";
import ReactDOM from "react-dom";
import useClickOutside from "../hooks/useClickOutside";
import HabitForm from "../pages/components/HabitForm";

import { motion } from "framer-motion";
import clsx from "clsx";
import { IconButton } from "./Buttons";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ onClose, isMobile }, ref) => {
  const domNode = useClickOutside(onClose);

  //Show diferent animation based on viewport
  const modalVariants = isMobile
    ? {
        hidden: { y: 400, transition: { damping: 2 } },
        visible: { y: 0, transition: { damping: 2 } },
      }
    : { hidden: { scale: 0.8 }, visible: { scale: 1 } };

  return ReactDOM.createPortal(
    <Backdrop>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        ref={domNode}
        aria-modal="true"
        className={clsx(
          "bg-zinc-700 px-6 py-10 w-full h-2/4 self-end rounded-t-2xl",
          "sm:self-center sm:rounded-md sm:h-auto sm:max-w-lg ",
          "overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-md"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-neutral-300 font-semibold">New Habit</h2>
          <IconButton
            aria-label="close modal"
            className="group rounded-md bg-zinc-500 hover:bg-zinc-400 font-bold text-zinc-400"
            onClick={onClose}
          >
            <XMarkIcon
              className="transition-colors group-hover:text-zinc-100   h-5 w-5"
              strokeWidth={3}
            />
          </IconButton>
        </div>
        <HabitForm onClose={onClose} />
      </motion.div>
    </Backdrop>,
    document.getElementById("portal")
  );
};

const backdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", duration: 0.125 },
  },
};

export const Backdrop = ({ children }) => {
  return (
    <motion.div
      // variants={backdrop}
      // initial="hidden"
      // animate="visible"
      // exit="hidden"
      className={clsx(
        "fixed inset-0 h-screen w-full",
        "bg-black/50 backdrop-blur-[2px] md:px-4",
        "grid place-items-center"
      )}
    >
      {children}
    </motion.div>
  );
};

export default Modal;
