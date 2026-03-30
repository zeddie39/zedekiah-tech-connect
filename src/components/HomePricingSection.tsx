import React from "react";
import { services } from "@/data/servicesData";

const HomePricingSection: React.FC = () => (
  <section className="py-16 bg-gradient-to-b from-background to-secondary/30" id="pricing">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Service Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.slice(0, 6).map((service) => (
          <div key={service.title} className="bg-card rounded-lg shadow p-6 flex flex-col items-start border border-border">
            <div className="mb-2">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-1 text-foreground">{service.title}</h3>
            <p className="mb-2 text-muted-foreground">{service.description}</p>
            {service.price && (
              <div className="text-lg font-bold text-green-600 mb-2">Ksh {service.price.toLocaleString()}</div>
            )}
            <ul className="mb-2 list-disc list-inside text-sm text-muted-foreground">
              {service.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <a href="/pricing?category=laptop" className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded shadow hover:bg-accent/90 transition">Laptop Pricing Details</a>
      </div>
    </div>
  </section>
);

export default HomePricingSection;
