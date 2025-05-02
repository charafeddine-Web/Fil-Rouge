import { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ChatNotifications from "./ChatNotifications";

const Navbar = ({ mobile = false }) => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultNavLinks = [
    { name: "Home", path: "/" },
    // { name: "Search Rides", path: "/offer-ride" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Links for passengers
  const passengerLinks = [
    // { name: "Home", path: "/" },
    { name: "Search Rides", path: "/offer-ride" },
    { name: "My Reservations", path: "/Myreservations" },
    { name: "Messaging", path: "/chat" },
  ];

  // Links for drivers
  const driverLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Rides", path: "/my-rides" },
    { name: "Messaging", path: "/chat" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return defaultNavLinks;
    } else if (user?.role === "passager") {
      return passengerLinks;
    } else if (user?.role === "conducteur") {
      return driverLinks;
    }
    return defaultNavLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`font-urbanist ${mobile ? "" : "flex items-center"}`}>
      {/* Navigation Links */}
      <div className={mobile ? "space-y-1" : "flex items-center"}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              ${mobile 
                ? "block px-3 py-2.5 mb-1 rounded-lg transition-colors font-medium" 
                : "mx-3 px-3 py-2 rounded-full transition-colors font-medium text-sm"}
              ${isActive(link.path)
                ? "bg-green-50 text-green-600" 
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"}
            `}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Divider for mobile */}
      {mobile && <div className="border-t border-gray-100 my-3"></div>}

      {/* User-specific links */}
      <div className={mobile ? "space-y-2 mt-2" : "flex items-center ml-6"}>
        {isAuthenticated ? (
          <>
            <div className={mobile ? "" : "flex items-center"} ref={dropdownRef}>
              {mobile ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                      {user?.nom?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/chat"
                    className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg mt-1"
                  >
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <span>Messages</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                  >
                    <span className="ml-11">Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="relative flex items-center">
                  {/* Chat Notifications Icon */}
                  {/* <div className="mr-3">
                    <ChatNotifications />
                  </div> */}
                  
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full transition-colors"
                  >
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.nom?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">{user?.nom?.split(" ")[0] || "User"}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>

                  {/* User dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-40 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`
                ${mobile 
                  ? "block w-full py-2.5 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50" 
                  : "px-4 py-2 text-gray-700 hover:text-green-600 font-medium "}
              `}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`
                ${mobile 
                  ? "block w-full py-2.5 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 mt-2" 
                  : "ml-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full "}
              `}
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