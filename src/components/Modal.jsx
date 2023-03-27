import React from "react";
import ReactDOM from "react-dom";
import useClickOutside from "../hooks/useClickOutside";
import HabitForm from "../pages/components/HabitForm";

import { motion } from "framer-motion";
import clsx from "clsx";

const Modal = ({ onClose, isMobile }, ref) => {
  const domNode = useClickOutside(onClose);

  //Show diferent animation based on viewport
  const modalVariants = isMobile
    ? {
        hidden: { y: 300 },
        visible: { y: 0, transition: { damping: 2 } },
      }
    : { hidden: { y: 0 }, visible: { y: 0 } };

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
          <button
            aria-label="close modal"
            className="h-8 w-8 rounded-md bg-zinc-400 font-bold text-black/50"
            onClick={onClose}
          >
            X
          </button>
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
    transition: { duration: 0.125 },
  },
};

export const Backdrop = ({ children }) => {
  return (
    <motion.div
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={clsx(
        "fixed inset-0 h-screen w-full px-4",
        "bg-black/50 backdrop-blur-[2px] md:px-4",
        "grid place-items-center"
      )}
    >
      {children}
    </motion.div>
  );
};

export default Modal;
