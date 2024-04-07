import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="text-center flex items-center flex-col py-10 md:py-20 "
    >
      <h2 className="text-4xl font-bold text-white mb-6">Get Started Today!</h2>
      <p className="text-zinc-300 text-lg font-medium max-w-[50ch]">
        Ready to embark on your habit transformation journey? Join DoguiHabits
        now and take the first step towards a more disciplined, healthier, and
        happier you.
      </p>

      <Link
        className={
          "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white mt-10"
        }
        to={"/login"}
      >
        Sign Up Now
      </Link>
    </section>
  );
};

export default GetStarted;
