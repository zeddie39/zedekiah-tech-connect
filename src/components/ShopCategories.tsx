import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Smartphone, Laptop, Headphones, Gamepad2, Camera, Puzzle } from "lucide-react";

type Category = {
  name: string;
  icon: LucideIcon;
  color: string;
  desc: string;
};

export const categories: Category[] = [
  { name: "Gadgets", icon: Smartphone, color: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400", desc: "Phones, tablets, wearables" },
  { name: "Laptops", icon: Laptop, color: "from-blue-500/15 to-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400", desc: "Laptops & ultrabooks" },
  { name: "Audio", icon: Headphones, color: "from-amber-500/15 to-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400", desc: "Headphones & speakers" },
  { name: "Gaming", icon: Gamepad2, color: "from-violet-500/15 to-violet-500/5 border-violet-500/20 text-violet-600 dark:text-violet-400", desc: "Consoles & accessories" },
  { name: "Cameras", icon: Camera, color: "from-rose-500/15 to-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400", desc: "Photography equipment" },
  { name: "Accessories", icon: Puzzle, color: "from-orange-500/15 to-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-400", desc: "Chargers, cables, cases" },
];

type ShopCategoriesProps = {
  selectedCategory?: string | null;
  onSelectCategory?: (cat: string | null) => void;
};

export default function ShopCategories({ selectedCategory, onSelectCategory }: ShopCategoriesProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">Browse by Category</h2>
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => onSelectCategory?.(null)}
          >
            Clear filter ×
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const selected = cat.name === selectedCategory;
          const Icon = cat.icon;
          const colorParts = cat.color.split(' ');
          const iconColor = colorParts[colorParts.length - 1]; // last class is the text color

          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory?.(selected ? null : cat.name)}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-center
                ${selected
                  ? `bg-gradient-to-b ${cat.color} ring-2 ring-primary/30 shadow-lg scale-[1.02]`
                  : "bg-card/60 border-border/40 hover:border-primary/30 hover:shadow-md hover:bg-muted/40"
                }
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${selected
                  ? "bg-primary/15 shadow-inner"
                  : "bg-muted/60 group-hover:bg-primary/10"
                }
              `}>
                <Icon size={22} className={`transition-colors ${selected ? iconColor : "text-muted-foreground group-hover:text-primary"}`} />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{cat.name}</div>
                <div className="text-[10px] text-muted-foreground leading-snug hidden sm:block">{cat.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
