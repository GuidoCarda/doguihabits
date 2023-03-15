import "./App.css";

import { Route, Routes } from "react-router";
import Habits from "./pages/habits";
import Playground from "./pages/Playground";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Habits />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  );
}

export default App;
