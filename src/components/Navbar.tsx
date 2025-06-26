import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { ArrowLeft } from "lucide-react";

const Navbar = () => {
  // Responsive state for mobile menu
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="w-full py-2 px-4 sm:px-8 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center justify-between shadow-sm fixed top-0 left-0 z-50 transition-all">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Back button, hidden on home */}
        {location.pathname !== "/" && (
          <button
            className="mr-2 p-1 rounded-full hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={22} className="text-primary" />
          </button>
        )}
        <img src="/ZTech electrictronics logo.png" alt="Ztech Logo" className="w-8 h-8 rounded-full shadow" />
        <span className="font-orbitron font-bold text-lg sm:text-xl text-primary">Ztech Electronics Ltd</span>
        <span className="text-gray-400 text-xs sm:text-sm font-semibold ml-1">Tech Clinic</span>
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-4 sm:gap-6 items-center">
        <Link to="/" className="hover:text-accent text-gray-700 font-medium transition-colors">Home</Link>
        <Link to="/auth" className="hover:text-accent text-gray-700 font-medium transition-colors">Login</Link>
      </div>
      {/* Hamburger for mobile */}
      <button className="md:hidden flex items-center bg-accent/10 rounded-full shadow p-2 border border-accent/30" onClick={() => setOpen(!open)} aria-label="Open menu">
        <svg className="w-7 h-7" fill="none" stroke="#1e293b" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white/95 border-b border-accent/20 shadow-md flex flex-col items-start px-6 py-4 gap-3 md:hidden animate-fade-in z-40">
          <Link to="/" className="hover:text-accent text-gray-700 font-medium w-full" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/auth" className="hover:text-accent text-gray-700 font-medium w-full" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
