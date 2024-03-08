import { useEffect, useState } from "react";
import { Button, IconTextButton } from "../components/Buttons";
import Layout from "../components/Layout";
import { signIn, signInWithGoogle, signUp } from "../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { cn } from "../utils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const ACTIONS = {
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
};

function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }) => signIn(email, password),
  });
}

function useSignUp() {
  return useMutation({
    mutationFn: ({ email, password }) => signUp(email, password),
  });
}

function useAuthAction(action) {
  const signIn = useSignIn();
  const signUp = useSignUp();

  const mutation = action === ACTIONS.SIGN_UP ? signUp : signIn;

  return mutation;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState(ACTIONS.SIGN_UP);

  const mutation = useAuthAction(action);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/habits", { state: { from }, replace: true });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full grid place-content-center text-zinc-200 ">
        <span className="h-10 w-10 rounded-full border-4 border-zinc-700 border-t-emerald-500 animate-spin " />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={"login_page"}
    >
      <Layout className={"min-h-screen grid place-items-center "}>
        <form
          className="relative max-w-lg w-full  rounded-md"
          onSubmit={handleSubmit}
        >
          <AnimatePresence>
            {mutation.isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-28 w-full py-4 border-2 mb-6 px-4 rounded-md bg-red-500/10 text-white border-red-500/20"
              >
                {mutation.error.message}
              </motion.div>
            )}
          </AnimatePresence>
          <h1 className="text-zinc-100 font-semibold text-4xl mb-10">
            {action}
          </h1>
          <label htmlFor="email" className="text-zinc-300 block mb-2">
            Email
          </label>
          <input
            disabled={mutation.isPending}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 mb-6 w-full bg-zinc-800 border-[1px] border-zinc-700 rounded-md text-zinc-200 pl-3 focus:ring-1 focus:ring-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700 focus:outline-none disabled:cursor-not-allowed "
            name="email"
          />
          <label htmlFor="password" className="text-zinc-300 block mb-2">
            Password
          </label>
          <input
            disabled={mutation.isPending}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 mb-6 w-full bg-zinc-800 border-[1px] border-zinc-700 rounded-md text-zinc-200 pl-3 focus:ring-1 focus:ring-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700 focus:outline-none disabled:cursor-not-allowed "
            name="password"
          />
          <Button
            disabled={mutation.isPending}
            className={cn(
              "bg-emerald-600 w-full flex flex-row items-center justify-center gap-2 text-zinc-100 font-bold transition-colors duration-200 hover:bg-emerald-700",
              { "cursor-not-allowed bg-emerald-600/40": mutation.isPending }
            )}
          >
            {mutation.isPending && (
              <motion.span
                key={"loading_spinner"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ArrowPathIcon
                  className="animate-spin h-5 w-5"
                  strokeWidth={2}
                />
              </motion.span>
            )}
            <span>{action}</span>
          </Button>

          <div className="flex gap-2 justify-center mt-4">
            <p className="text-zinc-400">
              {action === ACTIONS.SIGN_UP
                ? "Already have an account?"
                : "You dont have an account?"}
            </p>
            <button
              disabled={mutation.isPending}
              type="button"
              className={"text-emerald-600"}
              onClick={() => {
                mutation.reset();
                setAction((prev) =>
                  prev === ACTIONS.SIGN_IN ? ACTIONS.SIGN_UP : ACTIONS.SIGN_IN
                );
              }}
            >
              {action === ACTIONS.SIGN_UP ? "Sign in" : "Sign up"}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-10">
            <div className="w-full h-[1px] bg-zinc-500"></div>
            <span className="text-zinc-400 flex-shrink-0">
              Or continue with
            </span>
            <div className="w-full h-[1px] bg-zinc-500"></div>
          </div>

          <Button
            disabled={mutation.isPending}
            text="Google"
            onClick={signInWithGoogle}
            className={cn(
              "bg-white w-full flex items-center justify-center font-semibold gap-2 mt-6 ",
              mutation.isPending && "bg-gray-300 cursor-not-allowed"
            )}
          >
            <svg
              className={"h-5 w-5"}
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            <span>Google</span>
          </Button>
        </form>
      </Layout>
    </motion.section>
  );
};

function Alert({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute -top-28 w-full py-4 border-2 mb-6 px-4 rounded-md bg-red-500/10 text-white border-red-500/20"
    >
      {message}
    </motion.div>
  );
}

export default Login;
