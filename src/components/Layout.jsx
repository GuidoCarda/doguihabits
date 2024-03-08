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
          milestone={7}
          onClose={closeMilestoneDialog}
        />
      </AnimatePresence>
    </section>
  );
};

export default Layout;
