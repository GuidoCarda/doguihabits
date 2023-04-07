import React, { useEffect, useRef } from "react";

//Zustand store
import useDialogStore from "../store/useDialogStore";

//Components
import ConfirmationDialog from "./ConfirmationDialog";

const Layout = ({ children }) => {
  const { open, state, handleClose, handleSubmit } = useDialogStore();

  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!open || !cancelBtnRef.current) return;
    cancelBtnRef.current.focus();
  }, [open]);

  return (
    <section className="max-w-screen-xl min-h-screen px-4 mx-auto py-10">
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
