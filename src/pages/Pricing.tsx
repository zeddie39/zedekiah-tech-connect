import React from 'react';

type PriceItem = {
  job: string;
  details: string;
  price: string;
  time?: string;
  category: 'laptop' | 'phone' | 'cctv';
};

const ITEMS: PriceItem[] = [
  { job: 'Consultation', details: 'Any laptop consultation, troubleshooting and prescriptions.', price: 'Ksh. 1000-2000', time: '20min - 2 hours', category: 'laptop' },
  { job: 'Screen Repair', details: 'Supply and replace broken screen, any laptop screen.', price: 'Ksh. 3,500-16,000', time: '30min - 2 hours', category: 'laptop' },
  { job: 'Power Socket', details: 'Supply and replace power socket for standard laptop.', price: 'Ksh. 1,500-3,500', time: '1-2 hours', category: 'laptop' },
  { job: 'Repair Liquid Damage/Drink Spillage', details: 'Dry out various parts, assuming none need replacing. (If replacements are needed, the price will be higher.)', price: 'Ksh. 2,500-8,000', time: '24hrs+', category: 'laptop' },
  { job: 'Replace Hard Drive', details: 'Supply and replace 500GB hard drive.', price: 'Ksh. 2,500', category: 'laptop' },
  { job: 'Reinstall software', details: '', price: 'Ksh. 500-1000', category: 'laptop' },
  { job: 'Transfer data', details: 'Transfer data from old hard drive to new.', price: 'Ksh. 500-1500', category: 'laptop' },
  { job: 'Casing Replacement', details: 'Partial or full casing replacement.', price: 'Ksh. 1,500-7,000', category: 'laptop' },
  { job: 'Motherboard Replacement', details: 'Full motherboard replacement.', price: 'Ksh. 4,500-20,000', category: 'laptop' },
  // Phone samples
  { job: 'Phone Screen Repair', details: 'Replace broken phone screen.', price: 'Ksh. 800-6,000', category: 'phone' },
  { job: 'Phone Battery Replacement', details: 'Replace phone battery.', price: 'Ksh. 500-2,000', category: 'phone' },
  { job: 'Phone Water Damage', details: 'Dry and clean phone internals.', price: 'Ksh. 800-5,000', category: 'phone' },
  // CCTV samples
  { job: 'CCTV Installation', details: 'Install HD CCTV camera and DVR.', price: 'Ksh. 3,000-12,000', category: 'cctv' },
  { job: 'CCTV Maintenance', details: 'Troubleshoot camera/DVR issues.', price: 'Ksh. 1,000-4,000', category: 'cctv' },
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PricingPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const initialCategory = (params.get('category') as 'laptop' | 'phone' | 'cctv' | null) ?? null;
  const [category, setCategory] = React.useState<typeof initialCategory>(initialCategory);
  const items = React.useMemo(() => shuffle(ITEMS), []);
  const filtered = category ? items.filter((i) => i.category === category) : items;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-accent">Our Service Pricing</h1>

      <div className="flex items-center justify-center gap-3 mb-6">
        {(['all', 'laptop', 'phone', 'cctv'] as const).map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c === 'all' ? null : c);
              const url = new URL(window.location.href);
              if (c === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', c);
              window.history.replaceState({}, '', url.toString());
            }}
            className={`px-4 py-2 rounded-md ${category === (c === 'all' ? null : c) ? 'bg-accent text-white' : 'bg-white border'}`}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((it) => (
          <div key={it.job + it.category} className="bg-white rounded-lg shadow p-6 border border-accent/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{it.job}</h3>
              <div className="text-sm text-green-700 font-bold">{it.price}</div>
            </div>
            {it.details && <p className="text-sm text-gray-700 mb-3">{it.details}</p>}
            <div className="flex items-center justify-between">
              {it.time ? <div className="text-xs text-gray-500">Time: {it.time}</div> : <div />}
              <div className="text-xs uppercase text-muted-foreground">{it.category}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <b>NB:</b> The prices quoted above are based on experience, not time.<br />
        Storage fees will be charged for any unpicked laptop after two weeks from the repair date.
      </div>
    </div>
  );
};

export default PricingPage;
