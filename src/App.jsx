import "./App.css";

import { Route, Routes } from "react-router-dom";
import HabitDetail from "./pages/HabitDetail";
import Habits from "./pages/Habits";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Habits />} />
      <Route path="/habits/:id" element={<HabitDetail />} />
    </Routes>
  );
}

export default App;
