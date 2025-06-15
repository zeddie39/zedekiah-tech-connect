import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { toast } from "@/components/ui/use-toast";

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }
  if (!session) return null;

  function handleAddToCart(product: Product) {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: images[product.id] || null,
    });
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
      duration: 1800,
    });
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-3">
      <div className="flex justify-between items-center mb-8 mt-2">
        <h1 className="text-3xl font-bold">Shop</h1>
        <Button onClick={() => navigate("/shop/new")}>Add Product</Button>
      </div>
      {products.length === 0 ? (
        <div className="text-center text-muted-foreground text-lg mt-20">
          No products listed yet. Be the first to post!
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
          {products.map(product => (
            <li key={product.id}>
              <Card className="group p-0 overflow-hidden hover:shadow-lg transition-shadow duration-150 border cursor-pointer flex flex-col"
                onClick={e => {
                  // Only navigate on card click, not button
                  if ((e.target as HTMLElement).tagName === "BUTTON") return;
                  navigate(`/shop/${product.id}`);
                }}
              >
                {images[product.id] ? (
                  <img
                    src={images[product.id]}
                    alt={product.title}
                    className="w-full object-cover h-44 bg-gray-100"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-muted h-44 w-full">
                    <Image size={48} className="text-gray-300" />
                  </div>
                )}
                <div className="p-4 space-y-2 grow">
                  <h3 className="text-lg font-bold">{product.title}</h3>
                  <div className="font-medium text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {product.description}
                  </div>
                  <div className="text-xs text-gray-400">{product.category}</div>
                </div>
                <div className="p-4 pt-2 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={e => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
