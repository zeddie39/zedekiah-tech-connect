
import { useState } from 'react';
import { Button } from './ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/48de53de-a799-42bb-bad4-44bba23daaab.png" 
              alt="Ztech Electronics Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-white font-orbitron font-bold text-xl">Zedekiah</h1>
              <p className="text-gray-300 text-xs">Tech Clinic</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-accent transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-accent transition-colors duration-200"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-white hover:text-accent transition-colors duration-200"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('team')}
              className="text-white hover:text-accent transition-colors duration-200"
            >
              Team
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="text-white hover:text-accent transition-colors duration-200"
            >
              Blog
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-accent transition-colors duration-200"
            >
              Contact
            </button>
            <Button className="bg-accent hover:bg-accent/90 text-white">
              Get Quote
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-in-right">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-white hover:text-accent transition-colors duration-200 text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-accent transition-colors duration-200 text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-white hover:text-accent transition-colors duration-200 text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('team')}
                className="text-white hover:text-accent transition-colors duration-200 text-left"
              >
                Team
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="text-white hover:text-accent transition-colors duration-200 text-left"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-accent transition-colors duration-200 text-left"
              >
                Contact
              </button>
              <Button className="bg-accent hover:bg-accent/90 text-white w-fit">
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
