
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Smartphone } from "lucide-react";

const categories = [
  {
    name: "Gadgets",
    icon: Smartphone,
    color: "bg-green-100 text-green-700",
    desc: "Electronics, phones & accessories.",
  }
];

export default function ShopCategories() {
  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Browse Electronics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
        {categories.map(cat => (
          <Card
            key={cat.name}
            onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
            className={`group cursor-pointer hover:shadow-lg transition-transform duration-150 p-5 flex flex-col items-center justify-center gap-2 ${cat.color} hover:scale-105`}
          >
            <cat.icon size={36} className="mb-1" />
            <div className="font-semibold">{cat.name}</div>
            <div className="text-xs text-gray-500 text-center">{cat.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
