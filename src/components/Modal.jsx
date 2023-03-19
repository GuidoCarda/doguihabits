import React, { forwardRef } from "react";
import ReactDOM from "react-dom";
import useClickOutside from "../hooks/useClickOutside";
import HabitForm from "../pages/components/HabitForm";

const Modal = ({ open, onClose }) => {
  const domNode = useClickOutside(onClose);

  if (!open) return;

  return ReactDOM.createPortal(
    <>
      <div className="fixed grid place-items-center top-0 left-0 right-0 bottom-0 h-screen w-full bg-black/50 backdrop-blur-[2px] px-4">
        <div
          ref={domNode}
          className=" bg-zinc-700 rounded-md px-6 py-10 w-full sm:max-w-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-md"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-neutral-300 font-semibold">
              New Habit
            </h2>
            <button
              className="h-8 w-8 rounded-md bg-zinc-400 font-bold text-black/50"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <HabitForm onClose={onClose} />
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default Modal;
