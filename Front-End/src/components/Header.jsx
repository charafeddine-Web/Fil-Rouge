import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-urbanist ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h8m-8 5h8m-8 5h8M3 3h18v18H3z"
              />
              <circle cx="8.5" cy="7" r="1.5" fill="currentColor" />
              <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="8.5" cy="17" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">EcoDrive</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <Navbar mobile={true} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;