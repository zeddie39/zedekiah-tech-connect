import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FaMoneyBillWave } from "react-icons/fa";

export default function MpesaButton({ amount, phone, name, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleMpesaPay = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5002/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phone,
          accountReference: name || "ZtechShop",
          transactionDesc: "Shop Payment",
        }),
      });
      const data = await res.json();
      if (data.ResponseCode === "0") {
        toast({
          title: "M-Pesa Prompt Sent!",
          description: "Check your phone to complete the payment.",
          duration: 4000,
        });
        if (onSuccess) onSuccess(data);
      } else {
        toast({
          title: "M-Pesa Error",
          description: data.errorMessage || data.error || "Could not initiate payment.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "M-Pesa Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMpesaPay}
      disabled={loading}
      className="bg-primary hover:bg-accent text-white font-bold flex items-center gap-2 px-4 py-2 rounded-lg shadow-md border-2 border-accent animate-pulse"
      style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '1px', boxShadow: '0 2px 8px #ff980055' }}
    >
      <FaMoneyBillWave size={22} className="text-accent drop-shadow" />
      {loading ? "Processing..." : "Pay with M-Pesa"}
    </Button>
  );
}
