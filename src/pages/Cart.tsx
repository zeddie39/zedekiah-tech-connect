import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "@/components/ShopNavbar";
import { ShoppingBag, ArrowRight, LogOut } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <ShopNavbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 font-sans">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <Card className="border border-accent/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-primary/5 to-transparent border-b border-accent/10">
              <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
              <p className="text-muted-foreground mt-1">Review your items before checkout.</p>
            </div>

            <div className="p-6 sm:p-8">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                    <ShoppingBag className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">It's a bit empty here</h3>
                  <p className="text-muted-foreground mb-8">Start adding some premium tech to your cart.</p>
                  <Button onClick={() => navigate("/shop")} className="shadow-lg shadow-primary/20">
                    <ArrowRight className="w-4 h-4 mr-2" /> Browse Shop
                  </Button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); navigate("/checkout"); }}>
                  <div className="space-y-6 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-background/50 border border-accent/10 hover:border-accent/30 transition-colors">
                        <div className="relative shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                          ) : (
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                              <ShoppingBag className="w-8 h-8 opacity-20" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-center sm:text-left w-full">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-primary font-bold">Ksh {item.price.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center gap-2 bg-background border border-accent/20 rounded-lg p-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <LogOut className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-accent/10">
                    <div className="text-2xl font-bold">
                      <span className="text-muted-foreground text-lg font-medium mr-2">Total:</span>
                      Ksh {total.toLocaleString()}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button variant="outline" type="button" onClick={() => navigate("/shop")} className="flex-1 sm:flex-none">
                        Continue Shopping
                      </Button>
                      <Button type="submit" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
