import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "@/components/ShopNavbar";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <ShopNavbar />
      <div className="max-w-3xl mx-auto py-10 px-3">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 text-lg">
            Your cart is empty.
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); navigate("/checkout"); }}>
            <ul className="space-y-4 mb-6">
              {cart.map(item => (
                <Card key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded bg-gray-100" />
                    )}
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-primary">Ksh {item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className="w-16"
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                    />
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-6 font-bold text-xl">
              <span>Total:</span>
              <span>Ksh {total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="w-full">Checkout</Button>
              <Button variant="secondary" type="button" onClick={() => navigate("/shop")}>Back to Shop</Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
