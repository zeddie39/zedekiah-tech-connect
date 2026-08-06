import { Link } from "react-router-dom";

const MorePricingPage: React.FC = () => (
  <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white dark:from-background dark:via-card dark:to-background text-gray-900 dark:text-foreground min-h-screen transition-colors duration-300">
    <div className="max-w-3xl mx-auto px-4 mb-6">
      <Link to="/" className="inline-block px-5 py-2.5 bg-accent text-brand-on-orange font-bold rounded-xl shadow hover:bg-accent/90 transition mb-4">&larr; Back to Home</Link>
    </div>
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-accent-ink mb-8">Detailed Pricing</h1>
      <div className="bg-white dark:bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-border transition-colors">
        <h2 className="text-2xl font-semibold mb-4 text-accent-ink">Sample Repair Pricing (2026)</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-foreground space-y-2">
          <li><b>Diagnosis:</b> <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span> when the repair proceeds (<span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 800</span> diagnosis only)</li>
          <li><b>Screen Replacement (labour):</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 1,500</span> + parts</li>
          <li><b>Charging Port Replacement (labour):</b> <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 1,500</span> + parts</li>
          <li><b>Water Damage Cleaning:</b> <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 2,500</span></li>
          <li><b>Motherboard Repair:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 3,500</span></li>
          <li><b>Software Flashing / FRP Unlock:</b> <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 1,500 – 2,000</span></li>
          <li><b>Data Recovery:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 5,000</span></li>
        </ul>
        <div className="text-xs text-gray-500 dark:text-muted-foreground mt-4">*Starting prices. Replacement parts are quoted separately and vary by model.</div>
      </div>
      <div className="mt-8 bg-white dark:bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-border transition-colors">
        <h2 className="text-2xl font-semibold mb-4 text-accent-ink">Other Services</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-foreground space-y-2">
          <li><b>Business Website (5–10 pages):</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 25,000</span></li>
          <li><b>E-commerce Website:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 45,000</span></li>
          <li><b>Custom Software Development:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 70,000</span></li>
          <li><b>Poster & Flyer Design:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 1,500</span></li>
          <li><b>Logo Design:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 6,000</span></li>
          <li><b>IT Consultation:</b> <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 5,000</span> per hour</li>
          <li><b>Home Wi-Fi Setup:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 5,000</span></li>
          <li><b>Office Network Installation:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 15,000</span></li>
          <li><b>4-Camera CCTV Installation:</b> from <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh 25,000</span></li>
        </ul>
        <div className="text-xs text-gray-500 dark:text-muted-foreground mt-4">Contact us for a custom quote for your project or service. See the full <a href="/pricing" className="text-accent-ink font-semibold hover:underline">2026 price guide</a>.</div>
      </div>

    </div>
  </section>
);

export default MorePricingPage;
