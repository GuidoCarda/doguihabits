import React, { useEffect, useRef } from "react";

//Zustand store
import useDialogStore from "../store/useDialogStore";

//Components
import ConfirmationDialog from "./ConfirmationDialog";
import clsx from "clsx";

const Layout = ({ className, children }) => {
  const { open, state, handleClose, handleSubmit } = useDialogStore();

  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!open || !cancelBtnRef.current) return;
    cancelBtnRef.current.focus();
  }, [open]);

  return (
    <section className={clsx("max-w-screen-xl px-3 mx-auto py-12", className)}>
      {children}
      <ConfirmationDialog
        ref={cancelBtnRef}
        open={open}
        options={state}
        onClose={handleClose}
        onSubmit={handleSubmit}
      ></ConfirmationDialog>
    </section>
  );
};

export default Layout;
