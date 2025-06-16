
import { useState } from 'react';
import { services, categories } from '@/data/servicesData';
import { Service } from '@/types/service';
import CategoryFilter from '@/components/services/CategoryFilter';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceModal from '@/components/services/ServiceModal';

const Services = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(service => service.category === activeFilter);

  const handleReadMore = (service: Service) => {
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

        <CategoryFilter
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onReadMore={handleReadMore}
            />
          ))}
        </div>

        <ServiceModal
          isOpen={modalOpen}
          onClose={setModalOpen}
          service={selectedService}
        />
      </div>
    </section>
  );
};

export default Services;
