import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/components/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Eye, X } from "lucide-react";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onOpenChange(false);
    navigate("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background/95 backdrop-blur-md border-l border-border/40 shadow-2xl">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border/40">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Cart
            {cartCount > 0 && (
              <span className="ml-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/60 shadow-inner">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-[240px] mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <SheetClose asChild>
                <Button className="w-fit" variant="outline">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="px-6 py-4 space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/10 transition-all duration-300 group shadow-sm hover:shadow-md items-center justify-between"
                  >
                    {/* 1. Thumbnail - clickable to product page */}
                    <Link 
                      to={`/shop/${item.id}`} 
                      onClick={() => onOpenChange(false)}
                      className="relative h-16 w-16 rounded-lg overflow-hidden border border-border/50 bg-muted flex-shrink-0 hover:ring-2 hover:ring-primary/30 transition-all"
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground/40 bg-muted">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </Link>

                    {/* 2. Item Details (Title, Price, View details link, Quantity) */}
                    <div className="flex-1 min-w-0">
                      <div className="space-y-0.5">
                        {/* Clickable title - links to full product description */}
                        <Link 
                          to={`/shop/${item.id}`} 
                          onClick={() => onOpenChange(false)}
                          className="font-semibold text-sm leading-tight text-foreground truncate block hover:text-primary transition-colors hover:underline"
                          title={`View details: ${item.title}`}
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm font-bold text-primary">
                          Ksh {item.price.toLocaleString()}
                        </p>
                        {/* View details link */}
                        <Link
                          to={`/shop/${item.id}`}
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Eye size={12} />
                          View details
                        </Link>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center mt-1.5">
                        <div className="flex items-center border border-border/60 rounded-lg bg-background p-0.5 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3. Delete Button - circular red trash button on the far right */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 border border-red-100 transition-colors flex-shrink-0"
                      aria-label={`Remove ${item.title} from cart`}
                      title="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-border/40 bg-muted/30 space-y-4">
            <div className="flex justify-between items-center text-base">
              <span className="font-medium text-muted-foreground">Subtotal</span>
              <span className="font-bold text-lg text-primary">
                Ksh {cartTotal.toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleViewCart}
                className="w-full"
              >
                View Full Cart
              </Button>
              <Button 
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 group shadow-lg shadow-primary/10"
              >
                Checkout 
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
