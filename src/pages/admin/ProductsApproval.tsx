import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Image as ImageIcon, CheckCircle2, XCircle, Eye } from "lucide-react";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: string | null;
};

type ProductWithImage = Product & { image_url?: string | null };

export default function ProductsApproval() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  useEffect(() => {
    fetchProducts(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function fetchProducts(filter: 'pending' | 'approved' | 'rejected' | 'all') {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (filter !== 'all') query = query.eq("status", filter);
    const { data, error } = await query;
    if (error) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const list = (data || []) as Product[];
    // fetch first image for each product
    const withImg: ProductWithImage[] = await Promise.all(list.map(async (p) => {
      const { data: img } = await supabase.from('product_images').select('image_url').eq('product_id', p.id).single();
      return { ...p, image_url: img?.image_url || null };
    }));
    setProducts(withImg);
    setLoading(false);
  }

  async function handleApprove(id: string) {
    if (!confirm('Approve this product?')) return;
    setLoading(true);
    await supabase.from("products").update({ status: "approved" }).eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setLoading(false);
  }

  async function handleReject(id: string) {
    if (!confirm('Reject this product?')) return;
    setLoading(true);
    await supabase.from("products").update({ status: "rejected" }).eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold">Product Moderation</h2>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-40"><Loader2 className="animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="text-muted-foreground">No products found for this filter.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-3 rounded-xl border border-accent/30 bg-card/90">
              <div className="rounded-md overflow-hidden bg-muted border border-accent/20 h-40 flex items-center justify-center mb-2">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-bold truncate" title={product.title}>{product.title}</div>
                <span className="text-xs px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent">{product.status}</span>
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</div>
              <div className="text-sm font-semibold mb-2">Ksh {product.price.toFixed(2)}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="inline-flex items-center gap-1" onClick={() => handleApprove(product.id)}>
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </Button>
                <Button size="sm" variant="destructive" className="inline-flex items-center gap-1" onClick={() => handleReject(product.id)}>
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
