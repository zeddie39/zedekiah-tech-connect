import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";

interface StripeButtonProps {
  amount: number;
  cart: { id: string; title: string; price: number; quantity: number }[];
  deliveryLocation: string;
  orderId?: string | null;
  disabled?: boolean;
}

export default function StripeButton({
  amount,
  cart,
  deliveryLocation,
  orderId,
  disabled = false
}: StripeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleStripePay = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make a payment.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 1. Generate a checkout request ID
      const checkoutRequestId = crypto.randomUUID();

      // 2. If order doesn't exist, create it as pending
      if (!orderId) {
        // 1. Create the unified order record
        const { data: newOrder, error: orderError } = await supabase.from("orders").insert({
          buyer_id: session.user.id,
          amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          delivery_location: deliveryLocation || null,
          status: "pending",
          payment_status: "pending",
          checkout_request_id: checkoutRequestId
        }).select().single();

        if (orderError || !newOrder) {
          throw new Error("Failed to initialize order record");
        }

        // 2. Insert the order items
        const orderItems = cart.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) {
          throw new Error("Failed to initialize order items");
        }
      } else {
        // Update existing order with the new checkout ID
        const { error: updateError } = await supabase
          .from('orders')
          .update({ checkout_request_id: checkoutRequestId })
          .eq('id', orderId);
          
        if (updateError) {
          throw new Error("Failed to update order record");
        }
      }

      // 3. Call Stripe Edge Function to create Checkout Session
      const returnUrl = `${window.location.origin}/orders`;
      
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          cart,
          checkoutRequestId,
          returnUrl
        },
      });

      if (error) {
        console.error("Stripe invoke error:", error);
        let errMsg = error.message || "Failed to initiate Stripe payment";
        if (error.context && error.context.error) {
          errMsg = error.context.error;
        }
        throw new Error(errMsg);
      }

      // 4. Redirect to Stripe Checkout URL
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid response from Stripe server");
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error. Please try again.";
      toast({
        title: "Stripe Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStripePay}
      disabled={loading || disabled}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg border-2 border-indigo-400 transition-all duration-200"
      style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px' }}
    >
      <CreditCard size={22} className="text-white" />
      {loading ? "Processing..." : `Pay Ksh ${amount.toLocaleString()} with Card`}
    </Button>
  );
}
