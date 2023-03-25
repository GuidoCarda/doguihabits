import "./App.css";

import { Route, Routes } from "react-router-dom";
import HabitDetail from "./pages/HabitDetail";
import Habits from "./pages/Habits";
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
