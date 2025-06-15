
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Order = {
  id: string;
  created_at: string;
  amount: number;
  status: string | null;
  payment_status: string | null;
  product_id: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (mounted && data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetchOrders();
    return () => { mounted = false; };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-3">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12 text-lg">
          You have no orders yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">Order ID: <span className="text-xs">{order.id.slice(0,8)}...</span></div>
                <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</div>
              </div>
              <ul className="mb-2 text-sm">
                <li>
                  <span>Product: {order.product_id}</span>
                  {/* In a real app, you would join to a products table for the product title */}
                </li>
              </ul>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold">Total: ${order.amount.toFixed(2)}</span>
                <span className="text-xs">{order.status} / {order.payment_status}</span>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
