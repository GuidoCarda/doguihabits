import ReactDom from "react-dom";
import { forwardRef } from "react";
import clsx from "clsx";
import { Button } from "./Buttons";
import { Backdrop } from "./Modal";

const ConfirmationDialog = ({ open, options, onClose, onSubmit }, ref) => {
  if (!open) return;

  const { title, description, submitText, pendingText, isPending } = options;

  return ReactDom.createPortal(
    <Backdrop>
      <div
        key={"confirmDialog"}
        aria-modal="true"
        className="bg-zinc-900 border-2 border-zinc-800 mx-10 p-4 rounded-lg  w-3/4 sm:w-full max-w-lg"
      >
        <header>
          <h2 className="text-2xl  text-zinc-200 font-semibold">{title}</h2>
        </header>

        <div className="py-4">
          <p className="text-zinc-300"> {description}</p>
        </div>

        <footer className="flex gap-2">
          <Button
            ref={ref}
            onClick={onClose}
            className={clsx(
              "capitalize ml-auto bg-zinc-800  text-neutral-100",
              "outline-none focus-visible:ring-2 focus:ring-zinc-500 focus:ring-2",
              "disabled:opacity-20 disabled:cursor-not-allowed"
            )}
            disabled={isPending}
          >
            cancel
          </Button>
          <Button
            tabIndex="0"
            onClick={onSubmit}
            className={clsx(
              "capitalize bg-emerald-500/20 border-2 border-emerald-700 text-neutral-100",
              "outline-none focus-visible:ring-2 focus:ring-zinc-500 focus:ring-2",
              "disabled:bg-emerald-500/20 disabled:cursor-not-allowed"
            )}
            disabled={isPending}
          >
            {isPending ? pendingText : submitText}
          </Button>
        </footer>
      </div>
    </Backdrop>,
    document.getElementById("portal")
  );
};

export default forwardRef(ConfirmationDialog);
