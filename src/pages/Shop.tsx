import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../types/supabase";
type Tables = Database['public']['Tables'];
type WishlistRow = Tables['user_wishlist']['Row'];
type ProductReviewRow = Tables['product_reviews']['Row'];
import { Card } from "@/components/ui/card";
import { Loader2, Image, Star, Clock, Filter, Search, ShoppingCart, Heart, Phone, Eye, ArrowRight, X, SlidersHorizontal, Menu } from "lucide-react";
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
  const [galleries, setGalleries] = useState<Record<string, string[]>>({});
  const [activeGalleryImages, setActiveGalleryImages] = useState<Record<string, number>>({});
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
  const [leftFiltersOpen, setLeftFiltersOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [profileName, setProfileName] = useState<string>("");

  // Track scroll position to show/hide the floating left button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingBtn(true);
      } else {
        setShowFloatingBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch profiles table name for personalization
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.full_name) {
        setProfileName(data.full_name);
      }
    };
    fetchProfile();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

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
      const newImages: Record<string, string> = {};
      const newGalleries: Record<string, string[]> = {};
      
      const imagePromises = data.map(async (product) => {
        const { data: imgData } = await supabase.from("product_images").select("image_url").eq("product_id", product.id);
        if (imgData && imgData.length > 0) {
          newImages[product.id] = imgData[0].image_url;
          newGalleries[product.id] = imgData.map(img => img.image_url);
        }
      });
      
      await Promise.all(imagePromises);
      setImages(newImages);
      setGalleries(newGalleries);
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
      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span>Categories</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              categoryFilter === null
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Categories
          </button>
          {shopCats.map((cat) => {
            const isSelected = categoryFilter === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setCategoryFilter(cat.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9 text-sm"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Rating</h3>
        <Select value={minRating} onValueChange={(v: any) => setMinRating(v === 'any' ? '' : v)}>
          <SelectTrigger className="w-full h-9 text-sm">
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

      <Button variant="outline" className="w-full mt-2 font-medium" onClick={clearAllFilters}>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-accent/5 font-sans">
      <ShopNavbar />
      <ShopHeroCarousel />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8" id="shop-main">
        {/* Welcome Greeting Banner */}
        {user && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {getGreeting()}, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent capitalize">{profileName || user.email?.split('@')[0] || "Friend"}</span>!
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Explore our latest electronics repair services and premium tech products.</p>
          </div>
        )}

        {/* Horizontal Category Capsules (Visible on all screens) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <Button
            variant={categoryFilter === null ? "default" : "outline"}
            onClick={() => setCategoryFilter(null)}
            className="rounded-full flex-shrink-0 transition-all duration-300 shadow-sm"
          >
            All Products
          </Button>
          {shopCats.map((c) => {
            const Icon = c.icon;
            const isSelected = categoryFilter === c.name;
            return (
              <Button
                key={c.name}
                variant={isSelected ? "default" : "outline"}
                onClick={() => setCategoryFilter(prev => prev === c.name ? null : c.name)}
                className={`rounded-full flex-shrink-0 gap-2 transition-all duration-300 shadow-sm ${
                  isSelected ? 'scale-105' : 'hover:scale-105'
                }`}
              >
                <Icon className="h-4 w-4" />
                {c.name}
              </Button>
            );
          })}
        </div>

        {/* Free Delivery Banner */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M10 17h4V5H2v12h3"/>
              <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
              <circle cx="7.5" cy="17.5" r="2.5"/>
              <circle cx="17.5" cy="17.5" r="2.5"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">🚚 Free Delivery Around Kisii!</p>
            <p className="text-xs text-muted-foreground">Enjoy free delivery on all orders within Kisii town and its surroundings.</p>
          </div>
          <Badge className="flex-shrink-0 bg-primary/15 text-primary border-primary/30 text-[10px] font-bold uppercase tracking-wider">
            Free
          </Badge>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex-1 min-w-0 w-full">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background/60 backdrop-blur"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-background/60 backdrop-blur">
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
                  className="gap-2 bg-background/60 backdrop-blur shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => setFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Left Filters Sheet (collapsible drawer triggered by floating left button) */}
            <Sheet open={leftFiltersOpen} onOpenChange={setLeftFiltersOpen}>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SidebarFilters />
                </div>
              </SheetContent>
            </Sheet>

            {/* Right Filters Sheet (collapsible drawer triggered by top toolbar button) */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SidebarFilters />
                </div>
              </SheetContent>
            </Sheet>

            {/* Products Grid */}
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scroll-mt-24">
              {filteredProducts.map((product, index) => {
                const avgRating = getAvgRating(product);
                const hasDiscount = Number(product.price) % 3 === 0;
                const originalPrice = product.price * 1.25;
                const isNew = Number(product.price) % 3 === 1;
                const isHot = Number(product.price) % 3 === 2;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
                  >
                  <Card
                    className={`group border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 ${expanded[product.id] ? 'ring-1 ring-primary/30' : ''}`}
                  >
                    <div className="relative">
                      <div 
                        className="cursor-pointer"
                        onClick={() => navigate(`/shop/${product.id}`)}
                      >
                        <AspectRatio ratio={4 / 3}>
                          {images[product.id] ? (
                            <img
                              src={galleries[product.id] ? galleries[product.id][activeGalleryImages[product.id] || 0] : images[product.id]}
                              alt={product.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Image className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                          )}
                        </AspectRatio>
                      </div>

                      {/* Overlay Actions */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full shadow-sm"
                          onClick={() => { setPreviewImg(galleries[product.id] ? galleries[product.id][activeGalleryImages[product.id] || 0] : images[product.id]); setPreviewAlt(product.title); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={wishlist.includes(product.id) ? "default" : "secondary"}
                          className={`h-8 w-8 rounded-full shadow-sm ${wishlist.includes(product.id) ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>

                      {product.status === 'pending' ? (
                        <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] bg-background/80 backdrop-blur">
                          Pending
                        </Badge>
                      ) : hasDiscount ? (
                        <Badge className="absolute top-2 left-2 text-[10px] font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-sm">
                          SALE
                        </Badge>
                      ) : isNew ? (
                        <Badge className="absolute top-2 left-2 text-[10px] font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 shadow-sm">
                          NEW
                        </Badge>
                      ) : isHot ? (
                        <Badge className="absolute top-2 left-2 text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-sm">
                          HOT
                        </Badge>
                      ) : null}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 
                            className="font-semibold text-base leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors" 
                            title={product.title}
                            onClick={() => navigate(`/shop/${product.id}`)}
                          >
                            {product.title}
                          </h3>
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-lg font-bold text-primary">
                            Ksh {product.price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-muted-foreground line-through">
                                Ksh {originalPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] bg-red-500/10 text-red-500 font-semibold px-1.5 py-0.5 rounded">
                                20% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Star className={`h-3.5 w-3.5 ${avgRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                        <span>{avgRating.toFixed(1)}</span>
                        <span>({reviews[product.id]?.length || 0})</span>
                      </div>

                      {/* Expanded / Actions */}
                      {expanded[product.id] ? (
                        <div className="pt-2 animate-in slide-in-from-top-2">
                          {galleries[product.id] && galleries[product.id].length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30">
                              {galleries[product.id].map((imgUrl, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveGalleryImages(prev => ({ ...prev, [product.id]: idx }));
                                  }}
                                  className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                    (activeGalleryImages[product.id] || 0) === idx 
                                      ? 'border-accent shadow-sm scale-105' 
                                      : 'border-transparent opacity-70 hover:opacity-100'
                                  }`}
                                >
                                  <img 
                                    src={imgUrl} 
                                    alt={`${product.title} thumb ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mb-3 line-clamp-4">
                            {product.description || "No description available."}
                          </div>
                          <div className="space-y-2">
                            <Button className="w-full" size="sm" onClick={() => {
                              addToCart({ ...product });
                              toast({
                                title: "Added to Cart",
                                description: (
                                  <div className="flex items-center gap-3 mt-1.5">
                                    {(galleries[product.id] ? galleries[product.id][activeGalleryImages[product.id] || 0] : images[product.id]) && (
                                      <img 
                                        src={galleries[product.id] ? galleries[product.id][activeGalleryImages[product.id] || 0] : images[product.id]} 
                                        alt="" 
                                        className="h-10 w-10 rounded object-cover border border-border/50" 
                                      />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-xs text-foreground line-clamp-1">{product.title}</p>
                                      <p className="text-[10px] text-muted-foreground">Ksh {product.price.toLocaleString()}</p>
                                    </div>
                                  </div>
                                )
                              });
                            }}>
                              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2" 
                              onClick={() => {
                                // Fallback to business WhatsApp if product owner didn't provide one
                                const targetNumber = product.whatsapp_number || "+254757756763";
                                const productUrl = window.location.origin + "/shop/" + product.id;
                                const message = `Hi! I am interested in this product:\n\n*${product.title}*\nPrice: KSh ${product.price.toFixed(2)}\n\nLink: ${productUrl}`;
                                const url = formatPhoneForWhatsapp(targetNumber, message, images[product.id]);
                                if (url) window.open(url, '_blank');
                                else toast({ title: 'Invalid WhatsApp', variant: 'destructive' });
                              }}
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              Chat on WhatsApp
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full h-auto py-1 text-xs" onClick={() => toggleExpanded(product.id)}>
                              Close Details
                            </Button>
                          </div>

                          {/* Simplified Reviews for Grid View */}
                          <div className="mt-4 pt-3 border-t">
                            <h4 className="text-xs font-semibold mb-2">Reviews</h4>
                            {reviews[product.id]?.slice(0, 2).map(r => (
                              <div key={r.id} className="text-[11px] mb-1 text-muted-foreground">
                                <span className="font-medium text-foreground">User:</span> {r.comment}
                              </div>
                            ))}
                            {user && (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  className="h-7 text-xs"
                                  placeholder="Write a review..."
                                  value={reviewInputs[product.id]?.comment || ''}
                                  onChange={e => handleReviewInput(product.id, 'comment', e.target.value)}
                                />
                                <Button size="sm" className="h-7 px-2" onClick={() => handleReviewSubmit(product.id)}>Post</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            className="flex-1 text-xs" 
                            size="sm" 
                            onClick={() => toggleExpanded(product.id)}
                          >
                            Quick View
                          </Button>
                          <Button 
                            className="flex-1 text-xs bg-primary hover:bg-primary/95 text-white" 
                            size="sm" 
                            onClick={() => {
                              const img = images[product.id] || null;
                              addToCart({ 
                                id: product.id, 
                                title: product.title, 
                                price: product.price, 
                                image: img 
                              });
                              toast({
                                title: "Added to Cart",
                                description: (
                                  <div className="flex items-center gap-3 mt-1.5">
                                    {img && (
                                      <img 
                                        src={img} 
                                        alt="" 
                                        className="h-10 w-10 rounded object-cover border border-border/50" 
                                      />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-xs text-foreground line-clamp-1">{product.title}</p>
                                      <p className="text-[10px] text-muted-foreground">Ksh {product.price.toLocaleString()}</p>
                                    </div>
                                  </div>
                                )
                              });
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
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
          </div>
        </div>
      </div>

      {/* Floating Left Filter Button (Three lines icon, appears when scrolling down) */}
      {showFloatingBtn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed left-5 bottom-6 z-40"
        >
          <Button
            onClick={() => setLeftFiltersOpen(true)}
            size="icon"
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-primary-foreground/20"
            title="Open Filters & Categories"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </motion.div>
      )}

      <ImagePreviewModal
        open={!!previewImg}
        onClose={() => setPreviewImg(null)}
        src={previewImg}
        alt={previewAlt}
      />
    </div>
  );
}
