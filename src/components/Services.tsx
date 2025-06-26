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
  const [showAll, setShowAll] = useState(false);

  const SERVICES_TO_SHOW = 6;

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(service => service.category === activeFilter);

  const handleReadMore = (service: Service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <section id="services" className="py-10 sm:py-16 md:py-20 bg-white relative">
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-orbitron font-bold text-primary mb-4 sm:mb-6">
            Our Services
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technology solutions for all your electronic and digital needs
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {(showAll ? filteredServices : filteredServices.slice(0, SERVICES_TO_SHOW)).map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onReadMore={handleReadMore}
            />
          ))}
        </div>
        {filteredServices.length > SERVICES_TO_SHOW && (
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}

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
