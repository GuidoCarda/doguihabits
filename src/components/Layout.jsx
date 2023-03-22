import React from "react";

//Zustand store
import useDialogStore from "../store/useDialogStore";

//Components
import ConfirmationDialog from "./ConfirmationDialog";

const Layout = ({ children }) => {
  const { open, state, handleClose, handleSubmit } = useDialogStore();

  return (
    <section className="max-w-screen-xl min-h-screen px-4 mx-auto py-10">
      {children}
      <ConfirmationDialog
        open={open}
        options={state}
        onClose={handleClose}
        onSubmit={handleSubmit}
      ></ConfirmationDialog>
    </section>
  );
};

export default Layout;
