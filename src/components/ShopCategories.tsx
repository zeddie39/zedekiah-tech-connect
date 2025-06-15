
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Smartphone, Laptop, Headphones, Gamepad2, Camera, Puzzle } from "lucide-react";

type Category = {
  name: string;
  icon: LucideIcon;  // Use LucideIcon type for compatibility
  color: string;
  desc: string;
};

const categories: Category[] = [
  {
    name: "Gadgets",
    icon: Smartphone,
    color: "bg-green-100 text-green-700",
    desc: "Electronics, phones, tablets, wearables.",
  },
  {
    name: "Laptops",
    icon: Laptop,
    color: "bg-blue-100 text-blue-700",
    desc: "Laptops, ultrabooks & notebooks.",
  },
  {
    name: "Audio",
    icon: Headphones,
    color: "bg-yellow-100 text-yellow-700",
    desc: "Earphones, headphones, speakers.",
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    color: "bg-purple-100 text-purple-700",
    desc: "Consoles & gaming accessories.",
  },
  {
    name: "Cameras",
    icon: Camera,
    color: "bg-pink-100 text-pink-700",
    desc: "Cameras & photography equipment.",
  },
  {
    name: "Accessories",
    icon: Puzzle,
    color: "bg-orange-100 text-orange-700",
    desc: "Chargers, cables, cases, more.",
  },
];

type ShopCategoriesProps = {
  selectedCategory?: string;
  onSelectCategory?: (cat: string | null) => void;
};

export default function ShopCategories({ selectedCategory, onSelectCategory }: ShopCategoriesProps) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Browse Electronics</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl">
        {categories.map(cat => {
          const selected = cat.name === selectedCategory;
          const Icon = cat.icon;
          return (
            <Card
              key={cat.name}
              onClick={() => onSelectCategory?.(selected ? null : cat.name)}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              className={`
                group cursor-pointer transition-transform duration-150 p-4 flex flex-col items-center justify-center gap-2
                ${cat.color}
                border-2 ${selected ? 'border-primary scale-105 shadow-lg' : 'border-transparent'}
                hover:scale-105 hover:shadow-lg
                focus:ring-2 focus:ring-primary
                `}
            >
              <Icon size={32} className="mb-1 transition-colors" />
              <div className="font-semibold">{cat.name}</div>
              <div className="text-xs text-gray-500 text-center">{cat.desc}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

