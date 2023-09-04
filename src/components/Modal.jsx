import React from "react";
import ReactDOM from "react-dom";
import HabitForm from "../pages/components/HabitForm";
import clsx from "clsx";
import { motion } from "framer-motion";
import { IconButton } from "./Buttons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useClickOutside from "../hooks/useClickOutside";
import useMediaQuery from "../hooks/useMediaQuery";

const Modal = ({ onClose, title, children }, ref) => {
  const domNode = useClickOutside(onClose);

  //Conditionally style components and animations based on device
  const isMobile = useMediaQuery("(max-width: 638px)");

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
        key={"modal"}
        className={clsx(
          "bg-zinc-900 p-6 w-full min-h-2/4 self-end rounded-t-2xl border-2 border-zinc-800",
          "sm:self-center sm:rounded-md sm:h-auto sm:max-w-lg ",
          "overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-md"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-zinc-200 font-semibold">{title}</h2>
          <IconButton
            aria-label="close modal"
            className="group rounded-md bg-zinc-800 hover:bg-zinc-700 font-bold text-zinc-500"
            onClick={onClose}
          >
            <XMarkIcon
              className="transition-colors group-hover:text-zinc-100   h-5 w-5"
              strokeWidth={3}
            />
          </IconButton>
        </div>
        {children}
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
      key={"modal_backdrop"}
      className={clsx(
        "fixed inset-0 h-full w-full",
        "bg-black/50 backdrop-blur-[2px] md:px-4",
        "grid place-items-center"
      )}
    >
      {children}
    </motion.div>
  );
};

export default Modal;
