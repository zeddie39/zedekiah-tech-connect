
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Smartphone, Laptop, Camera, Plug, Disc, BookOpen, Search } from 'lucide-react';

const serviceImages = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Laptop Repair
  "https://images.unsplash.com/photo-1518770660439-4636190af475", // Circuit Board/PC
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", // CCTV
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1", // Wiring/network
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7", // Software
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"  // Consultation
];

const Services = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const services = [
    {
      title: 'Phone & Tablet Repair',
      description: 'Screen replacement, battery issues, water damage recovery, and software troubleshooting',
      category: 'repair',
      icon: <Smartphone className="text-accent" size={40} />,
      features: ['Screen Replacement', 'Battery Repair', 'Water Damage', 'Software Issues'],
      image: serviceImages[0],
      more: 'We repair a wide range of smartphones and tablets, handling both hardware and software issues with genuine parts and advanced diagnostics.'
    },
    {
      title: 'Laptop & Computer Repair',
      description: 'Hardware diagnostics, component replacement, virus removal, and performance optimization',
      category: 'repair',
      icon: <Laptop className="text-accent" size={40} />,
      features: ['Hardware Diagnostics', 'Component Replacement', 'Virus Removal', 'Performance Tuning'],
      image: serviceImages[1],
      more: 'From slow PCs to major hardware failures, our technicians restore computers and laptops to optimal performance, ensuring maximum uptime.'
    },
    {
      title: 'CCTV Installation',
      description: 'Professional security camera setup, monitoring systems, and remote access configuration',
      category: 'installation',
      icon: <Camera className="text-accent" size={40} />,
      features: ['Camera Installation', 'Monitoring Setup', 'Remote Access', 'System Maintenance'],
      image: serviceImages[2],
      more: 'Secure your home or business with smart and scalable CCTV systems. We offer complete installation, monitoring, and remote support services.'
    },
    {
      title: 'Home & Office Wiring',
      description: 'Electrical wiring, network cable installation, and smart home setup services',
      category: 'installation',
      icon: <Plug className="text-accent" size={40} />,
      features: ['Electrical Wiring', 'Network Cables', 'Smart Home Setup', 'Safety Inspection'],
      image: serviceImages[3],
      more: 'Our wiring experts deliver safe electrical and network installations for homes and offices, including smart device configuration and internet setup.'
    },
    {
      title: 'Software Solutions',
      description: 'Operating system installation, software setup, data recovery, and system optimization',
      category: 'software',
      icon: <Disc className="text-accent" size={40} />,
      features: ['OS Installation', 'Software Setup', 'Data Recovery', 'System Optimization'],
      image: serviceImages[4],
      more: 'Get help with installing applications, recovering lost data, OS upgrades, and making your devices run like new. Fast and secure service.'
    },
    {
      title: 'Tech Consultation',
      description: 'Technology planning, system recommendations, and strategic IT advice for businesses',
      category: 'consultation',
      icon: <BookOpen className="text-accent" size={40} />,
      features: ['Tech Planning', 'System Recommendations', 'IT Strategy', 'Business Solutions'],
      image: serviceImages[5],
      more: 'Our consultants work closely with you for tailored IT strategies, digital transformation, and reliable tech roadmaps for business growth.'
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

  const handleReadMore = (service: any) => {
    setSelectedService(service);
    setModalOpen(true);
  };

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
            <Card key={index} className="service-card group flex flex-col h-full">
              {/* Card Image */}
              <img
                src={service.image}
                alt={service.title}
                className="rounded-t-xl w-full h-40 object-cover"
              />
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-orbitron text-primary group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-auto w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleReadMore(service)}
                >
                  Learn More
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal for Read More */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-orbitron">
                {selectedService?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedService && (
              <div>
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <p className="mb-2 text-gray-700">{selectedService.description}</p>
                <ul className="list-disc ml-6 mb-4">
                  {selectedService.features.map((feature: string, idx: number) => (
                    <li key={idx} className="text-gray-800">{feature}</li>
                  ))}
                </ul>
                <p className="text-gray-900">{selectedService.more}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Services;
