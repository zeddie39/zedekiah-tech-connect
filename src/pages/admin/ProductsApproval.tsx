import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: string | null;
};

export default function ProductsApproval() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  async function handleApprove(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("products")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) setError(error.message);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setLoading(false);
    navigate("/shop"); // Redirect to shop after approval
  }

  async function handleReject(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("products")
      .update({ status: "rejected" })
      .eq("id", id);
    if (error) setError(error.message);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setLoading(false);
  }

  if (loading) return <div className="flex items-center justify-center min-h-40"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Pending Product Approvals</h2>
      {products.length === 0 ? (
        <div className="text-muted-foreground">No pending products.</div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="p-4 flex flex-col gap-2 w-full sm:w-[48%] md:w-[31%] max-w-xs min-w-[220px] flex-1"
            >
              <div className="font-bold text-lg">{product.title}</div>
              <div className="text-sm text-muted-foreground">{product.description}</div>
              <div className="text-sm">Category: {product.category}</div>
              <div className="text-sm">Price: Ksh {product.price}</div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => handleApprove(product.id)} size="sm" variant="default">Approve</Button>
                <Button onClick={() => handleReject(product.id)} size="sm" variant="destructive">Reject</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
