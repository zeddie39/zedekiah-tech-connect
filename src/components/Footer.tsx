import { Link } from "react-router-dom";
import { Mail, Phone, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/ZTech electrictronics logo.png" 
                alt="Ztech Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover bg-accent"
              />
              <div>
                <h3 className="font-orbitron font-bold text-lg sm:text-xl">Ztech Electronics Ltd</h3>
                <p className="text-gray-300 text-xs sm:text-sm">Tech Electronics Limited</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
              Professional technology solutions for all your electronic and digital needs. 
              Trusted by customers for reliable, affordable service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron font-bold text-base sm:text-lg mb-2 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base"
                >
                  Services
                </button>
              </li>
              <li>
                <Link 
                  to="/blog"
                  className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-orbitron font-bold text-base sm:text-lg mb-2 sm:mb-4">Services</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/services#phone-tablet-repair" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Phone & Tablet Repair</Link></li>
              <li><Link to="/services#laptop-computer-repair" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Laptop & Computer Repair</Link></li>
              <li><Link to="/services#cctv-installation" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">CCTV Installation</Link></li>
              <li><Link to="/services#home-office-wiring" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Home & Office Wiring</Link></li>
              <li><Link to="/services#software-solutions" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Software Solutions</Link></li>
              <li><Link to="/services#tech-consultation" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Tech Consultation</Link></li>
              <li><Link to="/services#gaming-console-repair" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Gaming Console Repair</Link></li>
              <li><Link to="/services#smart-tv-setup-repair" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Smart TV Setup & Repair</Link></li>
              <li><Link to="/services#printer-peripheral-support" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Printer & Peripheral Support</Link></li>
              <li><Link to="/services#network-installation" className="text-gray-300 hover:text-accent transition-colors duration-200 text-xs sm:text-base">Network Installation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 sm:col-span-2 md:col-span-1 flex flex-col items-start justify-start">
            <h4 className="font-orbitron font-bold text-base sm:text-lg mb-2 sm:mb-4">Contact</h4>
            <div className="flex items-center gap-2 text-xs sm:text-base">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="break-all">info@ztechelectronicslimited.co.ke</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-base">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>+254757756763</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-base">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Mon-Sat: 8am - 7pm</span>
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-2">
            <h4 className="font-orbitron font-bold text-base sm:text-lg mb-2 sm:mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="hover:text-accent" aria-label="Facebook"><Facebook className="w-5 h-5 sm:w-6 sm:h-6" /></a>
              <a href="#" className="hover:text-accent" aria-label="Twitter"><Twitter className="w-5 h-5 sm:w-6 sm:h-6" /></a>
              <a href="#" className="hover:text-accent" aria-label="Instagram"><Instagram className="w-5 h-5 sm:w-6 sm:h-6" /></a>
              <a href="#" className="hover:text-accent" aria-label="Linkedin"><Linkedin className="w-5 h-5 sm:w-6 sm:h-6" /></a>
              <a href="#" className="hover:text-accent" aria-label="Youtube"><Youtube className="w-5 h-5 sm:w-6 sm:h-6" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-400">
          &copy; {currentYear} Ztech Electronics Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
