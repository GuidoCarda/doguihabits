import "./App.css";

// Routing
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

// Pages
import HabitDetail from "./pages/HabitDetail";
import Habits from "./pages/Habits";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Animations
import { AnimatePresence } from "framer-motion";

// Toast notifications
import { Toaster } from "react-hot-toast";

// Auth
import { useAuth } from "./context/AuthContext";
import Test from "./pages/Test";
import { useHabitsActions } from "./store/useHabitsStore";
import { useEffect, useRef } from "react";

const toastOptions = {
  style: {
    backgroundColor: "hsl(240, 4%, 16%)",
    color: "hsl(240, 3.8297872340425574%, 85%)",
  },
  error: {
    duration: 1500,
  },
};

function App() {
  // I don't think its the best solution, so I'm open to suggestions
  const { getHabits } = useHabitsActions();
  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (alreadyFetched.current) return;

    getHabits();
    return () => {
      alreadyFetched.current = true;
    };
  }, []);
  //

  return (
    <AnimatePresence mode="wait">
      <Toaster toastOptions={toastOptions} key={"toasts"} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Habits />} />
          <Route path="/habits/:id" element={<HabitDetail />} />
        </Route>
        <Route path="test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function ProtectedRoutes() {
  const user = useAuth();
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default App;
