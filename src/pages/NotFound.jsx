import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="max-w-sm flex flex-col text-center items-center gap-4 ">
        <h2 className="text-3xl font-bold text-zinc-300">
          Something went wrong
        </h2>
        <p className="text-zinc-500">
          It looks like the searched route doesn't exists or something went
          wrong on the loading process
        </p>
        <Link
          to="/"
          className="h-10 text-zinc-800 bg-zinc-200 rounded-md flex items-center px-4 mt-10"
        >
          Return to home page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
