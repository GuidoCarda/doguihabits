import { forwardRef } from "react";
import ReactDom from "react-dom";
import { Backdrop } from "./Modal";

const ConfirmationDialog = ({ open, options, onClose, onSubmit }, ref) => {
  if (!open) return;

  const { title, description, submitText } = options;

  return ReactDom.createPortal(
    <Backdrop>
      <div
        aria-modal="true"
        className="bg-zinc-700 mx-10 p-4 rounded-lg  w-3/4 sm:w-full max-w-lg"
      >
        <header>
          <h2 className="text-2xl  text-zinc-200 font-semibold">{title}</h2>
        </header>

        <div className="py-4">
          <p className="text-zinc-300"> {description}</p>
        </div>

        <footer className="flex gap-2">
          <button
            ref={ref}
            onClick={onClose}
            className="capitalize ml-auto bg-zinc-600  text-neutral-100 rounded-md h-10 px-4"
          >
            cancel
          </button>
          <button
            tabIndex="0"
            onClick={onSubmit}
            className="capitalize bg-emerald-500/20 border-2 border-emerald-700 text-neutral-100 rounded-md h-10 px-4"
          >
            {submitText}
          </button>
        </footer>
      </div>
    </Backdrop>,
    document.getElementById("portal")
  );
};

export default forwardRef(ConfirmationDialog);
