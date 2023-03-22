import ReactDom from "react-dom";
import { Backdrop } from "./Modal";

const ConfirmationDialog = ({ open, options, onClose, onSubmit }) => {
  if (!open) return;

  const { title, description, submitText } = options;

  return ReactDom.createPortal(
    <Backdrop>
      <div className="absolute bg-zinc-700 rounded-lg w-full max-w-lg p-4">
        <header>
          <h2 className="text-2xl text-zinc-200 font-semibold">{title}</h2>
        </header>

        <div className="py-4">
          <p className="text-zinc-300"> {description}</p>
        </div>

        <footer className="flex gap-2">
          <button
            onClick={onClose}
            className="ml-auto bg-zinc-600 text-neutral-100 rounded-md h-10 px-4"
          >
            cancel
          </button>
          <button
            tabIndex="0"
            onClick={onSubmit}
            className=" bg-emerald-500/20 border-2 border-emerald-700 text-neutral-100 rounded-md h-10 px-4"
          >
            {submitText}
          </button>
        </footer>
      </div>
    </Backdrop>,
    document.getElementById("portal")
  );
};

export default ConfirmationDialog;
