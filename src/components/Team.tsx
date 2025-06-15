
import { Mail, Linkedin, Phone } from "lucide-react";

const CEO_LINKEDIN_URL = "https://www.linkedin.com/in/zedekiah-profile"; // Replace with your real LinkedIn if you want

const Team = () => {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Led by experienced professionals dedicated to excellence in technology solutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* CEO Profile Image */}
            <div className="flex-shrink-0 relative group">
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-primary to-accent p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-6xl font-orbitron font-bold text-primary">
                  Z
                </div>
                {/* LinkedIn overlay on the photo */}
                <a
                  href={CEO_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-5 right-5 bg-primary rounded-full p-2 shadow-md hover:bg-accent transition-all z-10"
                  aria-label="LinkedIn (CEO)"
                  title="CEO LinkedIn"
                  style={{ border: "3px solid white" }}
                >
                  <Linkedin size={30} className="text-white" />
                </a>
              </div>
              {/* Floating tech elements around the profile */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl animate-float">
                <Phone size={32} />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-lg animate-float" style={{ animationDelay: '1s' }}>
                <Mail size={24} />
              </div>
            </div>

            {/* CEO Information */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-orbitron font-bold text-primary mb-2">
                Zedekiah
              </h3>
              <p className="text-xl text-accent mb-4 font-semibold">
                Founder & Chief Executive Officer
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                With over a decade of experience in electronics repair and technology consulting, 
                Zedekiah founded ZTC with a vision to make professional tech services accessible 
                to everyone. His expertise spans from intricate circuit board repairs to 
                comprehensive IT infrastructure planning.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-orbitron font-bold text-primary mb-1">10+ Years</h4>
                  <p className="text-gray-600 text-sm">Industry Experience</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-orbitron font-bold text-primary mb-1">1000+</h4>
                  <p className="text-gray-600 text-sm">Devices Repaired</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-orbitron font-bold text-primary mb-1">Certified</h4>
                  <p className="text-gray-600 text-sm">Electronics Technician</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-orbitron font-bold text-primary mb-1">24/7</h4>
                  <p className="text-gray-600 text-sm">Support Available</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start space-x-4">
                {/* Email */}
                <a 
                  href="mailto:info@zedekiahtechclinic.com" 
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-accent transition-all duration-200 hover:scale-110"
                  aria-label="Email"
                  title="Send Email"
                >
                  <Mail size={28} />
                </a>
                {/* LinkedIn */}
                <a 
                  href={CEO_LINKEDIN_URL} 
                  target="_blank"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-accent transition-all duration-200 hover:scale-110"
                  aria-label="LinkedIn"
                  title="CEO LinkedIn"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={28} />
                </a>
                {/* WhatsApp (Phone) */}
                <a 
                  href="https://wa.me/254757756763"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-accent transition-all duration-200 hover:scale-110"
                  aria-label="WhatsApp"
                  title="Chat on WhatsApp"
                >
                  <Phone size={28} />
                </a>
                {/* Direct phone icon, to trigger dialer */}
                <a
                  href="tel:0757756763"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-accent transition-all duration-200 hover:scale-110"
                  aria-label="Call"
                  title="Call CEO"
                >
                  <Phone size={28} />
                </a>
              </div>
              {/* WhatsApp number display for clarity */}
              <div className="mt-3 flex justify-center md:justify-start">
                <span className="inline-flex items-center gap-2 text-lg text-primary">
                  <Phone size={18} className="inline-block" />
                  <a
                    href="https://wa.me/254757756763"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-accent"
                  >
                    0757 756 763
                  </a>
                  <span className="text-sm ml-2 text-gray-500">(WhatsApp)</span>
                </span>
              </div>
              {/* Emergency Call Button */}
              <div className="mt-6 flex justify-center md:justify-start">
                <a
                  href="tel:0757756763"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition text-lg"
                  style={{ letterSpacing: "1px" }}
                >
                  <Phone size={24} /> Emergency Call: 0757 756 763
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
