import { AnimatePresence } from "framer-motion";
import Modal from "../../components/Modal";
import HabitForm from "./HabitForm";
import { useState } from "react";
import { HABIT_FORM_ACTIONS } from "../../constants";

const HabitModal = ({ isOpen, onClose, title, action, initialValues }) => {
  const [formValues, setFormValues] = useState({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
  });

  const handleInputChange = (fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleExitComplete = () => {
    if (action === HABIT_FORM_ACTIONS.edit) {
      return;
    }

    setFormValues({
      title: "",
      description: "",
    });
  };

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={handleExitComplete}
    >
      {isOpen && (
        <Modal key={`${action}-habit-modal`} onClose={onClose} title={title}>
          <HabitForm
            handleInputChange={handleInputChange}
            action={action}
            onClose={onClose}
            formValues={formValues}
          />
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default HabitModal;
