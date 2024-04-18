import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import GetStarted from "./components/GetStarted";
import Footer from "./components/Footer";

const Landing = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={"/habits"} />;
  }

  return (
    <main className="scroll-smooth max-w-7xl mx-auto px-4">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <GetStarted />
      <Footer />
      <ScrollToTop />
    </main>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollUp = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          whileHover={{ scale: 1.05 }}
          exit={{ opacity: 0, scale: 0, y: 10 }}
          onClick={scrollUp}
          className={
            "fixed border bg-zinc-900 z-10 h-10 w-10 rouded-md grid place-content-center hover:border-white/20 border-white/10 rounded-md bottom-10 right-10 hover:text-white group transition-colors duration-200"
          }
        >
          <ChevronUpIcon className="h-5 w-10 text-zinc-400 transition-colors duration-200 group-hover:text-white group-hover:scale-105" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default Landing;
