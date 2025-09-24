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
import ImagePreviewModal from "@/components/ImagePreviewModal";
import type { Session, User } from "@supabase/supabase-js";

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
};

type ProductReview = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export default function Shop() {
  // State declarations
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'title'>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState<string>("");
  const [reviews, setReviews] = useState<Record<string, ProductReview[]>>({});
  const [reviewInputs, setReviewInputs] = useState<Record<string, { rating: number; comment: string }>>({});
  const [reviewSubmitting, setReviewSubmitting] = useState<Record<string, boolean>>({});
  // Add navigation and cart hooks
  // If you use react-router-dom, uncomment the next line:
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Load wishlist from Supabase or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        // Fetch from Supabase user_profile table (or similar)
        // @ts-ignore: ignore missing type until types are regenerated
        const { data, error } = await supabase
          .from('user_wishlist' as any)
          .select('product_id')
          .eq('user_id', user.id);
        if (!error && data) {
          const filteredWishlist = Array.isArray(data)
            ? data.filter((row: any) => row && typeof row.product_id === "string")
            : [];
          setWishlist(filteredWishlist.map((row: { product_id: string }) => row.product_id));
        } else {
          setWishlist([]);
        }
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('wishlist');
        setWishlist(stored ? JSON.parse(stored) : []);
      }
    };
    loadWishlist();
  }, [user]);

  // ...rest of the component code remains unchanged...

  // Toggle wishlist and persist
  const toggleWishlist = async (productId: string) => {
    if (user) {
      let updated: string[];
      if (wishlist.includes(productId)) {
        updated = wishlist.filter(id => id !== productId);
        // @ts-ignore: ignore missing type until types are regenerated
        await supabase.from('user_wishlist' as any).delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        updated = [...wishlist, productId];
        // @ts-ignore: ignore missing type until types are regenerated
        await supabase.from('user_wishlist' as any).insert({ user_id: user.id, product_id: productId });
      }
      setWishlist(updated);
    } else {
      setWishlist(prev => {
        const updated = prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId];
        localStorage.setItem('wishlist', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Check login state and fetch products
  // Fetch user info
  useEffect(() => {
    if (session) {
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    }
  }, [session]);

  // Fetch reviews for all products
  useEffect(() => {
    if (products.length === 0) return;
    const fetchReviews = async () => {
      const ids = products.map((p) => p.id);
      // @ts-ignore: ignore missing type until types are regenerated
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .select('*')
        .in('product_id', ids);
      if (!error && data) {
        const grouped: Record<string, ProductReview[]> = {};
        const filteredReviews = Array.isArray(data)
          ? data.filter((r: any) => r && typeof r.product_id === "string")
          : [];
        filteredReviews.forEach((r: ProductReview) => {
          if (!grouped[r.product_id]) grouped[r.product_id] = [];
          grouped[r.product_id].push(r);
        });
        setReviews(grouped);
      }
    };
    fetchReviews();
  }, [products]);

  // Check login state and fetch products
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) {
        navigate("/auth?redirect=shop");
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
    return () => subscription?.subscription?.unsubscribe();
  }, [navigate]);

  // Sorting/filtering logic (simple demo)
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') return sortDir === 'asc' ? a.price - b.price : b.price - a.price;
    if (sortBy === 'title') return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortBy === 'rating') return sortDir === 'asc' ? (a.avgRating || 0) - (b.avgRating || 0) : (b.avgRating || 0) - (a.avgRating || 0);
    return 0;
  });

  // Filtered products by category
  const filteredProducts = categoryFilter
    ? products.filter((product) =>
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

   // Review form handlers
  function handleReviewInput(productId: string, field: 'rating' | 'comment', value: string | number) {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  }

  async function handleReviewSubmit(productId: string) {
    if (!user) return;
    const input = reviewInputs[productId];
    if (!input || !input.rating) return;
    setReviewSubmitting((prev) => ({ ...prev, [productId]: true }));
    // @ts-ignore: ignore missing type until types are regenerated
    const { error } = await supabase.from('product_reviews' as any).insert({
      product_id: productId,
      user_id: user.id,
      rating: input.rating,
      comment: input.comment,
    });  
    setReviewSubmitting((prev) => ({ ...prev, [productId]: false }));
    if (!error) {
      toast({ title: 'Review submitted!' });
      setReviewInputs((prev) => ({ ...prev, [productId]: { rating: 5, comment: '' } }));
      // Refetch reviews
      // @ts-ignore: ignore missing type until types are regenerated
      const { data } = await supabase.from('product_reviews' as any).select('*').eq('product_id', productId);
      const filtered = Array.isArray(data)
        ? data.filter((r: any) => r && typeof r.product_id === "string")
        : [];
      setReviews((prev) => ({
        ...prev,
        [productId]: filtered as ProductReview[]
      }));
    } else {
      toast({ title: 'Error submitting review', description: error.message, variant: 'destructive' });
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }
  
  return (
    <>
      <ShopNavbar />
      <ShopHeroCarousel />
      <div className="container mx-auto px-2 sm:px-4 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <ShopCategories selectedCategory={categoryFilter} onSelectCategory={setCategoryFilter} />
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate("/dashboard") } className="w-full sm:w-auto">Go Back to Dashboard</Button>
            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">Logout</Button>
          </div>
        </div>
        {/* Filtering/Sorting Controls */}
        <div className="flex gap-4 mb-4 items-center">
          <label>Sort by:
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="ml-2 border rounded px-2 py-1">
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </label>
          <label>Direction:
            <select value={sortDir} onChange={e => setSortDir(e.target.value as any)} className="ml-2 border rounded px-2 py-1">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col h-full p-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-full h-40 sm:h-48 bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (images[product.id]) {
                      setPreviewImg(images[product.id]);
                      setPreviewAlt(product.title);
                    }
                  }}
                  title="Click to preview image"
                >
                  {images[product.id] ? (
                    <img src={images[product.id]} alt={product.title} className="object-cover w-full h-full" />
                  ) : (
                    <Image className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-base sm:text-lg truncate" title={product.title}>{product.title}</h3>
                  <div className="text-accent font-bold text-lg">Ksh {product.price.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mb-1 truncate" title={product.description || ''}>{product.description}</div>
                  {product.category && <Badge className="w-fit text-xs mb-1">{product.category}</Badge>}
                </div>
              </div>
              <Button className="mt-2 w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
              {/* Wishlist/Favorites */}
              <Button variant={wishlist.includes(product.id) ? 'default' : 'outline'} onClick={() => toggleWishlist(product.id)} className="w-full mt-2">
                {wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              {/* Ratings UI */}
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= (product.avgRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill={i <= (product.avgRating || 0) ? '#facc15' : 'none'} />
                ))}
                <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
              </div>
              {/* Reviews Section */}
              <div className="mt-4">
                <div className="mb-2">
                  <span className="font-semibold">Reviews:</span>
                  <div className="space-y-1 mt-1">
                    {(reviews[product.id] || []).length === 0 && <div className="text-xs text-muted-foreground">No reviews yet.</div>}
                    {(reviews[product.id] || []).map((r) => (
                      <div key={r.id} className="text-xs border-b border-muted py-1 flex flex-col">
                        <span className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3 h-3 ${i <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill={i <= r.rating ? '#facc15' : 'none'} />
                          ))}
                          <span className="ml-2 text-muted-foreground">{r.comment}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {user && (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleReviewSubmit(product.id);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <label className="block mb-1 font-semibold">Leave a Review:</label>
                    <div className="flex gap-2 items-center">
                      <select
                        className="border rounded px-2 py-1"
                        value={reviewInputs[product.id]?.rating || 5}
                        onChange={e => handleReviewInput(product.id, 'rating', Number(e.target.value))}
                        required
                      >
                        {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} Star{i > 1 ? 's' : ''}</option>)}
                      </select>
                      <input
                        type="text"
                        placeholder="Your comment"
                        className="border rounded px-2 py-1"
                        value={reviewInputs[product.id]?.comment || ''}
                        onChange={e => handleReviewInput(product.id, 'comment', e.target.value)}
                      />
                      <Button type="submit" size="sm" disabled={reviewSubmitting[product.id]}>Submit</Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          ))}
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
