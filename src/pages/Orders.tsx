import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import ShopNavbar from "@/components/ShopNavbar";

type Order = {
  id: string;
  created_at: string;
  amount: number;
  status: string | null;
  payment_status: string | null;
  product_id: string;
  delivery_location: string | null;
  mpesa_receipt?: string | null;
};

type Product = {
  id: string;
  title: string;
};

type StatusConfig = {
  color: string;
  bgColor: string;
  label: string;
};

const statusConfig: Record<string, StatusConfig> = {
  pending: { color: "text-yellow-700", bgColor: "bg-yellow-100", label: "Pending" },
  confirmed: { color: "text-blue-700", bgColor: "bg-blue-100", label: "Confirmed" },
  completed: { color: "text-green-700", bgColor: "bg-green-100", label: "Completed" },
  delivered: { color: "text-green-700", bgColor: "bg-green-100", label: "Delivered" },
  cancelled: { color: "text-red-700", bgColor: "bg-red-100", label: "Cancelled" },
  payment_failed: { color: "text-red-700", bgColor: "bg-red-100", label: "Failed" },
};

const paymentConfig: Record<string, StatusConfig> = {
  pending: { color: "text-yellow-700", bgColor: "bg-yellow-100", label: "Pending" },
  paid: { color: "text-green-700", bgColor: "bg-green-100", label: "Paid" },
  failed: { color: "text-red-700", bgColor: "bg-red-100", label: "Failed" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
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
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (mounted && data) {
        setOrders(data as Order[]);

        const productIds = [...new Set(data.map(o => o.product_id))];
        if (productIds.length > 0) {
          const { data: productsData } = await supabase
            .from("products")
            .select("id, title")
            .in("id", productIds);

          if (productsData) {
            const productMap: Record<string, Product> = {};
            productsData.forEach(p => { productMap[p.id] = p; });
            setProducts(productMap);
          }
        }
      }
      setLoading(false);
    };
    fetchOrders();
    return () => { mounted = false; };
  }, [navigate]);

  const handleCompleteOrder = (orderId: string) => {
    navigate(`/checkout?orderId=${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to cancel order', variant: 'destructive' });
    } else {
      toast({ title: 'Order Cancelled', description: 'Your order has been cancelled.' });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    }
  };

  const getStatusBadge = (status: string | null) => {
    const config = statusConfig[status || "pending"] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {status === 'pending' ? <Clock className="w-3 h-3" /> :
          status === 'cancelled' || status === 'payment_failed' ? <XCircle className="w-3 h-3" /> :
            <CheckCircle2 className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string | null) => {
    const config = paymentConfig[paymentStatus || "pending"] || paymentConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {paymentStatus === 'pending' ? <Clock className="w-3 h-3" /> :
          paymentStatus === 'failed' ? <XCircle className="w-3 h-3" /> :
            <CheckCircle2 className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 font-sans">
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                className="mb-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
            </div>
          </div>

          {orders.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center border-accent/20 bg-card/40 backdrop-blur-md">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-muted-foreground text-sm mb-6">Looks like you haven't bought anything yet.</p>
              <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <Card
                  key={order.id}
                  className="overflow-hidden border border-accent/20 bg-card/40 backdrop-blur-sm transition-all hover:shadow-lg hover:border-accent/40"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                    {/* Order Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground">
                        {products[order.product_id]?.title || "Unknown Product"}
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.payment_status)}
                      </div>
                    </div>

                    {/* M-Pesa / Amount */}
                    <div className="flex flex-col items-start md:items-end gap-1 min-w-[120px]">
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Total</span>
                      <span className="text-lg font-bold text-primary">Ksh {order.amount.toLocaleString()}</span>
                      {order.mpesa_receipt && (
                        <span className="text-[10px] text-green-600 font-mono bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                          {order.mpesa_receipt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 sm:px-6 py-3 bg-muted/30 border-t border-accent/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {order.delivery_location && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                          {order.delivery_location}
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-background/50 hover:bg-background"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> Details
                      </Button>

                      {order.status === 'pending' && order.payment_status !== 'paid' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                            onClick={() => handleCompleteOrder(order.id)}
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Pay
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
