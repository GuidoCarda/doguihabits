import { useEffect, useState } from "react";
import { Button, IconTextButton } from "../components/Buttons";
import Layout from "../components/Layout";
import { signIn, signInWithGoogle, signUp } from "../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ACTIONS = {
  SIGN_IN: "signin",
  SIGN_UP: "signup",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState(ACTIONS.SIGN_UP);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { state: { from }, replace: true });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");

    if (!email || !password) {
      return alert("algo salio mal");
    }

    let user;
    if (action === ACTIONS.SIGN_UP) {
      user = await signUp(email, password);
      console.log("sign up");
    } else {
      user = await signIn(email, password);
      console.log("sign in");
    }
    console.log(user);

    if (user) {
      navigate("/", { state: { from }, replace: true });
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full grid place-content-center text-zinc-300">
        <h3 className="animate-pulse">Loading ...</h3>
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
      <Layout>
        <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-zinc-100 font-semibold text-4xl mb-10">
            {action}
          </h1>
          <label htmlFor="email" className="text-zinc-300 block mb-2">
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 mb-6 w-full bg-zinc-800 border-[1px] border-zinc-700 rounded-md text-zinc-200 pl-3 focus:outline  focus:outline-green-400"
            name="email"
          />
          <label htmlFor="password" className="text-zinc-300 block mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 mb-10 w-full bg-zinc-800 border-[1px] border-zinc-700 rounded-md text-zinc-200 pl-3 focus:outline  focus:outline-green-400"
            name="password"
          />
          <Button className="bg-green-600 w-full text-zinc-100 font-bold">
            {action}
          </Button>
          {action === ACTIONS.SIGN_UP && (
            <div className="flex gap-2 justify-center mt-4">
              <p className="text-zinc-400">Ya tienes una cuenta?</p>
              <button
                type="button"
                className="text-green-600 "
                onClick={() => setAction(ACTIONS.SIGN_IN)}
              >
                inicia sesión
              </button>
            </div>
          )}

          <span className="text-zinc-300 block text-center mt-4">
            o tambien puedes
          </span>
          <Button
            onClick={() => signInWithGoogle()}
            type="button"
            className="text-zinc-800 mt-6 bg-white w-full font-semibold"
          >
            Iniciar sesion con google
          </Button>
          <div className="text-zinc-300  mt-10 text-xl border-2 border-zinc-800 p-4 rounded-md ">
            <h2>Email: {email}</h2>
            <h2>Password: {password}</h2>
          </div>
        </form>
      </Layout>
    </motion.section>
  );
};

export default Login;
