
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-orbitron font-bold text-lg">Z</span>
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-xl">Zedekiah</h3>
                <p className="text-gray-300 text-sm">Tech Clinic</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Professional technology solutions for all your electronic and digital needs. 
              Trusted by customers for reliable, affordable service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-accent transition-colors duration-200"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Phone & Tablet Repair</li>
              <li>Computer Solutions</li>
              <li>CCTV Installation</li>
              <li>Home Wiring</li>
              <li>Software Support</li>
              <li>Tech Consultation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-orbitron font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 +1 (555) 123-TECH</p>
              <p>📧 info@zedekiahtechclinic.com</p>
              <p>🕒 Mon-Fri 9AM-6PM</p>
              <p>🕒 Sat 10AM-4PM</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-accent/80 transition-colors duration-200">
                📧
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-accent/80 transition-colors duration-200">
                💼
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-accent/80 transition-colors duration-200">
                📱
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {currentYear} Zedekiah Tech Clinic. All rights reserved. | Professional Electronics Repair & Tech Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
