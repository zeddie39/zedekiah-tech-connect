import { Button } from './ui/button';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-4 font-playfair">
            About Ztech Electronics Limited
          </h2>
          <p className="text-xl text-accent font-semibold mb-2">"Reviving Technology. Empowering People."</p>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            Ztech Electronics Limited is a forward-thinking electronics and technology company founded with the mission to bridge the gap between people and the technology they rely on daily. Originally launched as Zedekiah Tech Clinic (ZTC), the company evolved into Ztech Electronics Limited to reflect its broader vision: delivering smart, accessible, and tech-powered services that go beyond conventional electronics repair.
          </p>
        </div>

        {/* Responsive cards that wrap naturally, not forced in a row */}
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8 justify-center">
          {/* What We Do Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex-1 min-w-[300px] max-w-sm mb-4">
            <h3 className="text-2xl font-orbitron font-bold text-primary mb-2 text-center">🔧 What We Do</h3>
            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-base md:text-lg">
              <li><span className="font-semibold text-primary">Electronics Repair Services:</span> From smartphones and laptops to game consoles and home devices, our expert team handles both hardware and software issues, using modern diagnostic tools and precision repair techniques.</li>
              <li><span className="font-semibold text-primary">AI-Powered Tech Support (In development):</span> Users can upload photos or describe their gadget issues. Our AI assistant provides instant diagnostics, possible causes, and smart repair suggestions—making technical help available 24/7.</li>
              <li><span className="font-semibold text-primary">Augmented Reality (AR) Assistance (Coming soon):</span> We’re building an AR-based feature that allows users to scan their damaged devices with a camera and get visual guides on possible issues and repair steps.</li>
              <li><span className="font-semibold text-primary">E-Commerce Marketplace:</span> A digital hub for users to buy, advertise, and sell electronics, with integrated messaging and secure payment options. Whether it’s secondhand phones, accessories, or repair parts, our platform supports a trusted community.</li>
              <li><span className="font-semibold text-primary">IT Consulting & Infrastructure Planning:</span> We support small businesses and organizations in setting up and managing robust tech infrastructure, from networking to cybersecurity.</li>
            </ul>
          </div>

          {/* Admin Dashboard & BI Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex-1 min-w-[300px] max-w-sm mb-4">
            <h3 className="text-2xl font-orbitron font-bold text-accent mb-2 text-center">📊 Admin Dashboard & BI</h3>
            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-base md:text-lg">
              <li>Analytics dashboard for monitoring repairs, sales, and user behavior</li>
              <li>Order and customer management tools</li>
              <li>Real-time chat with customers</li>
              <li>Automated repair ticket system</li>
              <li>Secure data handling and export features</li>
              <li>AI-assisted moderation and feedback analysis</li>
            </ul>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex-1 min-w-[300px] max-w-sm mb-4">
            <h3 className="text-2xl font-orbitron font-bold text-primary mb-2 text-center">💡 Our Vision</h3>
            <p className="text-gray-700 text-base md:text-lg mb-4 text-center">
              To become Africa’s leading smart electronics platform—a place where innovation meets everyday tech needs. We believe in democratizing tech, providing intelligent tools that empower users, technicians, and entrepreneurs.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex-1 min-w-[300px] max-w-sm mb-4">
            <h3 className="text-2xl font-orbitron font-bold text-primary mb-2 text-center">🎯 Our Mission</h3>
            <p className="text-gray-700 text-base md:text-lg mb-4 text-center">
              To bridge the gap between people and technology by delivering accessible, innovative, and reliable electronics solutions, empowering communities and driving digital transformation across Africa.
            </p>
          </div>

          {/* Core Values Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex-1 min-w-[300px] max-w-sm mb-4">
            <h3 className="text-2xl font-orbitron font-bold text-primary mb-2 text-center">⭐ Core Values</h3>
            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-base md:text-lg text-left">
              <li><span className="font-semibold text-primary">Integrity:</span> We act with honesty, transparency, and accountability in all we do.</li>
              <li><span className="font-semibold text-primary">Innovation:</span> We embrace new ideas and technologies to deliver the best solutions.</li>
              <li><span className="font-semibold text-primary">Customer Focus:</span> We put our clients’ needs first and strive for their satisfaction.</li>
              <li><span className="font-semibold text-primary">Excellence:</span> We pursue the highest standards in service and results.</li>
              <li><span className="font-semibold text-primary">Community:</span> We empower, support, and give back to our communities.</li>
            </ul>
          </div>

          {/* Why Ztech Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-accent/20 flex-1 min-w-[300px] max-w-sm mb-4">
            <h3 className="text-2xl font-orbitron font-bold text-accent mb-2 text-center">🌍 Why Ztech?</h3>
            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-base md:text-lg">
              <li><span className="font-semibold text-primary">Expertise:</span> 10+ years in electronics repair, tech consultancy, and product development.</li>
              <li><span className="font-semibold text-primary">Innovation-Driven:</span> Integrating AI, AR, and automation into traditional services.</li>
              <li><span className="font-semibold text-primary">Customer-Focused:</span> Built for individuals, SMEs, schools, and communities.</li>
              <li><span className="font-semibold text-primary">Scalable & Future-Ready:</span> Designed to grow into a global platform.</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row gap-8 items-stretch">
          <div className="flex-1 flex flex-col justify-center mb-8 md:mb-0">
            <div className="bg-primary/90 rounded-xl p-6 text-white text-center shadow-lg border border-accent/30">
              <h4 className="text-xl font-bold mb-2">📌 Slogan:</h4>
              <p className="text-lg font-semibold mb-1">“Revive. Reimagine. Reconnect.”</p>
              <p className="text-base">Because every device deserves a second chance—and every person deserves access to smart technology.</p>
            </div>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden shadow-lg border border-accent/30 min-h-[350px] md:min-h-[400px] h-full">
            <iframe
              title="Kisii University Location"
              src="https://maps.google.com/maps?q=Kisii%20University&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, width: '100%', height: '100%', minHeight: 350 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
