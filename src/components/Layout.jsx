import React, { useEffect, useRef } from "react";

//Zustand store
import useDialogStore from "../store/useDialogStore";

//Components
import ConfirmationDialog from "./ConfirmationDialog";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const { open, state, handleClose, handleSubmit } = useDialogStore();

  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!open || !cancelBtnRef.current) return;
    cancelBtnRef.current.focus();
  }, [open]);

  // const toastOptions = {
  //   style: {
  //     backgroundColor: "hsl(240, 3.8297872340425574%, 30%)",
  //     color: "hsl(240, 3.8297872340425574%, 85%)",
  //   },
  //   error: {
  //     duration: 1500,
  //   },
  // };

  return (
    <section className="max-w-screen-xl px-3 mx-auto py-12">
      {children}
      {/* <Toaster toastOptions={toastOptions} /> */}
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
