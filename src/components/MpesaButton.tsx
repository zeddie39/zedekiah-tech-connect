import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FaMoneyBillWave } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";

interface MpesaButtonProps {
  amount: number;
  phone: string;
  name?: string;
  onSuccess?: (data: { CheckoutRequestID: string; MerchantRequestID: string }) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

interface MpesaResponse {
  ResponseCode?: string;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  CustomerMessage?: string;
  errorMessage?: string;
  error?: string;
}

export default function MpesaButton({
  amount,
  phone,
  name,
  onSuccess,
  onError,
  disabled = false
}: MpesaButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleMpesaPay = async () => {
    if (!phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your M-Pesa phone number.",
        variant: "destructive",
      });
      return;
    }

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
      // Format phone number to start with 254
      let formattedPhone = phone.trim().replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('254')) {
        // Assume 254 if not 0 or +
        formattedPhone = '254' + formattedPhone;
      }

      console.log(`Formatted phone: ${formattedPhone} from ${phone}`);

      // Get the current session to include auth token
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

      const { data, error } = await supabase.functions.invoke('mpesa-stk', {
        body: {
          amount: Math.round(amount),
          phone: formattedPhone,
          accountReference: name || "ZtechShop",
          transactionDesc: "Shop Payment",
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to initiate payment");
      }

      const responseData: MpesaResponse = data;

      if (data.ResponseCode === "0") {
        toast({
          title: "M-Pesa Prompt Sent!",
          description: data.CustomerMessage || "Check your phone to complete the payment.",
          duration: 5000,
        });
        if (onSuccess && data.CheckoutRequestID) {
          onSuccess({
            CheckoutRequestID: data.CheckoutRequestID,
            MerchantRequestID: data.MerchantRequestID || "",
          });
        }
      } else {
        const errorMsg = data.errorMessage || data.error || "Could not initiate payment.";
        toast({
          title: "M-Pesa Error",
          description: errorMsg,
          variant: "destructive",
        });
        if (onError) onError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error. Please try again.";
      toast({
        title: "M-Pesa Error",
        description: errorMsg,
        variant: "destructive",
      });
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMpesaPay}
      disabled={loading || disabled}
      className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg border-2 border-green-400 transition-all duration-200"
      style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px' }}
    >
      <FaMoneyBillWave size={22} className="text-white" />
      {loading ? "Processing..." : `Pay Ksh ${amount.toLocaleString()} with M-Pesa`}
    </Button>
  );
}

