import "./App.css";

// Routing
import { Route, Routes } from "react-router-dom";

// Pages
import HabitDetail from "./pages/HabitDetail";
import Habits from "./pages/Habits";

// Animations
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Habits />} />
        <Route path="/habits/:id" element={<HabitDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
