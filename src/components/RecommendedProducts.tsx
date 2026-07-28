import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Sparkles, ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type RecProduct = {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  category: string | null;
  image_url?: string | null;
};

export default function RecommendedProducts({
  currentId,
  category,
}: {
  currentId: string;
  category: string | null;
}) {
  const [items, setItems] = useState<RecProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      // Try same-category first, fall back to newest
      let query = supabase
        .from("products")
        .select("id, title, price, original_price, category")
        .neq("id", currentId)
        .limit(8);
      if (category) query = query.eq("category", category);
      const { data: sameCat } = await query;

      let base = sameCat ?? [];
      if (base.length < 4) {
        const { data: fillers } = await supabase
          .from("products")
          .select("id, title, price, original_price, category")
          .neq("id", currentId)
          .order("created_at", { ascending: false })
          .limit(8);
        const seen = new Set(base.map((p) => p.id));
        base = [...base, ...(fillers ?? []).filter((p) => !seen.has(p.id))].slice(0, 8);
      }

      // Fetch first image for each
      const ids = base.map((p) => p.id);
      let imgMap: Record<string, string> = {};
      if (ids.length) {
        const { data: imgs } = await supabase
          .from("product_images")
          .select("product_id, image_url")
          .in("product_id", ids);
        (imgs ?? []).forEach((r: any) => {
          if (!imgMap[r.product_id]) imgMap[r.product_id] = r.image_url;
        });
      }

      if (!mounted) return;
      setItems(base.map((p) => ({ ...p, image_url: imgMap[p.id] ?? null })).slice(0, 6));
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [currentId, category]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Finding items you might like…
      </div>
    );
  }
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">You might also like</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {items.map((p, i) => {
          const discount =
            p.original_price && p.original_price > p.price
              ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
              : 0;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Link to={`/shop/${p.id}`}>
                <Card className="group overflow-hidden border-accent/20 hover:border-primary/60 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-30" />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2 min-h-[2rem]">{p.title}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-bold text-primary">Ksh {p.price.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          {p.original_price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
