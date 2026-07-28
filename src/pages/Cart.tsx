import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "@/components/ShopNavbar";
import { ShoppingBag, ArrowRight, Trash2, Heart } from "lucide-react";
import { useSavedItems } from "@/components/SavedItemsContext";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { addToSavedItems } = useSavedItems();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasUnavailableItems = cart.some(item => item.isAvailable === false);

  const handleSaveForLater = () => {
    if (itemToRemove) {
      addToSavedItems({
        id: itemToRemove.id,
        title: itemToRemove.title,
        price: itemToRemove.price,
        image: itemToRemove.image
      });
      removeFromCart(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setItemToRemove(null);
    }
  };

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
                          <h3 className={`font-semibold text-lg ${item.isAvailable === false ? 'opacity-50' : ''}`}>{item.title}</h3>
                          {item.isAvailable === false ? (
                            <span className="inline-block mt-1 text-xs font-bold text-destructive bg-destructive/10 px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          ) : (
                            <p className="text-primary font-bold">Ksh {item.price.toLocaleString()}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center gap-2 bg-background border border-accent/20 rounded-lg p-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1 || item.isAvailable === false}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.isAvailable === false}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setItemToRemove(item)}
                          >
                            <Trash2 className="w-5 h-5" />
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
                      <Button type="submit" disabled={hasUnavailableItems} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        {hasUnavailableItems ? "Remove unavailable items" : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from cart</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to save <strong>{itemToRemove?.title}</strong> for later instead of removing it completely?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setItemToRemove(null)}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleConfirmRemove} className="gap-2">
              <Trash2 size={16} /> Remove Completely
            </Button>
            <Button variant="default" onClick={handleSaveForLater} className="gap-2 bg-primary">
              <Heart size={16} /> Save for Later
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
