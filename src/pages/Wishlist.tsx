import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../types/supabase";
type Tables = Database['public']['Tables'];
type WishlistRow = Tables['user_wishlist']['Row'];
import { Card } from "@/components/ui/card";
import { Loader2, Image, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { toast } from "@/components/ui/use-toast";
import ShopNavbar from "@/components/ShopNavbar";
import type { Session, User } from "@supabase/supabase-js";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import ImagePreviewModal from "@/components/ImagePreviewModal";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  status: string | null;
  category: string | null;
  owner_id: string;
  avgRating?: number;
  reviewCount?: number;
  whatsapp_number?: string | null;
};

export default function Wishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState<string>("");

  // Add navigation and cart hooks
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_wishlist')
          .select('product_id')
          .eq('user_id', user.id) as { data: WishlistRow[] | null; error: any };
        if (!error && data) {
          const ids = data
            .filter((row): row is WishlistRow => Boolean(row?.product_id))
            .map(row => row.product_id);
          setWishlistIds(ids);
          if (ids.length > 0) {
            await fetchWishlistProducts(ids);
          }
        } else {
          setWishlistIds([]);
          setProducts([]);
        }
        setLoading(false);
      }
    };
    loadWishlist();
  }, [user]);

  // Fetch user info when we have session
  useEffect(() => {
    if (session) {
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    }
  }, [session]);

  // Check login state
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) {
        navigate("/auth?redirect=wishlist");
        return;
      }
      setSession(session);
    });

    // Listen for changes in auth state
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth?redirect=wishlist");
    });
    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const fetchWishlistProducts = async (ids: string[]) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .eq("status", "approved");

    if (error) {
      toast({
        title: "Error loading wishlist",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setProducts(data);

      // Fetch images
      const imagePromises = data.map(async (product) => {
        const { data: imgData } = await supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", product.id)
          .single();

        if (imgData?.image_url) {
          setImages(prev => ({
            ...prev,
            [product.id]: imgData.image_url
          }));
        }
      });

      await Promise.all(imagePromises);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (user) {
      let updatedIds: string[];
      if (wishlistIds.includes(productId)) {
        updatedIds = wishlistIds.filter(id => id !== productId);
        await supabase.from('user_wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
        setWishlistIds(updatedIds);
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast({ title: 'Removed from wishlist' });
      } else {
        updatedIds = [...wishlistIds, productId];
        await supabase.from('user_wishlist').insert({ user_id: user.id, product_id: productId });
        setWishlistIds(updatedIds);
        // Optionally fetch the product if not already in list
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product });
    toast({ title: 'Added to cart', description: product.title });
  };

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <ShopNavbar />
      <div className="container mx-auto px-2 sm:px-4 md:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <Button variant="outline" onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Your wishlist is empty.</p>
            <Button onClick={() => navigate("/shop")}>Browse Products</Button>
          </div>
        ) : (
          <div id="wishlist-products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group flex flex-col h-full p-3 rounded-2xl bg-card/90 border border-accent/30 transition-all duration-300 hover:shadow-lg hover:border-accent/60 hover:-translate-y-0.5"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="relative rounded-xl overflow-hidden bg-muted border border-accent/20">
                    <AspectRatio ratio={4 / 3}>
                      {images[product.id] ? (
                        <img
                          src={images[product.id]}
                          alt={product.title}
                          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </AspectRatio>
                    {product.status === 'pending' && (
                      <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/40 backdrop-blur">
                        Pending Approval
                      </span>
                    )}
                    {images[product.id] && (
                      <button
                        onClick={() => { setPreviewImg(images[product.id]); setPreviewAlt(product.title); }}
                        className="absolute top-2 right-2 text-[11px] px-2 py-1 rounded-full bg-accent text-primary border border-accent/30 shadow-sm hover:shadow"
                        title="Preview image"
                      >
                        Preview
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-semibold text-base sm:text-lg truncate" title={product.title}>{product.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-primary text-sm sm:text-base font-extrabold shadow-sm">
                        Ksh {product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2">{product.description}</div>
                    )}
                    {product.category && <Badge variant="secondary" className="w-fit text-[11px] border border-accent/30">{product.category}</Badge>}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <Button className="w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleWishlist(product.id)}
                    className="w-full border-accent/50 text-accent hover:bg-accent/10"
                  >
                    Remove from Wishlist
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ImagePreviewModal
        open={!!previewImg}
        onClose={() => setPreviewImg(null)}
        src={previewImg}
        alt={previewAlt}
      />
    </>
  );
}
