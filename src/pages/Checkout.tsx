import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import ShopNavbar from "@/components/ShopNavbar";
import ZtechPaystackButton from "@/components/PaystackButton";
import ZtechFlutterwaveButton from "@/components/FlutterwaveButton";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || "");
      setUserName(data?.user?.user_metadata?.full_name || "");
      setUserPhone(data?.user?.user_metadata?.phone || "");
    });
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Login Required", description: "Please log in to checkout.", duration: 1800 });
      navigate("/auth");
      return;
    }

    // Insert one order per cart item (single product per order for DB compatibility)
    const orderRows = cart.map(item => ({
      buyer_id: session.user.id,
      product_id: item.id,
      amount: item.price * item.quantity,
      status: "pending",
      payment_status: "unpaid",
    }));

    // Insert all orders at once
    const { error } = await supabase
      .from("orders")
      .insert(orderRows);

    if (error) {
      toast({ title: "Order Failed", description: "There was a problem placing your order.", duration: 2000 });
      return;
    }

    clearCart();
    toast({ title: "Order Placed!", description: "Thank you for your order.", duration: 2500 });
    navigate("/orders");
  };

  const handlePaystackSuccess = async (reference) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Login Required", description: "Please log in to checkout.", duration: 1800 });
      navigate("/auth");
      return;
    }
    // Call backend to verify payment and save to Supabase
    const res = await fetch("http://localhost:5001/verify-paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: reference.reference,
        email: session.user.email,
        amount: Math.round(total * 100), // Paystack expects kobo
      }),
    });
    const result = await res.json();
    if (result.verified && result.saved) {
      clearCart();
      toast({ title: "Payment Successful!", description: "Thank you for your order.", duration: 2500 });
      navigate("/orders");
    } else {
      toast({ title: "Payment Failed", description: result.message || "Could not verify payment.", duration: 2500 });
    }
  };

  const handleFlutterwaveSuccess = async (response) => {
    // Optionally verify on backend, then save to Supabase
    const res = await fetch("http://localhost:5001/verify-flutterwave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_id: response.transaction_id,
        email: userEmail,
        amount: total,
      }),
    });
    const result = await res.json();
    if (result.verified && result.saved) {
      clearCart();
      toast({ title: "Payment Successful!", description: "Thank you for your order.", duration: 2500 });
      navigate("/orders");
    } else {
      toast({ title: "Payment Failed", description: result.message || "Could not verify payment.", duration: 2500 });
    }
  };

  return (
    <>
      <ShopNavbar />
      <div className="max-w-3xl mx-auto py-10 px-3">
        <div className="mb-6">
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/')}
            className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 mb-4"
          >
             Go Back
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
        <Card className="p-6 space-y-4 mb-6">
          <ul>
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <div>{item.title} <span className="text-muted-foreground">x{item.quantity}</span></div>
                <div>Ksh {(item.price * item.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center border-t pt-4 mt-4 font-bold text-xl">
            <span>Total</span>
            <span>Ksh {total.toFixed(2)}</span>
          </div>
        </Card>
        <div className="flex gap-2">
          <ZtechPaystackButton
            email={userEmail || "customer@email.com"}
            amount={Math.round(total * 100)}
            onSuccess={handlePaystackSuccess}
          />
          <ZtechFlutterwaveButton
            email={userEmail}
            amount={total}
            phone={userPhone}
            name={userName}
            onSuccess={handleFlutterwaveSuccess}
          />
          <Button variant="secondary" onClick={() => navigate("/cart")}>Back to Cart</Button>
        </div>
        <div className="text-xs text-muted-foreground mt-5 text-center">
          Payments are simulated here. Stripe integration is coming next!
        </div>
      </div>
    </>
  );
}
