import React, { useEffect, useRef } from "react";

//Zustand store
import useDialogStore from "../store/useDialogStore";

//Components
import ConfirmationDialog from "./ConfirmationDialog";
import { cn } from "../utils";
import MilestoneDialog from "./MilestoneDialog";
import useMilestoneDialogStore, {
  useMilestoneActions,
} from "../store/useMilestoneDialogStore";
import { AnimatePresence } from "framer-motion";
import { InboxArrowDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

const Layout = ({ className, children }) => {
  const { open, state, handleClose, handleSubmit } = useDialogStore();
  const isMilestoneDialogOpen = useMilestoneDialogStore((state) => state.open);
  const { closeDialog: closeMilestoneDialog } = useMilestoneActions();

  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!open || !cancelBtnRef.current) return;
    cancelBtnRef.current.focus();
  }, [open]);

  return (
    <section
      className={cn("max-w-screen-xl px-3 mx-auto py-10  md:py-16", className)}
    >
      {children}
      <ConfirmationDialog
        ref={cancelBtnRef}
        open={open}
        options={state}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      <AnimatePresence>
        <MilestoneDialog
          open={isMilestoneDialogOpen}
          onClose={closeMilestoneDialog}
        />
      </AnimatePresence>

      <ContactLink />
    </section>
  );
};

const ContactLink = () => {
  return (
    <div className="absolute bottom-10 right-10 group  flex flex-row-reverse gap-4 items-center">
      <Link
        to={"/contact"}
        className="h-10 w-10 peer rounded-md grid place-content-center bg-zinc-900 border border-white/10 transition-colors hover:bg-zinc-800"
      >
        <InboxArrowDownIcon className="group-hover:fill-zinc-50 fill-zinc-300 h-5 w-5" />
      </Link>
      <span className="opacity-0 peer-hover:opacity-100  transition-opacity select-none text-zinc-400">
        Contact us
      </span>
    </div>
  );
};

export default Layout;
