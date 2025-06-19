import { Link } from "react-router-dom";
import React from "react";

const Navbar = () => {
  // Responsive state for mobile menu
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="w-full py-3 px-4 sm:px-6 bg-primary text-white flex items-center justify-between shadow relative z-50">
      <div className="flex items-center gap-2">
        <span className="font-orbitron font-bold text-lg sm:text-xl">Zedekiah</span>
        <span className="text-gray-300 text-xs sm:text-sm">Tech Clinic</span>
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-4 sm:gap-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/auth" className="hover:underline">Login</Link>
      </div>
      {/* Hamburger for mobile */}
      <button className="md:hidden flex items-center bg-white/90 rounded-full shadow p-2" onClick={() => setOpen(!open)} aria-label="Open menu">
        <svg className="w-8 h-8" fill="none" stroke="#1e293b" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-primary shadow-md flex flex-col items-start px-6 py-4 gap-3 md:hidden animate-fade-in">
          <Link to="/" className="hover:underline w-full" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/auth" className="hover:underline w-full" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
