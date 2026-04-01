 import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronLeft, Star, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopNavbar from "@/components/ShopNavbar";
import { formatPhoneForWhatsapp } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

import type { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    async function fetchProduct() {
      const { data: prod, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !prod) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(prod);
      const { data: imgs } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id);
      setImages(imgs || []);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <ShopNavbar />
        <div className="max-w-xl mx-auto py-16 px-4 text-center">
          <div className="text-2xl font-bold mb-2">Product not found</div>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2" size={16} />
            Back
          </Button>
        </div>
      </>
    );
  }

  const businessWhatsApp = "+254757756763";
  const primaryImageUrl = images.length > 0 ? images[0].image_url : undefined;
  const originalPrice = (product as any).original_price as number | null;
  const hasDiscount = originalPrice && originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  return (
    <>
      <ShopNavbar />
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-2 sm:px-3">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3">
          <ChevronLeft size={18} className="mr-2" /> Back to Shop
        </Button>
        <Card className="p-0 flex flex-col md:flex-row gap-2 sm:gap-3">
          <div className="md:w-5/12 w-full flex flex-col gap-2 sm:gap-3 items-center justify-center min-h-[220px] sm:min-h-[300px] bg-muted rounded-md p-2 sm:p-3 relative">
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                -{discountPercent}% OFF
              </div>
            )}
            {images.length > 0 ? (
              <img
                src={images[0].image_url}
                alt={product.title}
                className="w-full h-40 sm:h-56 object-cover rounded-lg bg-muted"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-40 sm:h-56 w-full bg-muted text-muted-foreground rounded-lg">
                <ImageIcon size={40} />
                <span className="mt-1 text-xs">No image available</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-3 sm:p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg sm:text-2xl font-extrabold">{product.title}</h1>
              {product.category && (
                <div className="inline-block px-2 py-1 rounded bg-secondary text-xs text-muted-foreground mb-2 w-fit">
                  {product.category}
                </div>
              )}
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <span className="text-primary text-lg sm:text-2xl font-bold">Ksh {product.price.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-muted-foreground line-through text-sm sm:text-base">
                      Ksh {originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Save Ksh {(originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <div className="text-muted-foreground text-xs sm:text-base">{product.description}</div>
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate("/cart")}>Add to Cart</Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                const targetNumber = product.whatsapp_number || businessWhatsApp;
                const message = `I am interested in this product, can we chat?\n\n${product.title}\nPrice: KSh ${product.price.toFixed(2)}`;
                const url = formatPhoneForWhatsapp(targetNumber, message, primaryImageUrl);
                if (!url) {
                  toast({ title: 'Invalid WhatsApp number', description: 'No valid WhatsApp number was provided.', variant: 'destructive' });
                  return;
                }
                window.open(url, '_blank');
              }}
            >
              Chat on WhatsApp
            </Button>
          </div>
        </Card>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2 flex gap-2 items-center">
            <Star className="text-amber-400" size={20} /> Product Reviews
          </h2>
          <div className="text-muted-foreground">Reviews coming soon...</div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Related Products</h2>
          <div className="text-muted-foreground">Related products will be shown here in a future update.</div>
        </div>
      </div>
    </>
  );
}
