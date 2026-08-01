import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pricingData } from '@/data/pricingData';
import { ShieldAlert, Info, ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const PricingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredData = activeCategory === 'all' 
    ? pricingData 
    : pricingData.filter(cat => cat.id === activeCategory);

  return (
    <PageTransition>
      <SEO
        title="Service Pricing Guide"
        description="View ZTech Electronics' complete service pricing guide for 2026. Transparent starting prices for web development, phone repair, CCTV installation, networking, and more."
        keywords="ZTech pricing, service prices Kenya, phone repair cost, CCTV installation price, web development cost Kenya"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-background text-gray-900 dark:text-foreground flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>

          {/* Header section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">ZTECH ELECTRONICS LTD.</h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-foreground/80 mb-6">SERVICE PRICE GUIDE (2026)</h2>
            
            <div className="max-w-3xl mx-auto bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500 p-4 rounded text-left flex items-start gap-3 shadow-sm">
              <Info className="text-blue-500 shrink-0 mt-1" size={24} />
              <p className="text-blue-900 dark:text-blue-200 font-medium text-sm md:text-base">
                All prices are starting prices and may vary depending on project scope, equipment, and complexity. 
                Replacement parts, hardware, software licenses, and transport are quoted separately where applicable.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeCategory === 'all' 
                  ? 'bg-accent text-foreground shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Services
            </button>
            {pricingData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
                  activeCategory === cat.id 
                    ? 'bg-accent text-foreground shadow-md' 
                    : 'bg-white dark:bg-card text-gray-700 dark:text-foreground/80 border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-muted'
                }`}
              >
                <cat.icon size={16} />
                {cat.title}
              </button>
            ))}
          </div>

          {/* Pricing Tables */}
          <div className="space-y-12">
            {filteredData.map((category) => (
              <div key={category.id} className="bg-white dark:bg-card/90 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-border">
                <div className="bg-accent/10 px-6 py-4 border-b border-accent/20 flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-muted rounded-lg text-accent shadow-sm">
                    <category.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-foreground">{category.title}</h3>
                </div>
                
                {category.note && (
                  <div className="px-6 py-3 bg-gray-50 dark:bg-background text-sm text-gray-600 dark:text-muted-foreground italic border-b border-gray-100 dark:border-border">
                    * {category.note}
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-muted/50">
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wider border-b border-gray-200 dark:border-border">Service</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wider border-b border-gray-200 dark:border-border text-right">Starting Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-border">
                      {category.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-foreground">
                            {item.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className="font-bold text-green-700 dark:text-emerald-400">{item.price}</span>
                            {item.note && <span className="text-gray-500 dark:text-muted-foreground text-xs ml-2 italic">{item.note}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Terms and Conditions */}
          <div className="mt-16 bg-white dark:bg-card/90 rounded-xl shadow-md p-6 md:p-8 border border-gray-100 dark:border-border">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-border">
              <ShieldAlert className="text-accent" size={28} />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-foreground">Terms & Conditions</h3>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-foreground/80 list-disc pl-5">
              <li>Prices shown are <strong>starting prices</strong>.</li>
              <li>Hardware, replacement parts, software licenses, and subscriptions are billed separately unless specifically included.</li>
              <li>A quotation is provided for projects with custom requirements.</li>
              <li>A <strong>50% deposit</strong> is required before the commencement of software development, website projects, and major installations.</li>
              <li>Repairs may require a diagnostic assessment before a final quote is issued.</li>
              <li>All work is subject to agreed timelines and scope.</li>
            </ul>
          </div>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
