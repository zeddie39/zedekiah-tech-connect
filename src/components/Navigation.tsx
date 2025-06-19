import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import WhyChooseUsModal from "./WhyChooseUsModal";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [whyOpen, setWhyOpen] = useState(false);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 80) {
        setShowNav(false); // Hide nav on scroll down
      } else {
        setShowNav(true); // Show nav on scroll up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[99999] bg-primary shadow-2xl transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/ztech%20logo.jpg" 
              alt="Ztech Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-white font-orbitron font-bold text-xl">Zedekiah</h1>
              <p className="text-gray-300 text-xs">Tech Electronics Limited</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-accent/60 scrollbar-track-transparent">
            <Link 
              to="/"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Home
            </Link>
            <Link 
              to="/about"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              About
            </Link>
            <Link 
              to="/services"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Services
            </Link>
            <Link 
              to="/team"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Team
            </Link>
            <Link 
              to="/blog"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Blog
            </Link>
            <Link 
              to="/contact"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Contact
            </Link>
            <Link 
              to="/shop"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Shop
            </Link>
            <Link 
              to="/why-choose-us"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              Why Choose Us
            </Link>
            <Link 
              to="/faq"
              className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-2 transition-colors duration-200 block"
            >
              FAQ
            </Link>
            <Button
              className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 block"
              onClick={() => scrollToSection('contact')}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Hamburger */}
          {!isMenuOpen && (
            <button
              className="md:hidden z-[9999] relative bg-slate-800 hover:bg-slate-700 rounded-full shadow p-2 border border-accent"
              style={{ position: 'relative' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="#fff" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu - only rendered when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="md:hidden z-[99999] fixed left-0 right-0 top-0 h-[50vh] bg-primary bg-opacity-95 animate-slide-in-right w-full flex flex-col overflow-y-auto px-0 sm:px-24 lg:px-48 pt-4 pb-10">
            {/* Close button */}
            <div className="flex justify-end p-4 z-[100000]">
              <button
                className="bg-white/90 rounded-full shadow p-2"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="#1e293b" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center space-y-8 px-6">
              <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/services" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link to="/team" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Team
              </Link>
              <Link to="/blog" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              <Link to="/contact" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/shop" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/why-choose-us" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                Why Choose Us
              </Link>
              <Link to="/faq" className="bg-slate-800 hover:bg-slate-700 text-accent font-bold rounded px-8 py-4 text-lg w-full text-center transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>
              <Button
                className="bg-primary text-accent font-bold rounded px-8 py-4 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 w-full text-lg"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection('contact');
                }}
              >
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </div>
      <WhyChooseUsModal open={whyOpen} onOpenChange={setWhyOpen} />
    </nav>
  );
};

export default Navigation;
