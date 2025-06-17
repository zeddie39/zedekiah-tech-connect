import { Button } from './ui/button';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-6 font-playfair">
            About Zedekiah Tech Electronics Limited
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your trusted partner in comprehensive technology solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-bold text-primary mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              At Zedekiah Tech Electronics Limited, we're committed to providing affordable, reliable, and 
              professional electronic repair services alongside cutting-edge tech consultations. 
              We believe technology should enhance your life, not complicate it.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              From fixing your broken devices to setting up comprehensive security systems, 
              we're here to solve your tech challenges with expertise and care.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-orbitron font-bold text-primary mb-2">Expert Repairs</h4>
                <p className="text-gray-600">Professional device repair with quality guarantee</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-orbitron font-bold text-primary mb-2">Tech Consulting</h4>
                <p className="text-gray-600">Strategic technology advice for your needs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-orbitron font-bold text-primary mb-2">Home Solutions</h4>
                <p className="text-gray-600">Complete wiring and CCTV installations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-orbitron font-bold text-primary mb-2">Software Support</h4>
                <p className="text-gray-600">Installation and troubleshooting services</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-orbitron font-bold mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Certified technicians with years of experience</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Quick turnaround times for repairs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Comprehensive warranty on all services</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>24/7 support for emergency issues</span>
                </li>
              </ul>
              <Button 
                className="mt-6 bg-accent hover:bg-accent/90 text-white"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
