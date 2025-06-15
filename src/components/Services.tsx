
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Services = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const services = [
    {
      title: 'Phone & Tablet Repair',
      description: 'Screen replacement, battery issues, water damage recovery, and software troubleshooting',
      category: 'repair',
      icon: '📱',
      features: ['Screen Replacement', 'Battery Repair', 'Water Damage', 'Software Issues']
    },
    {
      title: 'Laptop & Computer Repair',
      description: 'Hardware diagnostics, component replacement, virus removal, and performance optimization',
      category: 'repair',
      icon: '💻',
      features: ['Hardware Diagnostics', 'Component Replacement', 'Virus Removal', 'Performance Tuning']
    },
    {
      title: 'CCTV Installation',
      description: 'Professional security camera setup, monitoring systems, and remote access configuration',
      category: 'installation',
      icon: '📹',
      features: ['Camera Installation', 'Monitoring Setup', 'Remote Access', 'System Maintenance']
    },
    {
      title: 'Home & Office Wiring',
      description: 'Electrical wiring, network cable installation, and smart home setup services',
      category: 'installation',
      icon: '🔌',
      features: ['Electrical Wiring', 'Network Cables', 'Smart Home Setup', 'Safety Inspection']
    },
    {
      title: 'Software Solutions',
      description: 'Operating system installation, software setup, data recovery, and system optimization',
      category: 'software',
      icon: '💿',
      features: ['OS Installation', 'Software Setup', 'Data Recovery', 'System Optimization']
    },
    {
      title: 'Tech Consultation',
      description: 'Technology planning, system recommendations, and strategic IT advice for businesses',
      category: 'consultation',
      icon: '🔧',
      features: ['Tech Planning', 'System Recommendations', 'IT Strategy', 'Business Solutions']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'repair', name: 'Repair' },
    { id: 'installation', name: 'Installation' },
    { id: 'software', name: 'Software' },
    { id: 'consultation', name: 'Consultation' }
  ];

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technology solutions for all your electronic and digital needs
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeFilter === category.id
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <Card key={index} className="service-card group">
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-orbitron text-primary group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Learn More
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
