import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../types/supabase";
type Tables = Database['public']['Tables'];
type WishlistRow = Tables['user_wishlist']['Row'];
import { Card } from "@/components/ui/card";
import { Loader2, Image, Star, Clock, Eye } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Wishlist</h1>
              <p className="text-muted-foreground mt-1">Save items for later.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/shop")} className="border-accent/50 hover:bg-accent/10">Back to Shop</Button>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-accent/20 rounded-3xl bg-card/30">
              <div className="p-4 bg-accent/10 rounded-full mb-4">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <p className="text-lg font-medium">Your wishlist is empty</p>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">Browse our collection and find something you love.</p>
              <Button onClick={() => navigate("/shop")}>Explore Products</Button>
            </div>
          ) : (
            <div id="wishlist-products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group flex flex-col h-full bg-card/40 backdrop-blur-sm border border-accent/20 rounded-2xl overflow-hidden hover:shadow-xl hover:border-accent/50 transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {images[product.id] ? (
                      <img
                        src={images[product.id]}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="rounded-full h-9 w-9 p-0" onClick={() => { setPreviewImg(images[product.id]); setPreviewAlt(product.title); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {product.status === 'pending' && (
                      <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-md bg-background/80 backdrop-blur font-medium">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                      <Badge variant="outline" className="border-accent/40 bg-accent/5 text-primary shrink-0">
                        Ksh {product.price.toLocaleString()}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {product.description || "No description available."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Button
                        variant="default"
                        className="w-full bg-primary/90 hover:bg-primary shadow-sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => toggleWishlist(product.id)}
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
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
