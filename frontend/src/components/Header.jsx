import Login from "./Login";
import Logout from "./Logout";
import Notification from "./Notification";
import { Link } from "react-router-dom";
export default function ({ user }) {
  return (
    <div className="text-lime-900 mb-5">
      <nav className="flex items-center justify-between flex-wrap bg-lime-100 p-6 rounded-lg">
        <Link
          to="/"
          className="flex items-center flex-shrink-0 text-lime-900 mr-6"
        >
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl tracking-tight">bloglist</span>
        </Link>
        <div className="w-full flex-grow flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <Link
              className="mt-4 lg:inline-block lg:mt-0 text-lime-900 hover:text-amber-700 mr-4"
              to={"/blogs"}
            >
              blogs
            </Link>
            <Link
              className="mt-4 lg:inline-block lg:mt-0 text-lime-900 hover:text-amber-700 mr-4"
              to={"/users"}
            >
              users
            </Link>
          </div>
          <div className="mr-0 ml-auto">
            {user ? <Logout user={user} /> : <Login />}
          </div>
        </div>
      </nav>
      <Notification />
    </div>
  );
}
