import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Image, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { toast } from "@/components/ui/use-toast";
import ShopNavbar from "@/components/ShopNavbar";
import ShopHeroCarousel from "@/components/ShopHeroCarousel";
import ShopCategories from "@/components/ShopCategories";
import { Badge } from "@/components/ui/badge";

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

export default function Shop() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Check login state and fetch products
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) {
        navigate("/auth");
        return;
      }
      setSession(session);
      setLoading(false);
    });

    // Listen for changes in auth state
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch all active products and their images
  useEffect(() => {
    if (!session) return;
    setLoading(true);
    async function fetchProducts() {
      // Only show approved products
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (!products || error) {
        setProducts([]);
        setImages({});
        setLoading(false);
        return;
      }
      setProducts(products);

      // Fetch first image for each product
      const ids = products.map((p: Product) => p.id);
      if (ids.length > 0) {
        const { data: imgs } = await supabase
          .from("product_images")
          .select("*")
          .in("product_id", ids);
        // Map first image for each product
        const imgMap: Record<string, string> = {};
        imgs?.forEach((img: ProductImage) => {
          if (!imgMap[img.product_id]) imgMap[img.product_id] = img.image_url;
        });
        setImages(imgMap);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [session]);

  // Filtered products by category
  const filteredProducts = categoryFilter
    ? products.filter((product) =>
        // Case-insensitive match, fallback to '' for missing category.
        (product.category || "").toLowerCase() === categoryFilter.toLowerCase()
      )
    : products;

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }
  if (!session && !loading) {
    navigate("/auth");
    return null;
  }

  function handleAddToCart(product: Product) {
    addToCart({ ...product });
    toast({ title: 'Added to cart', description: product.title });
  }

  return (
    <>
      <ShopNavbar />
      <ShopHeroCarousel />
      <div className="container mx-auto px-2 sm:px-4 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <ShopCategories selectedCategory={categoryFilter} onSelectCategory={setCategoryFilter} />
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">Go Back to Dashboard</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col h-full p-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-full h-40 sm:h-48 bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  {images[product.id] ? (
                    <img src={images[product.id]} alt={product.title} className="object-cover w-full h-full" />
                  ) : (
                    <Image className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-base sm:text-lg truncate" title={product.title}>{product.title}</h3>
                  <div className="text-accent font-bold text-lg">${product.price.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mb-1 truncate" title={product.description || ''}>{product.description}</div>
                  {product.category && <Badge className="w-fit text-xs mb-1">{product.category}</Badge>}
                </div>
              </div>
              <Button className="mt-2 w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
