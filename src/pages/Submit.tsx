import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ShopNavbar from "@/components/ShopNavbar";
import { Loader2, Package, Wrench, ArrowLeft, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const orderSchema = z.object({
  productTitle: z.string().trim().min(2, "Product name required").max(120),
  amount: z.coerce.number().positive("Amount must be greater than 0").max(10_000_000),
  deliveryLocation: z.string().trim().min(2, "Delivery location required").max(200),
  notes: z.string().trim().max(500).optional(),
});

const repairSchema = z.object({
  deviceType: z.string().trim().min(2, "Device required").max(120),
  problem: z.string().trim().min(10, "Please describe the issue (min 10 chars)").max(2000),
});

export default function SubmitPage() {
  const [tab, setTab] = useState<"order" | "repair">("order");
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  const [productTitle, setProductTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [deviceType, setDeviceType] = useState("");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth?redirect=/submit");
        return;
      }
      setUserId(session.user.id);
      setCheckingAuth(false);
    });
  }, [navigate]);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const parsed = orderSchema.safeParse({ productTitle, amount, deliveryLocation, notes });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);

    // Create a lightweight product record then order — keeps schema aligned.
    const { data: prod, error: prodErr } = await supabase
      .from("products")
      .insert({
        title: parsed.data.productTitle,
        description: parsed.data.notes || `Customer request: ${parsed.data.productTitle}`,
        price: parsed.data.amount,
        seller_id: userId,
        status: "pending_admin",
        category: "custom_request",
      })
      .select("id")
      .single();

    if (prodErr || !prod) {
      setSubmitting(false);
      toast({ title: "Could not create request", description: prodErr?.message ?? "Please try again", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("orders").insert({
      buyer_id: userId,
      product_id: prod.id,
      amount: parsed.data.amount,
      status: "pending",
      payment_status: "pending",
      delivery_location: parsed.data.deliveryLocation,
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit order", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Order submitted", description: "Track it live on your Track page." });
    setProductTitle(""); setAmount(""); setDeliveryLocation(""); setNotes("");
    navigate("/track");
  }

  async function submitRepair(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const parsed = repairSchema.safeParse({ deviceType, problem });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("repair_requests").insert({
      user_id: userId,
      device_type: parsed.data.deviceType,
      problem_description: parsed.data.problem,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Repair inquiry submitted", description: "We'll get back to you shortly." });
    setDeviceType(""); setProblem("");
    navigate("/track");
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ShopNavbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent text-muted-foreground" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <h1 className="text-3xl font-bold tracking-tight mb-1">Submit a Request</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Place a custom order or book a repair. You'll see live status on the Track page.
          </p>

          <div className="flex gap-2 mb-6">
            <Button variant={tab === "order" ? "default" : "outline"} size="sm" onClick={() => setTab("order")}>
              <Package className="w-4 h-4 mr-2" /> Custom Order
            </Button>
            <Button variant={tab === "repair" ? "default" : "outline"} size="sm" onClick={() => setTab("repair")}>
              <Wrench className="w-4 h-4 mr-2" /> Repair Inquiry
            </Button>
          </div>

          {tab === "order" ? (
            <Card className="p-6 border-accent/20 bg-card/40 backdrop-blur">
              <form onSubmit={submitOrder} className="space-y-4">
                <div>
                  <Label htmlFor="pt">Product / Item</Label>
                  <Input id="pt" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder="e.g. HP EliteBook 840 G8" maxLength={120} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amt">Expected Budget (Ksh)</Label>
                    <Input id="amt" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="45000" required />
                  </div>
                  <div>
                    <Label htmlFor="loc">Delivery Location</Label>
                    <Input id="loc" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Nairobi CBD" maxLength={200} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Specs, color, quantity…" maxLength={500} rows={3} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Submit Order Request
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-6 border-accent/20 bg-card/40 backdrop-blur">
              <form onSubmit={submitRepair} className="space-y-4">
                <div>
                  <Label htmlFor="dev">Device Type</Label>
                  <Input id="dev" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} placeholder="e.g. iPhone 13, HP Pavilion" maxLength={120} required />
                </div>
                <div>
                  <Label htmlFor="prob">Problem Description</Label>
                  <Textarea id="prob" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Describe the issue in detail…" maxLength={2000} rows={5} required />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Submit Repair Inquiry
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
