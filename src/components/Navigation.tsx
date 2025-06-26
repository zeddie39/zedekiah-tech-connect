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
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary/95 backdrop-blur border-b border-accent/30 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/ZTech electrictronics logo.png" alt="Ztech Logo" className="w-8 h-8 rounded-full shadow" />
          <span className="font-orbitron font-bold text-lg sm:text-xl text-white">Zedekiah</span>
          <span className="text-accent text-xs sm:text-sm font-semibold ml-1">Tech Clinic</span>
        </div>
        <div className="hidden md:flex gap-4 sm:gap-6 items-center">
          <button onClick={() => scrollToSection('home')} className="hover:text-accent text-white font-medium transition-colors">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-accent text-white font-medium transition-colors">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-accent text-white font-medium transition-colors">Services</button>
          <button onClick={() => scrollToSection('team')} className="hover:text-accent text-white font-medium transition-colors">Team</button>
          <button onClick={() => scrollToSection('blog')} className="hover:text-accent text-white font-medium transition-colors">Blog</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-accent text-white font-medium transition-colors">FAQ</button>
          <button onClick={() => scrollToSection('whychooseus')} className="hover:text-accent text-white font-medium transition-colors">Why Choose Us</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-accent text-white font-medium transition-colors">Contact</button>
          <a href="/shop" className="hover:text-accent text-white font-medium transition-colors">Shop</a>
        </div>
        <button className="md:hidden flex items-center bg-accent/10 rounded-full shadow p-2 border border-accent/30" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
          <svg className="w-7 h-7" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 border-b border-accent/20 shadow-md flex flex-col items-start px-6 py-4 gap-3 animate-fade-in z-40">
          <button onClick={() => scrollToSection('home')} className="hover:text-accent text-white font-medium w-full text-left">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-accent text-white font-medium w-full text-left">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-accent text-white font-medium w-full text-left">Services</button>
          <button onClick={() => scrollToSection('team')} className="hover:text-accent text-white font-medium w-full text-left">Team</button>
          <button onClick={() => scrollToSection('blog')} className="hover:text-accent text-white font-medium w-full text-left">Blog</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-accent text-white font-medium w-full text-left">FAQ</button>
          <button onClick={() => scrollToSection('whychooseus')} className="hover:text-accent text-white font-medium w-full text-left">Why Choose Us</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-accent text-white font-medium w-full text-left">Contact</button>
          <a href="/shop" className="hover:text-accent text-white font-medium w-full text-left">Shop</a>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
