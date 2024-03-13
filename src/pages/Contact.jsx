import { Link } from "react-router-dom";
import { Button } from "../components/Buttons";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { sendContactMessage } from "../services/contact";
import { useMutation } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";

const useSendContactMessage = () => {
  return useMutation({
    mutationFn: sendContactMessage,
  });
};

function Contact() {
  const { user } = useAuth();

  const { mutate: sendMessage, isPending: isSendingMessage } =
    useSendContactMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = Object.fromEntries(
      new FormData(e.currentTarget)
    );

    if (!name || !message) {
      toast("Name or message field empty");
    }

    if (!user && !email) {
      return toast("Email field empty");
    }

    const data = {
      name,
      email: email ?? user.email,
      message,
      createdAt: Timestamp.now(),
      isLoggedUser: !!user,
    };

    sendMessage(data, {
      onSuccess: () => {
        e.target.reset();
        toast.success("Message sent successfully", { duration: 3000 });
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to send feedback");
      },
    });
  };

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
      <p className="max-w-[50ch] text-lg text-zinc-400">
        If you have any questions or feedback, feel free to reach out leaving a
        message below.
      </p>

      <form className=" mt-10 flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="group">
          <label
            className="group-focus-within:text-zinc-100 text-zinc-400 font-sm mb-1 block transition-color duration-150"
            htmlFor="name"
          >
            Name
          </label>
          <input
            disabled={isSendingMessage}
            id="name"
            name="name"
            type="text"
            required
            className="disabled:cursor-not-allowed text-zinc-200 px-2 bg-zinc-800 w-full h-10 rounded-md border-[1px] border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {!user && (
          <div className="group">
            <label
              className="group-focus-within:text-zinc-100 text-zinc-400 font-sm mb-1 block transition-color duration-150"
              htmlFor="name"
            >
              Email
            </label>
            <input
              disabled={isSendingMessage}
              id="email"
              name="email"
              type="email"
              required
              className=" disabled:cursor-not-allowed text-zinc-200 px-2 bg-zinc-800 w-full h-10 rounded-md border-[1px] border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        )}

        <div className="group ">
          <label
            className="group-focus-within:text-zinc-100 text-zinc-400 font-sm mb-1 block transition-color duration-150"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            disabled={isSendingMessage}
            id="message"
            name="message"
            required
            className="disabled:cursor-not-allowed text-zinc-200 p-2  bg-zinc-800 w-full h-48 resize-none rounded-md border-[1px] border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
        <Button
          disabled={isSendingMessage}
          className="bg-emerald-600 text-white font-medium ml-auto mt-4 disabled:bg-emerald-500 disabled:cursor-not-allowed transition-colors"
        >
          {isSendingMessage ? "Sending..." : "Send"}
        </Button>
      </form>
    </main>
  );
}

export default Contact;
