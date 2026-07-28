import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Printer, CheckCircle2 } from "lucide-react";
import ShopNavbar from "@/components/ShopNavbar";

type InvoiceOrder = {
  id: string;
  created_at: string;
  amount: number;
  status: string | null;
  payment_status: string | null;
  delivery_location: string | null;
  mpesa_receipt: string | null;
  buyer_id: string;
  order_items?: {
    quantity: number;
    price_at_time: number;
    products: { id: string; title: string };
  }[];
};

export default function InvoicePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<InvoiceOrder | null>(null);
  const [buyerEmail, setBuyerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data } = await supabase
        .from("orders")
        .select(`*, order_items ( quantity, price_at_time, products ( id, title ) )`)
        .eq("id", orderId)
        .single();

      if (!data) { navigate("/orders"); return; }
      setOrder(data as unknown as InvoiceOrder);

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", (data as any).buyer_id)
        .maybeSingle();
      if (profile) setBuyerEmail(profile.email ?? profile.full_name ?? null);

      setLoading(false);
    })();
  }, [orderId, navigate]);

  if (loading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const subtotal = order.order_items?.reduce((s, i) => s + i.price_at_time * i.quantity, 0) ?? order.amount;
  const paid = order.payment_status === "paid";

  return (
    <>
      <div className="print:hidden">
        <ShopNavbar />
      </div>
      <div className="max-w-3xl mx-auto py-8 px-4 print:py-4">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="ghost" onClick={() => navigate(`/orders/${order.id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Order
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-lg print:shadow-none print:border-none">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">INVOICE</h1>
              <p className="text-muted-foreground text-sm mt-1">Ztech Electronics Limited</p>
              <p className="text-xs text-muted-foreground">Service Beyond the Obvious</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Invoice #</p>
              <p className="font-mono font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Issued: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-border">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Billed To</p>
              <p className="font-semibold">{buyerEmail || "Customer"}</p>
              {order.delivery_location && (
                <p className="text-sm text-muted-foreground mt-1">{order.delivery_location}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Status</p>
              {paid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/30 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> PAID
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-700 border border-yellow-500/30 text-sm font-semibold">
                  {order.payment_status || "pending"}
                </span>
              )}
              {order.mpesa_receipt && (
                <p className="text-xs text-muted-foreground mt-2">M-Pesa: <span className="font-mono">{order.mpesa_receipt}</span></p>
              )}
            </div>
          </div>

          <table className="w-full my-6 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.order_items ?? []).map((it, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3">{it.products?.title || "Item"}</td>
                  <td className="py-3 text-center">{it.quantity}</td>
                  <td className="py-3 text-right">Ksh {it.price_at_time.toLocaleString()}</td>
                  <td className="py-3 text-right font-semibold">
                    Ksh {(it.price_at_time * it.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>—</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Ksh {order.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            Thank you for choosing Ztech Electronics Limited. For support, reply to your order confirmation email.
          </div>
        </div>
      </div>
    </>
  );
}
