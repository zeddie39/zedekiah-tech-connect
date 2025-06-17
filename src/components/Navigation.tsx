import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] bg-primary shadow-lg transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
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
          <div className="hidden md:flex items-center space-x-4">
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
            <Button
              className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 block"
              onClick={() => scrollToSection('contact')}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden z-[99999] relative"
            style={{ position: 'relative' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="#1e293b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu - only rendered when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="md:hidden z-[200] fixed inset-0 bg-primary bg-opacity-95 animate-slide-in-right">
            <div className="flex flex-col space-y-4 p-6">
              <Link to="/" className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-3 transition-colors duration-200 block" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-3 transition-colors duration-200 block" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/services" className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-3 transition-colors duration-200 block" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link to="/team" className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-3 transition-colors duration-200 block" onClick={() => setIsMenuOpen(false)}>
                Team
              </Link>
              <Link to="/blog" className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-3 transition-colors duration-200 block" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              <Link to="/contact" className="bg-white hover:bg-gray-200 text-primary font-semibold rounded px-4 py-3 transition-colors duration-200 block" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Button
                className="bg-primary text-accent font-semibold rounded px-4 py-3 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 block"
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
    </nav>
  );
};

export default Navigation;
