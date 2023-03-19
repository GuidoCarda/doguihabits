import React, { forwardRef } from "react";
import ReactDOM from "react-dom";
import useClickOutside from "../hooks/useClickOutside";
import HabitForm from "../pages/components/HabitForm";

import { motion } from "framer-motion";

const Modal = ({ open, onClose }) => {
  const domNode = useClickOutside(onClose);

  // if (!open) return;

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed grid place-items-center top-0 left-0 right-0 bottom-0 h-screen w-full bg-black/50 backdrop-blur-[2px] md:px-4"
    >
      <div
        ref={domNode}
        className=" bg-zinc-700 px-6 py-10 w-full h-2/4 self-end rounded-t-2xl sm:self-center sm:rounded-md sm:h-auto sm:max-w-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-md"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-neutral-300 font-semibold">New Habit</h2>
          <button
            className="h-8 w-8 rounded-md bg-zinc-400 font-bold text-black/50"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <HabitForm onClose={onClose} />
      </div>
    </motion.div>,
    document.getElementById("portal")
  );
};

export default Modal;
