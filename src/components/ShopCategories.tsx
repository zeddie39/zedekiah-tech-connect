import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Smartphone, Laptop, Headphones, Gamepad2, Camera, Puzzle } from "lucide-react";

type Category = {
  name: string;
  icon: LucideIcon;
  color: string; // kept for compatibility, but not used in the new unified styling
  desc: string;
};

export const categories: Category[] = [
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
  selectedCategory?: string | null;
  onSelectCategory?: (cat: string | null) => void;
};

export default function ShopCategories({ selectedCategory, onSelectCategory }: ShopCategoriesProps) {
  return (
    <div className="mb-8">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Browse Electronics</h2>
        {selectedCategory ? (
          <Button
            variant="outline"
            size="sm"
            className="border-accent/50 hover:bg-accent/10"
            onClick={() => onSelectCategory?.(null)}
          >
            Clear
          </Button>
        ) : null}
      </div>

      {/* Categories grid */}
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const selected = cat.name === selectedCategory;
          const Icon = cat.icon;
          return (
            <Card
              key={cat.name}
              onClick={() => onSelectCategory?.(selected ? null : cat.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory?.(selected ? null : cat.name);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              className={[
                "group cursor-pointer transition-all duration-200 p-3 sm:p-4 rounded-xl",
                "bg-card/80 border border-accent/30 hover:border-accent/60 hover:shadow-lg",
                selected ? "ring-2 ring-accent shadow-lg bg-accent/10 translate-y-[-2px]" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-2">
                <div className="shrink-0 w-10 h-10 rounded-full bg-accent/15 ring-1 ring-accent/40 flex items-center justify-center">
                  <Icon size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{cat.name}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{cat.desc}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
