import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import ShopNavbar from "@/components/ShopNavbar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, ArrowLeft, Phone } from "lucide-react";
import MpesaButton from "@/components/MpesaButton";
import PaymentStatusModal from "@/components/PaymentStatusModal";
import { validateAndFormatPhone } from "@/lib/phoneUtils";

// Kenyan cities and areas for suggestions
const kenyanLocations = [
  "Nairobi CBD",
  "Westlands, Nairobi",
  "Karen, Nairobi",
  "Kilimani, Nairobi",
  "Langata, Nairobi",

  "Luthuli Avenue, Nairobi",
  "Tom Mboya Street, Nairobi",
  "River Road, Nairobi",

  "Moi Avenue, Nairobi",
  "Mama Ngina Street, Nairobi",
  "Wabera Street, Nairobi",
  "Mombasa - Mombasa Island",
  "Mombasa - Nyali",
  "Mombasa - Kilifi",
  "Mombasa - Likoni",
  "Kisumu City",
  "Kisumu - Manyatta",
  "Kisumu - Milimani",
  "Nakuru Town",
  "Nakuru - Section 58",
  "Nakuru - Afraha",
  "Nakuru - Pipeline",
  "Eldoret City",
  "Eldoret - Uasin Gishu",
  "Thika Town",
  "Thika - Makongeni",
  "Muranga Town",
  "Nyeri Town",
  "Nyeri - Posta",

  "Gigiri, Nairobi",
  "Mombasa Road, Nairobi",
  "Outering Road, Nairobi",
  "Jogoo Road, Nairobi",
  "Limuru Road, Nairobi",
  "Ngong Road, Nairobi",
  "Kiambu Road, Nairobi",
  "Waiyaki Way, Nairobi"
];

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [currentCart, setCurrentCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [loading, setLoading] = useState(!!orderId);
  const [open, setOpen] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || "");
      setUserName(data?.user?.user_metadata?.full_name || "");
      setUserPhone(data?.user?.user_metadata?.phone || "");
    });
  }, []);

  // Load order details if orderId is present
  useEffect(() => {
    if (orderId) {
      const loadOrder = async () => {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error || !orderData) {
          toast({ title: 'Error', description: 'Order not found', variant: 'destructive' });
          navigate('/orders');
          return;
        }

        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('title, price')
          .eq('id', orderData.product_id)
          .single();

        if (productError || !productData) {
          toast({ title: 'Error', description: 'Product not found', variant: 'destructive' });
          navigate('/orders');
          return;
        }

        const cartItem: CartItem = {
          id: orderData.product_id,
          title: productData.title,
          price: productData.price,
          quantity: 1, // Assuming quantity 1 for now
        };

        setCurrentCart([cartItem]);
        setTotal(orderData.amount);
        if (orderData.delivery_location) {
          setDeliveryLocation(orderData.delivery_location);
        }
        setLoading(false);
      };
      loadOrder();
    } else {
      // Normal cart checkout
      setCurrentCart(cart);
      setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
      if (cart.length === 0) {
        navigate("/cart");
      }
    }
  }, [orderId, cart, navigate]);

  const handlePaymentSuccess = async () => {
    if (orderId) {
      // Update existing order
      const { error } = await supabase
        .from('orders')
        .update({
          delivery_location: deliveryLocation || null,
          status: 'completed',
          payment_status: 'paid'
        })
        .eq('id', orderId);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
        return;
      }
      toast({ title: "Order Completed!", description: "Your order has been paid and will be delivered.", duration: 2500 });
    } else {
      // New order placement
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const orderRows = currentCart.map(item => ({
        buyer_id: session.user.id,
        product_id: item.id,
        amount: item.price * item.quantity,
        delivery_location: deliveryLocation || null,
        status: "completed",
        payment_status: "paid",
      }));

      const { error } = await supabase.from("orders").insert(orderRows);

      if (error) {
        toast({ title: "Order Failed", description: "There was a problem placing your order.", duration: 2000 });
        return;
      }

      clearCart();
      toast({ title: "Order Placed!", description: "Thank you for your order.", duration: 2500 });
    }
    navigate("/orders");
  };

  const handleMpesaSuccess = (data: { CheckoutRequestID: string }) => {
    setCheckoutRequestId(data.CheckoutRequestID);
    setShowPaymentModal(true);
  };

  const handlePaymentModalSuccess = (receipt: string) => {
    setShowPaymentModal(false);
    handlePaymentSuccess();
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setCheckoutRequestId(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <ShopNavbar />
      <div className="max-w-3xl mx-auto py-10 px-3">
        <div className="mb-6">
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign(orderId ? '/orders' : '/')}
            className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">{orderId ? "Complete Order" : "Order Summary"}</h1>
        <Card className="p-6 space-y-4 mb-6">
          <ul>
            {currentCart.map(item => (
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

        <Card className="p-6 space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Delivery Information</h2>
          <div>
            <Label htmlFor="deliveryLocation">Delivery Location</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between text-left font-normal"
                >
                  {deliveryLocation || "Select delivery location..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search location..."
                    value={deliveryLocation}
                    onValueChange={(value) => {
                      setDeliveryLocation(value);
                      setOpen(true);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {kenyanLocations
                        .filter((location) =>
                          location.toLowerCase().includes(deliveryLocation.toLowerCase())
                        )
                        .map((location) => (
                          <CommandItem
                            key={location}
                            value={location}
                            onSelect={(currentValue) => {
                              setDeliveryLocation(currentValue === deliveryLocation ? "" : currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${deliveryLocation === location ? "opacity-100" : "opacity-0"
                                }`}
                            />
                            {location}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </Card>

        <Card className="p-6 space-y-4 mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            M-Pesa Payment
          </h2>
          <div>
            <Label htmlFor="mpesaPhone">M-Pesa Phone Number *</Label>
            <Input
              id="mpesaPhone"
              type="tel"
              placeholder="0712 345 678"
              value={mpesaPhone}
              onChange={(e) => {
                const value = e.target.value;
                setMpesaPhone(value);
                if (value.length >= 10) {
                  const result = validateAndFormatPhone(value);
                  if (result.isValid) {
                    setFormattedPhone(result.formatted);
                    setPhoneError("");
                  } else {
                    setFormattedPhone("");
                    setPhoneError(result.error || "Invalid phone number");
                  }
                } else {
                  setFormattedPhone("");
                  setPhoneError("");
                }
              }}
              className={`mt-1 ${phoneError ? 'border-red-500' : formattedPhone ? 'border-green-500' : ''}`}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
            {formattedPhone && !phoneError && (
              <p className="text-green-600 text-sm mt-1">✓ Valid Safaricom number</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">
              Enter the Safaricom number that will receive the M-Pesa prompt
            </p>
          </div>
        </Card>
        <div className="flex flex-col gap-4 md:flex-row md:gap-2 items-center justify-center mt-4">
          <MpesaButton
            amount={total}
            phone={formattedPhone || userPhone}
            name={userName}
            onSuccess={handleMpesaSuccess}
            disabled={!formattedPhone && !userPhone}
          />
          {!orderId && <Button variant="secondary" onClick={() => navigate("/cart")}>Back to Cart</Button>}
          {orderId && <Button variant="secondary" onClick={() => navigate("/orders")}>Cancel</Button>}
        </div>
        <div className="text-xs text-muted-foreground mt-5 text-center">
          <span className="text-green-600 font-bold">Secure payments via M-Pesa (Safaricom Daraja API)</span>
        </div>

        <PaymentStatusModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          checkoutRequestId={checkoutRequestId}
          amount={total}
          onSuccess={handlePaymentModalSuccess}
          onFailure={(error) => {
            toast({ title: "Payment Failed", description: error, variant: "destructive" });
          }}
        />
      </div>
    </>
  );
}
