import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

const Navbar = ({ mobile = false }) => {
  const location = useLocation();
  const { isAuthenticated, logout,user } = useContext(AuthContext);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Search Rides", path: "/search" },
    { name: "How it Works", path: "/how-it-works" },
    // { name: "About Us", path: "/about" },
    // { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const userLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Rides", path: "/my-rides" },
    { name: "Offer Ride", path: "/offer-ride" },
  ];

  const navItemClasses = mobile
    ? "block py-2 text-gray-600 hover:text-green-500 transition-colors"
    : "mx-4 text-gray-600 hover:text-green-500 transition-colors";

  const activeClasses = mobile
    ? "text-green-500 font-semibold"
    : "text-green-500 font-semibold";

  return (
    <nav className={`font-urbanist ${mobile ? "" : "flex items-center"}`}>
      <div className={mobile ? "space-y-2" : "flex items-center"}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${navItemClasses} ${
              isActive(link.path) ? activeClasses : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {mobile && <div className="border-t border-gray-100 my-2"></div>}

      <div className={mobile ? "space-y-2 mt-2" : "flex items-center ml-6"}>
        {isAuthenticated ? (
          <>
            {mobile && (
              <>
                {userLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${navItemClasses} ${
                      isActive(link.path) ? activeClasses : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-2"></div>
              </>
            )}

            <div className={mobile ? "" : "flex items-center"}>
              <Link
                to="/profile"
                className={`${navItemClasses} ${
                  isActive("/profile") ? activeClasses : ""
                } ${
                  mobile ? "" : "flex items-center"
                }`}
              >
                <span className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium mr-2">
                       {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                </span>

                {mobile && <span>Profile</span>}
              </Link>

              <button
                onClick={logout}
                className={`${
                  mobile
                    ? "block py-2 text-red-500 hover:text-red-600 transition-colors"
                    : "ml-4 text-red-500 hover:text-red-600 transition-colors"
                }`}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`${
                mobile
                  ? "block py-2 text-gray-600 hover:text-green-500 transition-colors"
                  : "px-5 py-2 text-gray-600 hover:text-green-500 transition-colors"
              } ${isActive("/login") ? activeClasses : ""}`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`${
                mobile
                  ? "block py-2 bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition-colors"
                  : "px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              }`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;