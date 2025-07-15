import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { ArrowLeft } from "lucide-react";

const Navbar = () => {
  // Responsive state for mobile menu
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(true);
  const [lastScroll, setLastScroll] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll <= 0) {
            setShow(true);
          } else if (currentScroll > lastScroll) {
            setShow(false); // scrolling down
          } else {
            setShow(true); // scrolling up
          }
          setLastScroll(currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  return (
    <nav className={`w-full py-2 px-4 sm:px-8 backdrop-blur flex items-center justify-between shadow-sm fixed top-0 left-0 z-50 transition-all duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`} style={{background: 'linear-gradient(135deg, #160e2e 0%, #2d1b5e 50%, #160e2e 100%)'}}>
      <div className="flex flex-col items-start gap-0 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/ZTech electrictronics logo.png" alt="Ztech Logo" className="w-8 h-8 rounded-full shadow" />
          <span className="font-ubuntu font-bold text-lg sm:text-xl text-white">Ztech Electronics Ltd</span>
        </div>
        <span className="text-gray-300 text-xs font-medium ml-10 sm:ml-11">Review.Reimagine.Reconnect</span>
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-4 sm:gap-6 items-center">
        <a href="#home" className="hover:text-orange-400 text-white font-medium transition-colors">Home</a>
        <a href="#about" className="hover:text-orange-400 text-white font-medium transition-colors">About</a>
        <a href="#services" className="hover:text-orange-400 text-white font-medium transition-colors">Services</a>
        <a href="#team" className="hover:text-orange-400 text-white font-medium transition-colors">Team</a>
        <a href="/gallery" className="hover:text-orange-400 text-white font-medium transition-colors">Gallery</a>
        <a href="#pricing" className="hover:text-orange-400 text-white font-medium transition-colors">Pricing</a>
        <a href="#faq" className="hover:text-orange-400 text-white font-medium transition-colors">FAQ</a>
        <a href="#contact" className="hover:text-orange-400 text-white font-medium transition-colors">Contact</a>
        <a href="#blog" className="hover:text-orange-400 text-white font-medium transition-colors">Blog</a>
        <a href="/auth" className="hover:text-orange-400 text-white font-medium transition-colors">Login</a>
      </div>
      {/* Hamburger for mobile */}
      <button className="md:hidden flex items-center bg-accent/10 rounded-full shadow p-2 border border-accent/30" onClick={() => setOpen(!open)} aria-label="Open menu">
        <svg className="w-7 h-7" fill="none" stroke="#1e293b" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full" style={{background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)', opacity: 0.97}}>
          <div className="border-b border-accent/20 shadow-md flex flex-col items-start px-6 py-4 gap-3 md:hidden animate-fade-in z-40">
            <a href="#home" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Home</a>
            <a href="#about" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>About</a>
            <a href="#services" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Services</a>
            <a href="#team" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Team</a>
            <a href="/gallery" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Gallery</a>
            <a href="#pricing" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#faq" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>FAQ</a>
            <a href="#contact" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Contact</a>
            <a href="#blog" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Blog</a>
            <a href="/auth" className="hover:text-orange-400 text-white font-medium w-full" onClick={() => setOpen(false)}>Login</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
