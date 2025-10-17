import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../types/supabase";
type Tables = Database['public']['Tables'];
type WishlistRow = Tables['user_wishlist']['Row'];
type ProductReviewRow = Tables['product_reviews']['Row'];
import { Card } from "@/components/ui/card";
import { Loader2, Image, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { toast } from "@/components/ui/use-toast";
import { formatPhoneForWhatsapp } from "@/lib/utils";
import ShopNavbar from "@/components/ShopNavbar";
import ShopHeroCarousel from "@/components/ShopHeroCarousel";
import ShopCategories from "@/components/ShopCategories";
import { categories as shopCats } from "@/components/ShopCategories";
import { Badge } from "@/components/ui/badge";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import type { Session, User } from "@supabase/supabase-js";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  // Collapsible details state per product
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // Filters and search
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const clearAllFilters = () => {
    setCategoryFilter(null);
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
  };

  const toggleExpanded = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  // Add navigation and cart hooks
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Load wishlist from Supabase or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_wishlist')
          .select('product_id')
          .eq('user_id', user.id) as { data: WishlistRow[] | null; error: any };
        if (!error && data) {
          const wishlistIds = data
            .filter((row): row is WishlistRow => Boolean(row?.product_id))
            .map(row => row.product_id);
          setWishlist(wishlistIds);
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

  // Fetch user info when we have session
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
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .in('product_id', ids) as { data: ProductReviewRow[] | null; error: any };
      if (!error && data) {
        const grouped: Record<string, ProductReview[]> = {};
        const reviews = data
          .filter((r): r is ProductReviewRow => Boolean(r?.product_id));
            
        reviews.forEach((review) => {
          if (!grouped[review.product_id]) {
            grouped[review.product_id] = [];
          }
          grouped[review.product_id].push(review);
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
      
      // Fetch products once we have a session
      fetchProducts();
    });

    // Listen for changes in auth state
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [navigate]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setProducts(data);

      // Fetch images for all products (first image)
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

  // Sorting/filtering logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') return sortDir === 'asc' ? a.price - b.price : b.price - a.price;
    if (sortBy === 'title') return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortBy === 'rating') return sortDir === 'asc' ? (a.avgRating || 0) - (b.avgRating || 0) : (b.avgRating || 0) - (a.avgRating || 0);
    return 0;
  });

  // Helpers
  const getAvgRating = (p: Product) => {
    const list = reviews[p.id];
    if (list && list.length) {
      const sum = list.reduce((acc, r) => acc + (r?.rating || 0), 0);
      return sum / list.length;
    }
    return p.avgRating || 0;
  };

  // Apply filters
  const searchQ = search.trim().toLowerCase();
  const filteredProducts = sortedProducts.filter((product) => {
    if (categoryFilter && (product.category || "").toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (searchQ) {
      const hay = `${product.title} ${(product.description || "")}`.toLowerCase();
      if (!hay.includes(searchQ)) return false;
    }
    const price = product.price || 0;
    if (minPrice && price < parseFloat(minPrice)) return false;
    if (maxPrice && price > parseFloat(maxPrice)) return false;
    if (minRating) {
      const avg = getAvgRating(product);
      if (avg < parseFloat(minRating)) return false;
    }
    return true;
  });

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
      const { data } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId) as { data: ProductReviewRow[] | null; error: any };
        
      if (data) {
        const reviews = data.filter((r): r is ProductReviewRow => Boolean(r?.product_id));

        setReviews((prev) => ({
          ...prev,
          [productId]: reviews
        }));
      }
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

        {/* Smart toolbar: search, filters, sort (sticky) */}
        <div className="sticky top-16 z-20 mb-4">
          <div className="bg-card/80 border border-accent/30 rounded-xl p-3 shadow-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            {/* Left: Search + count */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-background w-full md:w-72"
              />
              <span className="text-xs text-muted-foreground hidden md:inline">{filteredProducts.length} items</span>
            </div>

            {/* Middle: Inline filters on md+ */}
            <div className="hidden md:flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-background w-28"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-background w-28"
              />
              <Select value={minRating} onValueChange={(v: any) => setMinRating(v === 'any' ? '' : v)}>
                <SelectTrigger className="h-9 w-32">
                  <SelectValue placeholder="Min rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  {[1,2,3,4,5].map(i => (
                    <SelectItem key={i} value={String(i)}>{i} Star{i>1?'s':''}+</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoryFilter && (
                <span className="text-xs bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full">
                  {categoryFilter}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="border-accent/60 hover:bg-accent/10">Reset</Button>
            </div>

            {/* Right: Sort + Filters button (mobile) */}
            <div className="flex items-center gap-2 justify-end w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden md:inline">Sort</span>
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="h-9 w-28">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortDir} onValueChange={(v: any) => setSortDir(v)}>
                  <SelectTrigger className="h-9 w-24">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => { setLoading(true); fetchProducts().finally(() => setLoading(false)); }} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden border-accent/60 text-accent hover:bg-accent/10">Filters</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="p-4">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-2 space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Category</div>
                      <div className="flex flex-wrap gap-2">
                        {shopCats.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setCategoryFilter(prev => prev === c.name ? null : c.name)}
                            className={`px-3 py-1 rounded-full text-xs border ${categoryFilter===c.name ? 'bg-accent text-primary border-accent' : 'bg-card border-accent/40 text-foreground'}`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="Min price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className="bg-background" />
                      <Input type="number" placeholder="Max price" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="bg-background" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Minimum rating</div>
                      <Select value={minRating} onValueChange={(v: any) => setMinRating(v === 'any' ? '' : v)}>
                        <SelectTrigger className="h-9 w/full">
                          <SelectValue placeholder="Any rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any rating</SelectItem>
                          {[1,2,3,4,5].map(i => (
                            <SelectItem key={i} value={String(i)}>{i} Star{i>1?'s':''}+</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" onClick={() => { clearAllFilters(); }} className="border-accent/60 hover:bg-accent/10">Clear</Button>
                      <Button onClick={() => setFiltersOpen(false)}>Apply</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div id="products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`group flex flex-col h-full p-3 rounded-2xl bg-card/90 border border-accent/30 transition-all duration-300 hover:shadow-lg hover:border-accent/60 hover:-translate-y-0.5 ${expanded[product.id] ? "ring-2 ring-accent/40 shadow-lg" : ""}`}
            >
              <div className="flex-1 flex flex-col gap-2">
                {/* Image area with aspect ratio and overlay */}
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

                {/* Title, Price, and optional details */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-semibold text-base sm:text-lg truncate" title={product.title}>{product.title}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-primary text-sm sm:text-base font-extrabold shadow-sm">
                      Ksh {product.price.toFixed(2)}
                    </span>
                  </div>
                  {expanded[product.id] && (
                    <>
                      {product.description && (
                        <div className="text-xs text-muted-foreground line-clamp-3">{product.description}</div>
                      )}
                      {product.category && <Badge variant="secondary" className="w-fit text-[11px] border border-accent/30">{product.category}</Badge>}
                    </>
                  )}
                </div>
              </div>

              {!expanded[product.id] ? (
                <Button variant="outline" className="mt-3 w-full border-accent/50 text-accent hover:bg-accent/10" onClick={() => toggleExpanded(product.id)}>
                  View Details
                </Button>
              ) : (
                <>
                  <Button className="mt-3 w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                  {/* Wishlist/Favorites */}
                  <Button
                    variant={wishlist.includes(product.id) ? 'default' : 'outline'}
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-full mt-2 ${wishlist.includes(product.id) ? 'border-accent bg-accent text-primary' : 'border-accent/50 text-accent hover:bg-accent/10'}`}
                  >
                    {wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>

                  {/* Ratings UI */}
                  <div className="flex items-center gap-1 mt-3 text-xs bg-muted rounded px-2 py-1 w-fit">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`${i <= (product.avgRating || 0) ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`} fill={i <= (product.avgRating || 0) ? '#facc15' : 'none'} />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1">({product.reviewCount || 0})</span>
                  </div>

                  {/* Reviews and WhatsApp */}
                  <div className="mt-3">
                    {/* Contact Owner via WhatsApp (if available) */}
                    {product.whatsapp_number ? (
                      <Button
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() => {
                          const message = `Hi, I am interested in your product:\n\n${product.title}\nPrice: KSh ${product.price.toFixed(2)}\n\nIs this still available?`;
                          const url = formatPhoneForWhatsapp(
                            product.whatsapp_number,
                            message,
                            images[product.id]
                          );
                          if (!url) {
                            toast({ title: 'Invalid WhatsApp number', description: 'Owner provided an invalid number.', variant: 'destructive' });
                            return;
                          }
                          window.open(url, '_blank');
                        }}
                      >
                        Chat on WhatsApp
                      </Button>
                    ) : null}

                    <div className="mb-2 mt-3">
                      <span className="font-semibold">Reviews</span>
                      <div className="space-y-1 mt-1">
                        {(reviews[product.id] || []).length === 0 && <div className="text-xs text-muted-foreground">No reviews yet.</div>}
                        {(reviews[product.id] || []).map((r) => (
                          <div key={r.id} className="text-xs border-b border-muted py-1 flex flex-col">
                            <span className="flex items-center gap-1">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`${i <= r.rating ? 'text-yellow-400' : 'text-gray-300'} w-3 h-3`} fill={i <= r.rating ? '#facc15' : 'none'} />
                              ))}
                              <span className="ml-2 text-muted-foreground">{r.comment}</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(r.created_at).toLocaleString()}</span>
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
                        className="flex flex-col gap-2 w-full"
                      >
                        <label className="block mb-1 font-semibold">Leave a Review</label>
                        <div className="flex items-center gap-2 w-full min-w-0">
                          <select
                            className="border rounded px-2 py-1 bg-background w-[110px] shrink-0"
                            value={reviewInputs[product.id]?.rating || 5}
                            onChange={e => handleReviewInput(product.id, 'rating', Number(e.target.value))}
                            required
                          >
                            {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} Star{i > 1 ? 's' : ''}</option>)}
                          </select>
                          <input
                            type="text"
                            placeholder="Your comment"
                            className="border rounded px-2 py-1 bg-background flex-1 min-w-0 w-0"
                            value={reviewInputs[product.id]?.comment || ''}
                            onChange={e => handleReviewInput(product.id, 'comment', e.target.value)}
                          />
                          <Button type="submit" size="sm" disabled={reviewSubmitting[product.id]} className="shrink-0">Submit</Button>
                        </div>
                      </form>
                    )}
                  </div>

                  <Button variant="ghost" onClick={() => toggleExpanded(product.id)} className="w-full mt-2">Hide Details</Button>
                </>
              )}
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
