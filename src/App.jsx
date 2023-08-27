import "./App.css";

// Routing
import { Route, Routes } from "react-router-dom";

// Pages
import HabitDetail from "./pages/HabitDetail";
import Habits from "./pages/Habits";

// Animations
import { AnimatePresence } from "framer-motion";

// Toast notifications
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";

const toastOptions = {
  style: {
    backgroundColor: "hsl(240, 3.8297872340425574%, 30%)",
    color: "hsl(240, 3.8297872340425574%, 85%)",
  },
  error: {
    duration: 1500,
  },
};

function App() {
  return (
    <AnimatePresence mode="wait">
      <Toaster toastOptions={toastOptions} />

      <Routes>
        <Route path="/" element={<Habits />} />
        <Route path="/habits/:id" element={<HabitDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
