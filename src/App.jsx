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
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Habits />} />
          <Route path="/habits/:id" element={<HabitDetail />} />
        </Route>
        <Route path="test" element={<Test />} />
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

  console.log("location inside ProtectedRoutes", location);
  console.log(user, "user inside ProtectedRoutes component");

  if (isLoading) {
    return (
      <div className="min-h-screen w-full grid place-content-center text-zinc-200 ">
        <h3 className="text-xl animation-pulse duration-200">Loading...</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <Outlet />;
}

export default App;
