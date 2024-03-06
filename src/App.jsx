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
import Landing from "./pages/Landing";
import Contact from "./pages/components/Contact";

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
  return (
    <AnimatePresence mode="wait">
      <Toaster toastOptions={toastOptions} key={"toasts"} />

      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Habits />} />
          <Route path="/habits/:id" element={<HabitDetail />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
}

function ProtectedRoutes() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location?.state?.from ?? "/";

  if (isLoading) {
    return (
      <div className="min-h-screen w-full grid place-content-center text-zinc-200 ">
        <span className="h-10 w-10 rounded-full border-4 border-zinc-700 border-t-emerald-500 animate-spin " />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <Outlet />;
}

export default App;
