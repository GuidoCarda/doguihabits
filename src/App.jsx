import "./App.css";

import { Route, Routes } from "react-router-dom";
import Habits from "./pages/habits";
import Playground from "./pages/Playground";
import HabitDetail from "./pages/HabitDetail";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Habits />} />
        <Route path="/habits/:id" element={<HabitDetail />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </Layout>
  );
}

export default App;
