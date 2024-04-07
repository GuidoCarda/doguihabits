import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-_5rem)] py-36 md:py-40 flex flex-col items-center">
      <div className="min-w-fit text-center z-10">
        <span className="uppercase tracking-widest block  text-emerald-500">
          doguihabits
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white max-w-[18ch] leading-tight">
          Your Personal Habit Transformation Journey
        </h1>
        <p className="md:text-lg text-zinc-400 font-medium mt-6 md:mt-10 max-w-[50ch]">
          Welcome to doguihabits, the simple yet powerful habit tracker designed
          to empower your journey towards personal growth and transformation.
        </p>
        <div className="flex gap-4 justify-center items-center mt-12">
          <Link
            className={
              "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white "
            }
            to={"/login"}
          >
            Sign Up
          </Link>
          <Link
            className={
              "font-medium h-10 px-6 grid place-content-center rounded-md text-white "
            }
            to={"/contact"}
          >
            Contact us
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 overflow-hidden  border-green-600/5 w-full">
        <motion.img
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          src={"/herov2.svg"}
          className="hidden md:block mx-auto select-none pointer-events-none"
        />
        <motion.img
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          src={"/herov2mobile.svg"}
          className="block md:hidden mx-auto select-none pointer-events-none"
        />
      </div>

      <div>
        <div className="h-4 w-32 block absolute -bottom-2 left-0 bg-gradient-to-r from-zinc-900 z-10"></div>
        <div className="h-4 w-32 block absolute -bottom-2 right-0 bg-gradient-to-l from-zinc-900 z-10 "></div>
        <span className="border-t absolute left-0  right-0 w-full bottom-0 border-white/10 block" />
      </div>
    </section>
  );
};

export default Hero;
