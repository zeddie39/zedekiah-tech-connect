import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../types/supabase";
type Tables = Database['public']['Tables'];
type WishlistRow = Tables['user_wishlist']['Row'];
type ProductReviewRow = Tables['product_reviews']['Row'];
import { Card } from "@/components/ui/card";
import { Loader2, Image, Star, Clock, Filter, Search, ShoppingCart, Heart, Phone, Eye, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/CartContext";
import { toast } from "@/components/ui/use-toast";
import { formatPhoneForWhatsapp } from "@/lib/utils";
import ShopNavbar from "@/components/ShopNavbar";
import ShopHeroCarousel from "@/components/ShopHeroCarousel";
import { categories as shopCats } from "@/components/ShopCategories";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import type { Session, User } from "@supabase/supabase-js";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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

  // Filters
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Navigation
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const clearAllFilters = () => {
    setCategoryFilter(null);
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
  };

  const toggleExpanded = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  // Load wishlist
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
        const stored = localStorage.getItem('wishlist');
        setWishlist(stored ? JSON.parse(stored) : []);
      }
    };
    loadWishlist();
  }, [user]);

  // Toggle wishlist
  const toggleWishlist = async (productId: string) => {
    if (user) {
      let updated: string[];
      if (wishlist.includes(productId)) {
        updated = wishlist.filter(id => id !== productId);
        // @ts-ignore
        await supabase.from('user_wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        updated = [...wishlist, productId];
        // @ts-ignore
        await supabase.from('user_wishlist').insert({ user_id: user.id, product_id: productId });
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

  // Auth & Data Fetching
  useEffect(() => {
    if (session) {
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    }
  }, [session]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading products", description: error.message, variant: "destructive" });
      return;
    }

    if (data) {
      setProducts(data);
      const imagePromises = data.map(async (product) => {
        const { data: imgData } = await supabase.from("product_images").select("image_url").eq("product_id", product.id).single();
        if (imgData?.image_url) {
          setImages(prev => ({ ...prev, [product.id]: imgData.image_url }));
        }
      });
      await Promise.all(imagePromises);
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) {
        navigate("/auth?redirect=shop");
        return;
      }
      setSession(session);
      setLoading(false);
      fetchProducts();
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [navigate]);

  // Fetch reviews
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
        const reviews = data.filter((r): r is ProductReviewRow => Boolean(r?.product_id));
        reviews.forEach((review) => {
          if (!grouped[review.product_id]) grouped[review.product_id] = [];
          grouped[review.product_id].push(review);
        });
        setReviews(grouped);
      }
    };
    fetchReviews();
  }, [products]);


  // Filtering Logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') return sortDir === 'asc' ? a.price - b.price : b.price - a.price;
    if (sortBy === 'title') return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortBy === 'rating') return sortDir === 'asc' ? (a.avgRating || 0) - (b.avgRating || 0) : (b.avgRating || 0) - (a.avgRating || 0);
    return 0;
  });

  const getAvgRating = (p: Product) => {
    const list = reviews[p.id];
    if (list && list.length) {
      const sum = list.reduce((acc, r) => acc + (r?.rating || 0), 0);
      return sum / list.length;
    }
    return p.avgRating || 0;
  };

  const filteredProducts = sortedProducts.filter((product) => {
    if (categoryFilter && (product.category || "").toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (search.trim()) {
      const hay = `${product.title} ${(product.description || "")}`.toLowerCase();
      if (!hay.includes(search.trim().toLowerCase())) return false;
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

  // Review handlers
  function handleReviewInput(productId: string, field: 'rating' | 'comment', value: string | number) {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  }

  async function handleReviewSubmit(productId: string) {
    if (!user) return;
    const input = reviewInputs[productId];
    if (!input || !input.rating) return;
    setReviewSubmitting((prev) => ({ ...prev, [productId]: true }));
    // @ts-ignore
    const { error } = await supabase.from('product_reviews').insert({
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
      const { data } = await supabase.from('product_reviews').select('*').eq('product_id', productId) as { data: ProductReviewRow[] | null; error: any };
      if (data) {
        setReviews((prev) => ({ ...prev, [productId]: data.filter((r): r is ProductReviewRow => Boolean(r?.product_id)) }));
      }
    } else {
      toast({ title: 'Error submitting review', description: error.message, variant: 'destructive' });
    }
  }


  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const SidebarFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Filter size={14} /> Categories
        </h3>
        <div className="space-y-0.5">
          <button
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
              categoryFilter === null
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            onClick={() => setCategoryFilter(null)}
          >
            All Categories
          </button>
          {shopCats.map((c) => (
            <button
              key={c.name}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                categoryFilter === c.name
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setCategoryFilter(prev => prev === c.name ? null : c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <Separator className="bg-border/40" />
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9 text-sm rounded-xl bg-muted/30 border-border/40"
          />
          <span className="text-muted-foreground text-xs">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 text-sm rounded-xl bg-muted/30 border-border/40"
          />
        </div>
      </div>
      <Separator className="bg-border/40" />
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Rating</h3>
        <Select value={minRating} onValueChange={(v: any) => setMinRating(v === 'any' ? '' : v)}>
          <SelectTrigger className="w-full h-9 text-sm rounded-xl bg-muted/30 border-border/40">
            <SelectValue placeholder="Minimum Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Rating</SelectItem>
            {[4, 3, 2, 1].map(i => (
              <SelectItem key={i} value={String(i)}>{i} Stars & Up</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary" onClick={clearAllFilters}>
        Reset all filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-background font-sans">
      <ShopNavbar />
      <ShopHeroCarousel />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8" id="shop-main">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-24 h-fit">
            <div className="rounded-2xl bg-card/80 backdrop-blur border border-border/40 p-5 shadow-sm">
              <SidebarFilters />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-muted/30 border-border/40 focus:border-primary/40 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-full sm:w-[150px] h-11 rounded-xl bg-muted/30 border-border/40 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden h-11 w-11 rounded-xl border-border/40"
                  onClick={() => setFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Filters Sheet */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SidebarFilters />
                </div>
              </SheetContent>
            </Sheet>

            {/* Products Grid */}
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 scroll-mt-24">
              {filteredProducts.map((product, index) => {
                const avgRating = getAvgRating(product);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                  >
                  <Card
                    className={`group relative rounded-2xl border-border/40 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 ${expanded[product.id] ? 'ring-2 ring-primary/20' : ''}`}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <AspectRatio ratio={4 / 3}>
                        {images[product.id] ? (
                          <img
                            src={images[product.id]}
                            alt={product.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            <Image className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </AspectRatio>

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Quick actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-9 w-9 rounded-full shadow-lg bg-background/90 backdrop-blur-sm hover:bg-background border-0"
                          onClick={() => { setPreviewImg(images[product.id]); setPreviewAlt(product.title); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className={`h-9 w-9 rounded-full shadow-lg backdrop-blur-sm border-0 ${
                            wishlist.includes(product.id)
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-background/90 hover:bg-background'
                          }`}
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>

                      {/* Category badge */}
                      {product.category && (
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground border border-border/40 shadow-sm">
                            {product.category}
                          </span>
                        </div>
                      )}

                      {product.status === 'pending' && (
                        <Badge variant="secondary" className="absolute top-3 left-3 text-[10px] bg-background/90 backdrop-blur-sm">
                          Pending
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-base leading-tight line-clamp-1 text-foreground mb-1.5" title={product.title}>
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-extrabold text-primary">
                            Ksh {product.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className={`h-3.5 w-3.5 ${avgRating > 0 ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />
                            <span className="font-medium">{avgRating.toFixed(1)}</span>
                            <span>({reviews[product.id]?.length || 0})</span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded / Actions */}
                      {expanded[product.id] ? (
                        <div className="pt-2 animate-fade-in">
                          <div className="text-xs text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
                            {product.description || "No description available."}
                          </div>
                          <div className="space-y-2">
                            <Button className="w-full rounded-xl h-10 font-semibold" size="sm" onClick={() => {
                              addToCart({ ...product });
                              toast({ title: 'Added to cart', description: product.title });
                            }}>
                              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </Button>
                            {product.whatsapp_number && (
                              <Button variant="outline" size="sm" className="w-full rounded-xl h-10" onClick={() => {
                                const url = formatPhoneForWhatsapp(product.whatsapp_number, `Hi, I'm interested in ${product.title}`, images[product.id]);
                                if (url) window.open(url, '_blank');
                                else toast({ title: 'Invalid WhatsApp', variant: 'destructive' });
                              }}>
                                <Phone className="mr-2 h-4 w-4" /> WhatsApp Seller
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="w-full h-auto py-1 text-xs text-muted-foreground" onClick={() => toggleExpanded(product.id)}>
                              Close
                            </Button>
                          </div>

                          {/* Reviews */}
                          <div className="mt-4 pt-3 border-t border-border/40">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Reviews</h4>
                            {reviews[product.id]?.slice(0, 2).map(r => (
                              <div key={r.id} className="text-[11px] mb-1.5 text-muted-foreground leading-relaxed">
                                <span className="font-medium text-foreground">User:</span> {r.comment}
                              </div>
                            ))}
                            {user && (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  className="h-8 text-xs rounded-lg"
                                  placeholder="Write a review..."
                                  value={reviewInputs[product.id]?.comment || ''}
                                  onChange={e => handleReviewInput(product.id, 'comment', e.target.value)}
                                />
                                <Button size="sm" className="h-8 px-3 rounded-lg text-xs" onClick={() => handleReviewSubmit(product.id)}>Post</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl h-10 font-medium border-border/40 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                          size="sm"
                          onClick={() => toggleExpanded(product.id)}
                        >
                          View Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-2">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <Button variant="link" onClick={clearAllFilters} className="mt-2 text-primary">
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <ImagePreviewModal
        open={!!previewImg}
        onClose={() => setPreviewImg(null)}
        src={previewImg}
        alt={previewAlt}
      />
    </div>
  );
}
