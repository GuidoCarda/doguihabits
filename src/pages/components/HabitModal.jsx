import { AnimatePresence } from "framer-motion";
import Modal from "../../components/Modal";
import HabitForm from "./HabitForm";

const HabitModal = ({ isOpen, onClose, title, action, initialValues }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isOpen && (
        <Modal key={`${action}_habit_modal`} onClose={onClose} title={title}>
          <HabitForm
            action={action}
            onClose={onClose}
            initialValues={initialValues}
          />
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default HabitModal;
