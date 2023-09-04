import { useState } from "react";
import { Button } from "../components/Buttons";
import Layout from "../components/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("test");
    return null;
  };

  return (
    <section>
      <Layout>
        <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-zinc-100 font-semibold text-4xl mb-10">LogIn</h1>
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
            Login
          </Button>
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
