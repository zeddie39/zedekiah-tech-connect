import { useSavedItems } from "@/components/SavedItemsContext";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "@/components/ShopNavbar";
import { Heart, ArrowRight, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SavedItems() {
  const { savedItems, removeFromSavedItems } = useSavedItems();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (item: any) => {
    addToCart({ id: item.id, title: item.title, price: item.price, image: item.image });
    removeFromSavedItems(item.id);
    toast({ title: "Moved to cart", description: `${item.title} has been moved to your cart.` });
  };

  return (
    <>
      <ShopNavbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 font-sans">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <Card className="border border-accent/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-primary/5 to-transparent border-b border-accent/10">
              <h1 className="text-3xl font-bold tracking-tight">Saved for Later</h1>
              <p className="text-muted-foreground mt-1">Items you've saved to buy later.</p>
            </div>

            <div className="p-6 sm:p-8">
              {savedItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                    <Heart className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No saved items</h3>
                  <p className="text-muted-foreground mb-8">When you save items from your cart, they will appear here.</p>
                  <Button onClick={() => navigate("/shop")} className="shadow-lg shadow-primary/20">
                    <ArrowRight className="w-4 h-4 mr-2" /> Browse Shop
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedItems.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-background/50 border border-accent/10 hover:border-accent/30 transition-colors">
                      <div className="relative shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                        ) : (
                          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                            <Heart className="w-8 h-8 opacity-20" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center sm:text-left w-full">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-primary font-bold">Ksh {item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 hover:bg-primary/10"
                          onClick={() => handleMoveToCart(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" /> Move to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeFromSavedItems(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
