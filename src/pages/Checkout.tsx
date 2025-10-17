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
import { Check, ChevronsUpDown } from "lucide-react";

// Paystack and Flutterwave imports removed
import MpesaButton from "@/components/MpesaButton";

// Kenyan cities and areas for suggestions
const kenyanLocations = [
  "Nairobi CBD",
  "Westlands, Nairobi",
  "Karen, Nairobi",
  "Kilimani, Nairobi",
  "Langata, Nairobi",
  "Koinange Street, Nairobi",
  "Luthuli Avenue, Nairobi",
  "Tom Mboya Street, Nairobi",
  "River Road, Nairobi",
  "Koinange Street, Nairobi",
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
  "Karen, Nairobi",
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
            className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 mb-4"
          >
             Go Back
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
                              className={`mr-2 h-4 w-4 ${
                                deliveryLocation === location ? "opacity-100" : "opacity-0"
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
        <div className="flex flex-col gap-4 md:flex-row md:gap-2 items-center justify-center mt-4">
          <MpesaButton
            amount={total}
            phone={userPhone}
            name={userName}
            onSuccess={handlePaymentSuccess}
          />
          {!orderId && <Button variant="secondary" onClick={() => navigate("/cart")}>Back to Cart</Button>}
          {orderId && <Button variant="secondary" onClick={() => navigate("/orders")}>Cancel</Button>}
        </div>
        <div className="text-xs text-muted-foreground mt-5 text-center">
          Payments are simulated here. Stripe integration is coming next!<br/>
          <span className="text-green-600 font-bold">Now accepting M-Pesa via Daraja API!</span>
        </div>
      </div>
    </>
  );
}
