import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "@/components/ShopNavbar";

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
    <>
      <ShopNavbar />
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-2 sm:px-3">
        <div className="mb-6">
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/')}
            className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 mb-4"
          >
             Go Back
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8 sm:mt-12 text-base sm:text-lg">
            You have no orders yet.
          </div>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-0">
                  <div className="font-semibold text-xs sm:text-base">Order ID: <span className="text-xs">{order.id.slice(0,8)}...</span></div>
                  <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</div>
                </div>
                <ul className="mb-2 text-xs sm:text-sm">
                  <li>
                    <span>Product: {order.product_id}</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row justify-between border-t pt-2 mt-2 gap-1 sm:gap-0">
                  <span className="font-bold text-xs sm:text-base">Total: Ksh {order.amount.toFixed(2)}</span>
                  <span className="text-xs">{order.status} / {order.payment_status}</span>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
