import { Link } from "react-router-dom";
import { Button } from "../../components/Buttons";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

function Contact() {
  return (
    <main
      className={
        "px-4 md:px-0 max-w-xl mx-auto py-20 grid  place-content-start md:place-content-center min-h-screen h-full"
      }
    >
      <Link
        to={-1}
        className="group text-zinc-500 mb-2 flex gap-1 items-center hover:text-zinc-400 transition-colors duration-150"
      >
        <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Go back</span>
      </Link>
      <h1 className="text-white text-4xl font-bold mb-4">Contact us</h1>
      <p className="max-w-[50ch] text-lg text-zinc-400 font-medium ">
        If you have any questions or feedback, feel free to reach out leaving a
        message below.
      </p>

      <form className=" mt-10 flex flex-col gap-6">
        <div className="group">
          <label
            className="group-focus-within:text-zinc-100 text-zinc-400 font-sm mb-1 block transition-color duration-150"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className="bg-zinc-800 w-full h-10 rounded-md border-[1px] border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <div className="group ">
          <label
            className="group-focus-within:text-zinc-100 text-zinc-400 font-sm mb-1 block transition-color duration-150"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            className="bg-zinc-800 w-full h-48 resize-none rounded-md border-[1px] border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
        <Button className="bg-emerald-600 text-white font-medium ml-auto mt-4">
          Send
        </Button>
      </form>
    </main>
  );
}

export default Contact;
