import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../types/supabase";
type Tables = Database['public']['Tables'];
type WishlistRow = Tables['user_wishlist']['Row'];
type ProductReviewRow = Tables['product_reviews']['Row'];
import { Loader2, Image, Star, Filter, Search, ShoppingCart, Heart, Phone, Eye, ArrowRight, X, SlidersHorizontal, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/CartContext";
import { toast } from "@/components/ui/use-toast";
import { formatPhoneForWhatsapp } from "@/lib/utils";
import ShopNavbar from "@/components/ShopNavbar";
import ShopHeroCarousel from "@/components/ShopHeroCarousel";
import { categories as shopCats } from "@/components/ShopCategories";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import type { Session, User } from "@supabase/supabase-js";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

/* ─── Color constants (brand) ─── */
const BG      = "#0c0818";   // page bg – slightly darker than primary for depth
const CARD_BG = "#150f28";   // cards / sidebar
const BORDER  = "rgba(255,255,255,0.06)";
const ACCENT  = "#ff9800";

export default function Shop() {
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const clearAllFilters = () => {
    setCategoryFilter(null);
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
  };

  const activeFilterCount = [categoryFilter, search, minPrice, maxPrice, minRating].filter(Boolean).length;
  const toggleExpanded = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  /* ─── Wishlist ─── */
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_wishlist').select('product_id').eq('user_id', user.id) as { data: WishlistRow[] | null; error: any };
        if (!error && data) {
          setWishlist(data.filter((r): r is WishlistRow => Boolean(r?.product_id)).map(r => r.product_id));
        } else setWishlist([]);
      } else {
        const stored = localStorage.getItem('wishlist');
        setWishlist(stored ? JSON.parse(stored) : []);
      }
    };
    loadWishlist();
  }, [user]);

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
        const updated = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
        localStorage.setItem('wishlist', JSON.stringify(updated));
        return updated;
      });
    }
  };

  /* ─── Auth & Data ─── */
  useEffect(() => { if (session) supabase.auth.getUser().then(({ data }) => setUser(data?.user || null)); }, [session]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").eq("status", "approved").order("created_at", { ascending: false });
    if (error) { toast({ title: "Error loading products", description: error.message, variant: "destructive" }); return; }
    if (data) {
      setProducts(data);
      const imagePromises = data.map(async (product) => {
        const { data: imgData } = await supabase.from("product_images").select("image_url").eq("product_id", product.id).single();
        if (imgData?.image_url) setImages(prev => ({ ...prev, [product.id]: imgData.image_url }));
      });
      await Promise.all(imagePromises);
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) { navigate("/auth?redirect=shop"); return; }
      setSession(session); setLoading(false); fetchProducts();
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); if (!session) navigate("/auth");
    });
    return () => { mounted = false; subscription?.subscription?.unsubscribe(); };
  }, [navigate]);

  useEffect(() => {
    if (products.length === 0) return;
    const fetchReviews = async () => {
      const ids = products.map(p => p.id);
      const { data, error } = await supabase.from('product_reviews').select('*').in('product_id', ids) as { data: ProductReviewRow[] | null; error: any };
      if (!error && data) {
        const grouped: Record<string, ProductReview[]> = {};
        data.filter((r): r is ProductReviewRow => Boolean(r?.product_id)).forEach(review => {
          if (!grouped[review.product_id]) grouped[review.product_id] = [];
          grouped[review.product_id].push(review);
        });
        setReviews(grouped);
      }
    };
    fetchReviews();
  }, [products]);

  /* ─── Filtering ─── */
  const getAvgRating = (p: Product) => {
    const list = reviews[p.id];
    if (list && list.length) return list.reduce((acc, r) => acc + (r?.rating || 0), 0) / list.length;
    return p.avgRating || 0;
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') return sortDir === 'asc' ? a.price - b.price : b.price - a.price;
    if (sortBy === 'title') return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortBy === 'rating') return sortDir === 'asc' ? (a.avgRating || 0) - (b.avgRating || 0) : (b.avgRating || 0) - (a.avgRating || 0);
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product => {
    if (categoryFilter && (product.category || "").toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (search.trim()) {
      const hay = `${product.title} ${product.description || ""}`.toLowerCase();
      if (!hay.includes(search.trim().toLowerCase())) return false;
    }
    const price = product.price || 0;
    if (minPrice && price < parseFloat(minPrice)) return false;
    if (maxPrice && price > parseFloat(maxPrice)) return false;
    if (minRating) { if (getAvgRating(product) < parseFloat(minRating)) return false; }
    return true;
  });

  /* ─── Reviews ─── */
  function handleReviewInput(productId: string, field: 'rating' | 'comment', value: string | number) {
    setReviewInputs(prev => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  }

  async function handleReviewSubmit(productId: string) {
    if (!user) return;
    const input = reviewInputs[productId];
    if (!input || !input.rating) return;
    setReviewSubmitting(prev => ({ ...prev, [productId]: true }));
    // @ts-ignore
    const { error } = await supabase.from('product_reviews').insert({ product_id: productId, user_id: user.id, rating: input.rating, comment: input.comment });
    setReviewSubmitting(prev => ({ ...prev, [productId]: false }));
    if (!error) {
      toast({ title: 'Review submitted!' });
      setReviewInputs(prev => ({ ...prev, [productId]: { rating: 5, comment: '' } }));
      const { data } = await supabase.from('product_reviews').select('*').eq('product_id', productId) as { data: ProductReviewRow[] | null; error: any };
      if (data) setReviews(prev => ({ ...prev, [productId]: data.filter((r): r is ProductReviewRow => Boolean(r?.product_id)) }));
    } else {
      toast({ title: 'Error submitting review', description: error.message, variant: 'destructive' });
    }
  }

  /* ─── Loading ─── */
  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: BG }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#ff9800]/30 border-t-[#ff9800] animate-spin" />
          <p className="text-gray-500 text-sm animate-pulse">Loading store...</p>
        </div>
      </div>
    );
  }

  /* ─── Sidebar ─── */
  const SidebarFilters = () => (
    <div className="space-y-1">
      {/* Categories */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">All Categories</h3>
      <button
        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
          categoryFilter === null ? "text-[#ff9800] bg-[#ff9800]/8 font-semibold" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
        }`}
        onClick={() => setCategoryFilter(null)}
      >
        All Products
        <span className="text-[11px] text-gray-600">{products.length}</span>
      </button>
      {shopCats.map(c => {
        const Icon = c.icon;
        const count = products.filter(p => (p.category || "").toLowerCase() === c.name.toLowerCase()).length;
        return (
          <button
            key={c.name}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2.5 ${
              categoryFilter === c.name ? "text-[#ff9800] bg-[#ff9800]/8 font-semibold" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
            }`}
            onClick={() => setCategoryFilter(prev => prev === c.name ? null : c.name)}
          >
            <Icon size={14} className={categoryFilter === c.name ? "text-[#ff9800]" : "text-gray-600"} />
            <span className="flex-1">{c.name}</span>
            <span className="text-[11px] text-gray-600">{count}</span>
          </button>
        );
      })}

      <div className="my-3 border-t" style={{ borderColor: BORDER }} />

      {/* Price Range */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Price Range</h3>
      <div className="px-3 flex items-center gap-2">
        <Input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
          className="h-8 text-xs bg-white/[0.03] border-white/[0.08] text-gray-200 placeholder:text-gray-600 focus:border-[#ff9800]/40" />
        <span className="text-gray-600 text-xs">–</span>
        <Input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
          className="h-8 text-xs bg-white/[0.03] border-white/[0.08] text-gray-200 placeholder:text-gray-600 focus:border-[#ff9800]/40" />
      </div>

      <div className="my-3 border-t" style={{ borderColor: BORDER }} />

      {/* Rating */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Rating</h3>
      <div className="px-3 flex gap-1">
        {[0, 1, 2, 3, 4].map(i => {
          const val = i === 0 ? '' : String(i);
          const isActive = minRating === val;
          return (
            <button key={i} onClick={() => setMinRating(val)}
              className={`flex items-center gap-0.5 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                isActive ? "bg-[#ff9800]/10 text-[#ff9800] border border-[#ff9800]/20" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent"
              }`}>
              {i === 0 ? "All" : <>{i}<Star size={9} className={isActive ? "fill-[#ff9800] text-[#ff9800]" : "text-gray-600"} />+</>}
            </button>
          );
        })}
      </div>

      <div className="my-3 border-t" style={{ borderColor: BORDER }} />

      <div className="px-3">
        <button onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-red-400 border hover:border-red-500/20 hover:bg-red-500/5 transition-all"
          style={{ borderColor: BORDER }}>
          <RotateCcw size={12} /> Reset Filters
        </button>
      </div>
    </div>
  );

  /* ─── Render ─── */
  return (
    <div className="min-h-screen w-full font-sans text-gray-200" style={{ background: BG }}>
      <ShopNavbar />
      <ShopHeroCarousel />

      {/* ── Category Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" id="shop-main">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
          {shopCats.map(cat => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setCategoryFilter(prev => prev === cat.name ? null : cat.name)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all duration-200 border ${
                  isActive
                    ? "border-[#ff9800]/40 bg-[#ff9800]/8 shadow-lg shadow-[#ff9800]/5"
                    : "border-transparent hover:border-white/[0.08]"
                }`}
                style={{ background: isActive ? undefined : CARD_BG }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? "bg-[#ff9800]/15" : "bg-white/[0.04]"
                }`}>
                  <Icon size={24} className={isActive ? "text-[#ff9800]" : "text-gray-400"} />
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-[#ff9800]" : "text-gray-400"}`}>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main layout: sidebar + products ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-20 h-fit">
            <div className="rounded-xl py-4 border" style={{ background: CARD_BG, borderColor: BORDER }}>
              <SidebarFilters />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-10 h-10 bg-white/[0.03] border-white/[0.08] text-gray-200 placeholder:text-gray-500 rounded-lg focus:border-[#ff9800]/40 focus:ring-[#ff9800]/10"
                  style={{ borderColor: BORDER }} />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-full sm:w-[130px] h-10 bg-white/[0.03] text-gray-300 rounded-lg text-sm" style={{ borderColor: BORDER }}>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="border" style={{ background: CARD_BG, borderColor: BORDER }}>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <button className="lg:hidden relative h-10 w-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ff9800] transition-all border"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: BORDER }}
                  onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-[#ff9800] text-[9px] font-bold text-black px-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetContent side="left" className="w-[280px] border-r" style={{ background: BG, borderColor: BORDER }}>
                <SheetHeader><SheetTitle className="text-gray-200">Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><SidebarFilters /></div>
              </SheetContent>
            </Sheet>

            {/* Results info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {categoryFilter && <span className="text-[#ff9800]"> in {categoryFilter}</span>}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-[#ff9800] hover:text-[#ff9800]/80 font-medium flex items-center gap-1">
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            {/* ── Products Grid ── */}
            <div id="products-grid" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 scroll-mt-24">
              {filteredProducts.map((product, index) => {
                const avgRating = getAvgRating(product);
                const isInWishlist = wishlist.includes(product.id);
                return (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}>

                    <div className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border"
                      style={{ background: CARD_BG, borderColor: BORDER }}>

                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <AspectRatio ratio={4 / 3}>
                          {images[product.id] ? (
                            <img src={images[product.id]} alt={product.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                              <Image className="h-8 w-8 text-gray-700" />
                            </div>
                          )}
                        </AspectRatio>

                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                          <button className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                            onClick={() => { setPreviewImg(images[product.id]); setPreviewAlt(product.title); }}>
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className={`h-9 w-9 rounded-lg backdrop-blur flex items-center justify-center transition-all border ${
                            isInWishlist ? 'bg-red-500/70 text-white border-red-400/30' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
                            onClick={() => toggleWishlist(product.id)}>
                            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                          </button>
                          <button className="h-9 w-9 rounded-lg bg-[#ff9800]/80 backdrop-blur flex items-center justify-center text-black hover:bg-[#ff9800] transition-all border border-[#ff9800]/40"
                            onClick={() => { addToCart({ ...product }); toast({ title: 'Added to cart', description: product.title }); }}>
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Category tag */}
                        {product.category && (
                          <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider font-bold text-[#ff9800] bg-black/50 backdrop-blur px-2 py-0.5 rounded border border-[#ff9800]/15">
                            {product.category}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-2">
                        <h3 className="font-medium text-sm text-gray-200 leading-snug line-clamp-2 min-h-[2.5rem]" title={product.title}>
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12}
                              className={s <= Math.round(avgRating) ? "fill-[#ff9800] text-[#ff9800]" : "text-gray-700 fill-gray-700"} />
                          ))}
                          <span className="text-[11px] text-gray-500 ml-1">({reviews[product.id]?.length || 0})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#ff9800]">
                            Ksh {product.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Expand / Actions */}
                        {expanded[product.id] ? (
                          <div className="pt-2 space-y-2.5 animate-in slide-in-from-top-2 duration-300 border-t" style={{ borderColor: BORDER }}>
                            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                              {product.description || "No description available."}
                            </p>
                            <Button size="sm" className="w-full bg-[#ff9800] hover:bg-[#ff9800]/90 text-[#160e2e] font-semibold text-xs h-8"
                              onClick={() => { addToCart({ ...product }); toast({ title: 'Added to cart', description: product.title }); }}>
                              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Add to Cart
                            </Button>
                            {product.whatsapp_number && (
                              <Button variant="outline" size="sm" className="w-full border-green-500/20 text-green-400 hover:bg-green-500/10 bg-transparent text-xs h-8"
                                onClick={() => {
                                  const url = formatPhoneForWhatsapp(product.whatsapp_number, `Hi, I'm interested in ${product.title}`, images[product.id]);
                                  if (url) window.open(url, '_blank'); else toast({ title: 'Invalid WhatsApp', variant: 'destructive' });
                                }}>
                                <Phone className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
                              </Button>
                            )}

                            {/* Reviews */}
                            <div className="pt-2 border-t" style={{ borderColor: BORDER }}>
                              <h4 className="text-[11px] font-semibold text-gray-300 mb-1.5">Reviews</h4>
                              {reviews[product.id]?.slice(0, 2).map(r => (
                                <div key={r.id} className="text-[10px] mb-1 text-gray-500 rounded px-2 py-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                  <div className="flex gap-0.5 mb-0.5">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={8} className={s <= r.rating ? "fill-[#ff9800] text-[#ff9800]" : "text-gray-700"} />)}
                                  </div>
                                  {r.comment}
                                </div>
                              ))}
                              {user && (
                                <div className="flex gap-1.5 mt-1.5">
                                  <Input className="h-7 text-[11px] bg-white/[0.03] border-white/[0.08] text-gray-200 placeholder:text-gray-600"
                                    placeholder="Write a review..." value={reviewInputs[product.id]?.comment || ''}
                                    onChange={e => handleReviewInput(product.id, 'comment', e.target.value)} />
                                  <Button size="sm" className="h-7 px-2 text-[10px] bg-[#ff9800]/15 text-[#ff9800] hover:bg-[#ff9800]/25 border border-[#ff9800]/15"
                                    onClick={() => handleReviewSubmit(product.id)}>Post</Button>
                                </div>
                              )}
                            </div>

                            <button className="w-full text-center text-[11px] text-gray-500 hover:text-gray-300 py-1 transition-colors"
                              onClick={() => toggleExpanded(product.id)}>Close Details</button>
                          </div>
                        ) : (
                          <button onClick={() => toggleExpanded(product.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-[#ff9800] border hover:border-[#ff9800]/20 hover:bg-[#ff9800]/5 transition-all"
                            style={{ borderColor: BORDER }}>
                            View Details <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border" style={{ background: CARD_BG, borderColor: BORDER }}>
                  <Search className="h-7 w-7 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-5">
                  Try adjusting your search or clearing filters to find what you're looking for.
                </p>
                <Button onClick={clearAllFilters} className="bg-[#ff9800] text-[#160e2e] font-semibold hover:bg-[#ff9800]/90 shadow-lg shadow-[#ff9800]/15">
                  <RotateCcw className="mr-2 h-4 w-4" /> Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <ImagePreviewModal open={!!previewImg} onClose={() => setPreviewImg(null)} src={previewImg} alt={previewAlt} />
    </div>
  );
}
