import { useEffect, useState } from "react";
import { Button } from "../components/Buttons";
import Layout from "../components/Layout";
import { signIn, signUp } from "../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  const user = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { state: { from: location }, replace: true });
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
      navigate("/");
    }
    return null;
  };

  return (
    <section>
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
          <div>
            <p>Ya tienes una cuenta?</p>
            <button
              type="button"
              className="text-green-600 "
              onClick={() => setAction(ACTIONS.SIGN_IN)}
            >
              inicia sesión
            </button>
          </div>
          <div className="text-zinc-300  mt-10 text-xl border-2 border-zinc-800 p-4 rounded-md ">
            <h2>Email: {email}</h2>
            <h2>Password: {password}</h2>
          </div>
        </form>
      </Layout>
    </section>
  );
};

export default Login;
