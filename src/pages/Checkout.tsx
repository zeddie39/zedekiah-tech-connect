
import { useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // If cart cleared (on browser reload), redirect to cart page
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    // 1. Save order to Supabase orders table with status=pending
    // 2. Receive back order id, and initiate payment (Stripe)
    // 3. For demo, we'll just save the order, and show order placed message
    // Real integration would redirect to Stripe

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Login Required", description: "Please log in to checkout.", duration: 1800 });
      navigate("/auth");
      return;
    }

    // Prepare items payload
    const items = cart.map(({ id, title, price, quantity }) => ({ product_id: id, title, price, quantity }));

    // Insert into Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .insert([{
        buyer_id: session.user.id,
        items,
        amount: total,
        status: "pending",
        payment_status: "unpaid"
      }])
      .select()
      .single();

    if (error || !order) {
      toast({ title: "Order Failed", description: "There was a problem placing your order.", duration: 2000 });
      return;
    }

    // TODO: Stripe integration here: call supabase.functions.invoke('create-payment', { ... }) etc.
    // For now, just show confirmation:
    clearCart();
    toast({ title: "Order Placed!", description: "Thank you for your order.", duration: 2500 });
    navigate("/orders");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-3">
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
      <Card className="p-6 space-y-4 mb-6">
        <ul>
          {cart.map(item => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <div>{item.title} <span className="text-muted-foreground">x{item.quantity}</span></div>
              <div>${(item.price * item.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center border-t pt-4 mt-4 font-bold text-xl">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </Card>
      <div className="flex gap-2">
        <Button onClick={handleCheckout} className="w-full">Pay & Place Order</Button>
        <Button variant="secondary" onClick={() => navigate("/cart")}>Back to Cart</Button>
      </div>
      <div className="text-xs text-muted-foreground mt-5 text-center">
        Payments are simulated here. Stripe integration is coming next!
      </div>
    </div>
  );
}
