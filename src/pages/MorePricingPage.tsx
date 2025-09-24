
import { Link } from "react-router-dom";

const MorePricingPage: React.FC = () => (
  <section className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
    <div className="max-w-3xl mx-auto px-4 mb-6">
      <Link to="/" className="inline-block px-4 py-2 bg-accent text-white rounded shadow hover:bg-accent/90 transition mb-4">&larr; Back to Home</Link>
    </div>
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-accent mb-8">Detailed Pricing</h1>
      <div className="bg-white rounded-lg shadow p-6 border border-accent/10">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Sample Repair Pricing</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><b>Screen Replacement (Smartphone):</b> from <span className="text-green-700 font-bold">Ksh 2,500</span></li>
          <li><b>Screen Replacement (Kaduda):</b> from <span className="text-green-700 font-bold">Ksh 350</span></li>
          <li><b>Battery Repair:</b> <span className="text-green-700 font-bold">Ksh 1,000</span></li>
          <li><b>Water Damage:</b> <span className="text-green-700 font-bold">Ksh 1,500</span></li>
          <li><b>Software Issues:</b> from <span className="text-green-700 font-bold">Ksh 1,500</span> to <span className="text-green-700 font-bold">Ksh 3,000</span></li>
        </ul>
        <div className="text-xs text-gray-400 mt-3">*Prices vary by model and issue. Contact us for a quote on your device or service.</div>
      </div>
      <div className="mt-10 bg-white rounded-lg shadow p-6 border border-accent/10">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Other Services</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><b>Web Design & Development:</b> from <span className="text-green-700 font-bold"> from as low as Ksh 15,000</span></li>
          <li><b>Software Development:</b> from <span className="text-green-700 font-bold"> from as low asKsh 20,000</span></li>
          <li><b>Poster & Flyer Design:</b> from <span className="text-green-700 font-bold"> from as low as Ksh 1,000</span></li>
          <li><b>Consultation:</b> <span className="text-green-700 font-bold">Ksh 500</span> per session</li>
          <li><b>Network Installation:</b> from <span className="text-green-700 font-bold"> from as low as Ksh 15,000</span></li>
        </ul>
        <div className="text-xs text-gray-400 mt-3">Contact us for a custom quote for your project or service.</div>
      </div>
    </div>
  </section>
);

export default MorePricingPage;
