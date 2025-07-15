import { Mail, Linkedin, Phone } from "lucide-react";
import { useState } from "react";

const CEO_LINKEDIN_URL = "https://www.linkedin.com/in/vincent-ombati-8b05b422b/";

const Team = () => {
  const [showReadMore, setShowReadMore] = useState(false);

  return (
    <section id="team" className="py-10 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 relative">
        {/* Back to Home link removed as requested */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-ubuntu font-bold text-primary mb-4 sm:mb-6">
            Meet Our Team
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Led by experienced professionals dedicated to excellence in technology solutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* CEO Profile Image */}
            <div className="flex-shrink-0 relative group mb-6 md:mb-0">
              <div className="relative w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-primary to-accent p-1 flex items-center justify-center">
                <img
                  src="/me3.jpg"
                  alt="CEO Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* LinkedIn overlay on the photo */}
                <a
                  href={CEO_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 bg-primary rounded-full p-2 shadow-md hover:bg-accent transition-all z-10"
                  aria-label="LinkedIn (CEO)"
                  title="CEO LinkedIn"
                  style={{ border: "3px solid white" }}
                >
                  <Linkedin className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </a>
              </div>
              {/* Floating tech elements around the profile */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center text-white text-lg sm:text-xl animate-float">
                <Phone className="w-5 h-5 sm:w-8 sm:h-8" />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-7 h-7 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white text-base sm:text-lg animate-float" style={{ animationDelay: '1s' }}>
                <Mail className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
            {/* CEO Information */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl sm:text-3xl font-ubuntu font-bold text-primary mb-2">
                Vincent Zedekiah.
              </h3>
              <p className="text-base sm:text-xl text-accent mb-2 sm:mb-4 font-semibold">
                Founder & Chief Executive Officer
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6">
                With over a decade of experience in electronics repair and technology consulting, 
                Vincent founded ZTC with a vision to make professional tech services accessible 
                to everyone. His expertise spans from intricate circuit board repairs to 
                comprehensive IT infrastructure planning.
                <button
                  className="ml-2 text-accent underline hover:text-primary font-semibold focus:outline-none transition-all duration-300 border-b-2 border-accent border-opacity-0 focus:border-opacity-100 hover:border-opacity-100"
                  style={{ boxShadow: 'none' }}
                  onClick={() => setShowReadMore(true)}
                >
                  Read More
                </button>
              </p>
              {showReadMore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-4">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 sm:p-6 relative flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 max-h-screen overflow-y-auto">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
                      onClick={() => setShowReadMore(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    {/* Left: Avatar and name */}
                    <div className="flex flex-col items-center justify-center mb-4 md:mb-0">
                      <img
                        src="/me1.jpg"
                        alt="Vincent Ombati Detailed"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full mb-4 border-4 border-primary shadow-lg object-top"
                      />
                      <h3 className="text-xl sm:text-2xl font-bold text-primary text-center mb-1">Vincent Ombati</h3>
                      <p className="text-center text-accent font-semibold mb-4">Founder & Chief Executive Officer<br/>Ztech Electronics Limited</p>
                    </div>
                    {/* Right: Carded bio */}
                    <div className="space-y-4 max-h-[50vh] sm:max-h-96 overflow-y-auto text-sm sm:text-base">
                      <div className="bg-gray-50 rounded-lg p-4 shadow">
                        With over a decade of hands-on experience in electronics repair, software development, and technology consulting, Vincent has always been driven by one core mission: to revive tech and empower people with it.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 shadow">
                        From a young age, Vincent was the go-to tech problem solver in his community in Nairobi. What began as a fascination with broken radios and fried phone boards turned into a lifelong pursuit of understanding the language of circuits, code, and innovation. His natural curiosity and determination led him to pursue formal training in Computer Science, where he deepened his skills in hardware diagnostics, software engineering, and AI integration.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 shadow">
                        Recognizing a gap in reliable, affordable, and intelligent electronics support, he launched Ztech Electronics Ltd (ZTEL). The goal was clear: create a modern tech hub that not only repairs electronics but also reimagines the experience using cutting-edge technologies like Artificial Intelligence, Augmented Reality, and automation.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 shadow">
                        <b>Under his leadership, Ztech has evolved into more than just a repair shop. It's now a platform that blends:</b>
                        <ul className="list-disc ml-6 mt-2">
                          <li>AI-powered diagnostics that let users upload photos or describe their gadget issues to receive smart repair recommendations.</li>
                          <li>A fully functional e-commerce system, where users can shop for gadgets, advertise electronics, make orders, and communicate directly with sellers.</li>
                          <li>An intelligent admin dashboard, equipped with analytics, chat management, repair tracking, and decision-making tools for business growth.</li>
                          <li>An upcoming AR assistant that will let users virtually identify parts and repair areas by simply pointing their phone camera at a damaged device.</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 shadow italic text-center">
                        “If a device can be revived, it still has value—and if people can learn through tech, they can be empowered for life.”
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 shadow">
                        Today, Vincent continues to lead Ztech Electronics Limited with vision and heart. He balances the technical side with entrepreneurial agility, constantly exploring ways to automate, scale, and personalize tech support for everyday users and enterprises alike.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 shadow">
                        He is also passionate about youth mentorship, helping upcoming developers and engineers build their own tech paths. Through his platform, he’s laying the foundation for a new era of smart, sustainable, and human-centered electronics innovation—starting from Kenya and expanding globally.
                      </div>
                    </div>
                    {/* See more about Vincent Button in the modal */}
                    <div className="flex justify-center mt-4 md:col-span-2">
                      <a
                        href="https://zedekiah.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-accent to-primary text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-all animate-pulse border-2 border-accent"
                        style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '1px' }}
                      >
                        See more about Vincent
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-ubuntu font-bold text-primary mb-1">10+ Years</h4>
                  <p className="text-gray-600 text-sm">Industry Experience</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-ubuntu font-bold text-primary mb-1">1000+</h4>
                  <p className="text-gray-600 text-sm">Devices Repaired</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-ubuntu font-bold text-primary mb-1">Certified</h4>
                  <p className="text-gray-600 text-sm">Electronics Technician</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-ubuntu font-bold text-primary mb-1">24/7</h4>
                  <p className="text-gray-600 text-sm">Support Available</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start space-x-4">
                {/* Email */}
                <a 
                  href="mailto:info@ztechelectronicsltd.com" 
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

              {/* See more about Vincent Button */}
              <div className="flex justify-center md:justify-start mt-4">
                <a
                  href="https://zedekiah.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-accent to-primary text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-all animate-pulse border-2 border-accent"
                  style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '1px' }}
                >
                  See more about Vincent
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
