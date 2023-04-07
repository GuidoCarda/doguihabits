import produce from "immer";
import { create } from "zustand";

const useDialogStore = create((set) => ({
  open: false,
  awaitingPromise: {},
  state: {
    title: "Title",
    description: "Description",
    submitText: "comfirm",
    catchOnCancel: false,
  },
  dialog: (options) => {
    set(
      produce((state) => {
        state.open = true;
        state.state = { ...state.state, ...options };
      })
    );

    //return a new promise when the dialog opens
    return new Promise((resolve, reject) => {
      set(
        produce((state) => {
          state.awaitingPromise = { resolve, reject };
        })
      );
    });
  },
  handleClose: () => {
    set(
      produce((state) => {
        // Allowing us to catch the promise
        // Set catchOnCancel to false if you are not catching promise
        // to avoid uncatched promise error.
        state.state.catchOnCancel && state.awaitingPromise?.reject?.();
        state.open = false;
      })
    );
  },
  handleSubmit: () => {
    set(
      produce((state) => {
        state.awaitingPromise?.resolve?.();
        state.open = false;
      })
    );
  },
}));

export const useDialog = () => useDialogStore((state) => state.dialog);

export default useDialogStore;
