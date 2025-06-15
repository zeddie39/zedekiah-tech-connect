
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronLeft, Star, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopNavbar from "@/components/ShopNavbar";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  status: string | null;
  category: string | null;
  owner_id: string;
};
type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  uploaded_at: string;
};

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

      // Fetch images
      const { data: imgs, error: imgErr } = await supabase
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

  return (
    <>
      <ShopNavbar />
      <div className="max-w-3xl mx-auto py-10 px-3">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3">
          <ChevronLeft size={18} className="mr-2" /> Back to Shop
        </Button>
        <Card className="p-0 flex flex-col md:flex-row gap-3">
          <div className="md:w-5/12 w-full flex flex-col gap-3 items-center justify-center min-h-[300px] bg-muted rounded-md p-3">
            {images.length > 0 ? (
              <img
                src={images[0].image_url}
                alt={product.title}
                className="w-full h-56 object-cover rounded-lg bg-gray-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-56 w-full bg-muted text-muted-foreground rounded-lg">
                <ImageIcon size={48} />
                <span className="mt-1 text-xs">No image available</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold">{product.title}</h1>
              {product.category && (
                <div className="inline-block px-2 py-1 rounded bg-secondary text-xs text-muted-foreground mb-2 w-fit">
                  {product.category}
                </div>
              )}
              <div className="text-primary text-2xl font-bold mb-2">${product.price.toFixed(2)}</div>
              <div className="text-muted-foreground">{product.description}</div>
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate("/cart")}>Add to Cart</Button>
            <div className="text-xs text-muted-foreground mt-1">
              Owner ID: {product.owner_id}
            </div>
          </div>
        </Card>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2 flex gap-2 items-center">
            <Star className="text-yellow-400" size={20} /> Product Reviews
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
