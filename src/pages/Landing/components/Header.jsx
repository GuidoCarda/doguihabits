import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const navItems = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "How it works",
    href: "#how-it-works",
  },
  {
    name: "Get started",
    href: "#get-started",
  },
];

const Header = () => {
  const { user, isLoading } = useAuth();

  return (
    <header className="flex h-20  items-center">
      <Link to={"/"} className="font-bold leading-none text-xl text-zinc-100">
        Doguihabits
      </Link>

      <ul className="hidden sm:ml-10 sm:flex sm:justify-self-center sm:gap-4">
        {navItems.map((item) => {
          return (
            <li key={item.name}>
              <button
                onClick={() => {
                  document
                    .querySelector(item.href)
                    .scrollIntoView({ behavior: "smooth" });
                }}
                className="active:text-white leading-none font-medium text-zinc-400 hover:text-white transition-color duration-150"
                href={item.href}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>

      {!isLoading && (
        <Link
          className={
            "bg-emerald-600 font-medium h-10 px-6 grid place-content-center rounded-md text-white ml-auto"
          }
          to={user ? "/habits" : "/login"}
        >
          {user ? "My Habits" : "Sign Up Now"}
        </Link>
      )}
    </header>
  );
};

export default Header;
