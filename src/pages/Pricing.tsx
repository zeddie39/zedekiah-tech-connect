import React from 'react';
import { services } from '@/data/servicesData';

const PricingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-accent">Our Service Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, idx) => (
          <div key={service.title} className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <div className="mb-2">{service.icon}</div>
            <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
            <p className="mb-2 text-gray-600">{service.description}</p>
            {service.price && (
              <div className="text-lg font-bold text-green-600 mb-2">Ksh {service.price.toLocaleString()}</div>
            )}
            <ul className="mb-2 list-disc list-inside text-sm text-gray-500">
              {service.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="text-xs text-gray-400">{service.more}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
