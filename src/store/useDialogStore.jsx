import produce from "immer";
import { create } from "zustand";

const useDialogStore = create((set, get) => ({
  open: false,
  awaitingPromise: {},
  state: {
    title: "Title",
    description: "Description",
    submitText: "Confirm",
    pendingText: "Confirming",
    catchOnCancel: false,
    isPending: false,
    onConfirm: () => {},
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
        state.state.isPending = false;
        state.open = false;
      })
    );
  },
  handleSubmit: async () => {
    // Set isPending to true to disable the submit button
    set(
      produce((state) => {
        state.state.isPending = true;
      })
    );

    try {
      await get().state.onConfirm();
    } catch (error) {
      console.log(error);
    } finally {
      set(
        produce((state) => {
          state.awaitingPromise?.resolve?.();
          state.state.isPending = false;
          state.open = false;
        })
      );
    }
  },
}));

export const useDialog = () => useDialogStore((state) => state.dialog);

export default useDialogStore;
