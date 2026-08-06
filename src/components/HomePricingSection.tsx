import React from "react";
import { services } from "@/data/servicesData";

const HomePricingSection: React.FC = () => (
  <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300" id="pricing">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-accent mb-8">Service Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.slice(0, 6).map((service) => (
          <div key={service.title} className="bg-white dark:bg-slate-900/90 text-gray-900 dark:text-white rounded-2xl shadow-lg hover:shadow-xl p-6 flex flex-col items-start border border-gray-100 dark:border-slate-800 transition-all duration-300">
            <div className="mb-3 text-accent">{service.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
            <p className="mb-4 text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{service.description}</p>
            {service.price && (
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-3">Ksh {service.price.toLocaleString()}</div>
            )}
            <ul className="mb-4 space-y-1.5 text-sm text-gray-600 dark:text-slate-300">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <a href="/pricing?category=laptop" className="inline-block px-8 py-3.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-lg transition-transform hover:scale-105">Laptop Pricing Details</a>
      </div>
    </div>
  </section>
);

export default HomePricingSection;
