
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Home, Smartphone, HeartPulse, Hammer } from "lucide-react";

const categories = [
  {
    name: "Gadgets",
    icon: Smartphone,
    color: "bg-green-100 text-green-700",
    desc: "Phones, laptops & accessories.",
  },
  {
    name: "Property",
    icon: Home,
    color: "bg-yellow-100 text-yellow-700",
    desc: "Homes, land & rentals.",
  },
  {
    name: "Fashion",
    icon: ShoppingBag,
    color: "bg-pink-100 text-pink-700",
    desc: "Clothes, shoes & more.",
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    color: "bg-blue-100 text-blue-700",
    desc: "Medicines & wellness.",
  },
  {
    name: "Repairs",
    icon: Hammer,
    color: "bg-gray-100 text-gray-700",
    desc: "Repair services nearby.",
  },
];

export default function ShopCategories() {
  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Card
            key={cat.name}
            onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
            className={`group cursor-pointer hover:shadow-lg transition-all duration-150 p-4 flex flex-col items-center justify-center gap-2 ${cat.color} hover:scale-105`}
          >
            <cat.icon size={32} className="mb-1" />
            <div className="font-semibold">{cat.name}</div>
            <div className="text-xs text-gray-500 text-center">{cat.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
