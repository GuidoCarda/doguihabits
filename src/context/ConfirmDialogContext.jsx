import { createContext, useContext, useState } from "react";
import { ConfirmationDialog } from "../pages/Habits";

const ConfirmDialogContext = createContext(null);

export const ConfirmDialogProvider = ({ children }) => {
  const [state, setState] = useState({ isOpen: false });

  const dialogProps = {
    title: "Delete habit",
    description: "Are you sure you want to delete this habit?",
    confirmBtnLabel: "confirm",
  };

  const confirm = (data) => {
    setState({ ...data, isOpen: true });
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <ConfirmationDialog isOpen={state.isOpen} {...dialogProps} />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmDialogContext);
