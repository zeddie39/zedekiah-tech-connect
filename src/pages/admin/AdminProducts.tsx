import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { categories as shopCategories } from "@/components/ShopCategories";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ImagePlus,
  Upload,
  Package,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

/* ─── Types ─── */
type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  status: string | null;
  owner_id: string;
  whatsapp_number?: string | null;
  created_at?: string;
};

type ProductWithImage = Product & { image_url?: string | null };

/* ─── Component ─── */
export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Add / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithImage | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithImage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ─── Fetch products ─── */
  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading products", description: error.message, variant: "destructive" });
      setProducts([]);
      setLoading(false);
      return;
    }

    const list = (data || []) as Product[];
    const withImg: ProductWithImage[] = await Promise.all(
      list.map(async (p) => {
        const { data: img } = await supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", p.id);
        return { ...p, image_url: img && img.length > 0 ? img[0].image_url : null };
      })
    );
    setProducts(withImg);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Preview URLs for new images
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  /* ─── Filtering ─── */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all" && (p.category || "").toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (statusFilter !== "all" && (p.status || "") !== statusFilter) return false;
      if (search.trim()) {
        const hay = `${p.title} ${p.description || ""}`.toLowerCase();
        if (!hay.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [products, categoryFilter, statusFilter, search]);

  /* ─── Open Add modal ─── */
  function openAddModal() {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory(undefined);
    setWhatsappNumber("");
    setImageFiles([]);
    setExistingImageUrl(null);
    setModalOpen(true);
  }

  /* ─── Open Edit modal ─── */
  function openEditModal(product: ProductWithImage) {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setCategory(product.category || undefined);
    setWhatsappNumber(product.whatsapp_number || "");
    setImageFiles([]);
    setExistingImageUrl(product.image_url || null);
    setModalOpen(true);
  }

  /* ─── Submit (Add or Edit) ─── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Not authenticated", variant: "destructive" });
      setFormLoading(false);
      return;
    }

    if (editingProduct) {
      // ── UPDATE existing product ──
      const { error: updateError } = await supabase
        .from("products")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          price: Number(price),
          category: category || null,
          whatsapp_number: whatsappNumber || null,
        })
        .eq("id", editingProduct.id);

      if (updateError) {
        toast({ title: "Failed to update product", description: updateError.message, variant: "destructive" });
        setFormLoading(false);
        return;
      }

      // Upload new images if selected
      if (imageFiles.length > 0) {
        // Delete old images from product_images table
        await supabase.from("product_images").delete().eq("product_id", editingProduct.id);

        for (const file of imageFiles) {
          const fileExt = file.name.split(".").pop();
          const filePath = `products/${editingProduct.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
          if (uploadError) {
            toast({ title: `Upload failed: ${file.name}`, variant: "destructive" });
            setFormLoading(false);
            return;
          }
          const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
          if (data?.publicUrl) {
            const { error: insertImgErr } = await supabase.from("product_images").insert([{ product_id: editingProduct.id, image_url: data.publicUrl }]);
            if (insertImgErr) {
              console.error("Failed to insert image record:", insertImgErr);
              toast({ title: "Image link failed", description: insertImgErr.message, variant: "destructive" });
            }
          }
        }
      }

      toast({ title: "Product updated successfully!" });
    } else {
      // ── CREATE new product (auto-approved) ──
      if (imageFiles.length === 0) {
        toast({ title: "Please select at least one image", variant: "destructive" });
        setFormLoading(false);
        return;
      }

      const { data: product, error: insertError } = await supabase
        .from("products")
        .insert([{
          owner_id: session.user.id,
          title: title.trim(),
          description: description.trim() || null,
          price: Number(price),
          category: category || null,
          status: "approved", // Admin products are auto-approved
          whatsapp_number: whatsappNumber || null,
        }])
        .select()
        .single();

      if (insertError || !product) {
        toast({ title: "Failed to add product", description: insertError?.message, variant: "destructive" });
        setFormLoading(false);
        return;
      }

      // Upload images
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const filePath = `products/${product.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
        if (uploadError) {
          toast({ title: `Upload failed: ${file.name}`, variant: "destructive" });
          setFormLoading(false);
          return;
        }
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          const { error: insertImgErr } = await supabase.from("product_images").insert([{ product_id: product.id, image_url: data.publicUrl }]);
          if (insertImgErr) {
            console.error("Failed to insert image record:", insertImgErr);
            toast({ title: "Image linked failed", description: insertImgErr.message, variant: "destructive" });
          }
        }
      }

      toast({ title: "Product added and published!" });
    }

    setModalOpen(false);
    setFormLoading(false);
    fetchProducts();
  }

  /* ─── Delete product ─── */
  async function handleDelete() {
    if (!deletingProduct) return;
    setDeleteLoading(true);

    // Delete product images from table
    await supabase.from("product_images").delete().eq("product_id", deletingProduct.id);

    // Delete product reviews
    // @ts-ignore
    await supabase.from("product_reviews").delete().eq("product_id", deletingProduct.id);

    // Delete the product itself
    const { error } = await supabase.from("products").delete().eq("id", deletingProduct.id);

    if (error) {
      toast({ title: "Failed to delete product", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted successfully" });
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    }

    setDeleteLoading(false);
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  }

  /* ─── Status badge ─── */
  function statusBadge(status: string | null) {
    const s = status || "unknown";
    const styles: Record<string, string> = {
      approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
      rejected: "bg-red-500/15 text-red-400 border-red-500/25",
      unknown: "bg-gray-500/15 text-gray-400 border-gray-500/25",
    };
    return (
      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${styles[s] || styles.unknown}`}>
        {s}
      </span>
    );
  }

  const canSubmit = !!title.trim() && !!price && !!category && (editingProduct || imageFiles.length > 0) && !formLoading;

  /* ─── Render ─── */
  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Package className="w-6 h-6 text-accent" />
            Product Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Add, edit, and manage all shop products</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 bg-accent hover:bg-accent/90 text-black font-bold shadow-lg shadow-accent/20">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background/50 border-accent/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background/50 border-accent/20">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {shopCategories.map((c) => (
              <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-accent/20">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", count: products.length, color: "text-blue-400" },
          { label: "Approved", count: products.filter((p) => p.status === "approved").length, color: "text-emerald-400" },
          { label: "Pending", count: products.filter((p) => p.status === "pending").length, color: "text-amber-400" },
          { label: "Rejected", count: products.filter((p) => p.status === "rejected").length, color: "text-red-400" },
        ].map((stat) => (
          <Card key={stat.label} className="p-3 bg-card/80 border-accent/15">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
          </Card>
        ))}
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-40">
          <Loader2 className="animate-spin text-accent" size={28} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No products found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your filters or add a new product</p>
          <Button onClick={openAddModal} variant="outline" className="mt-4 gap-2 border-accent/30 hover:bg-accent/10">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden bg-card/90 border-accent/15 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/5">
              {/* Image */}
              <div className="relative h-40 bg-muted/30 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                )}
                {/* Status badge overlay */}
                <div className="absolute top-2 left-2">{statusBadge(product.status)}</div>
                {/* Category */}
                {product.category && (
                  <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-bold text-accent bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-accent/20">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <h3 className="font-semibold text-sm truncate" title={product.title}>{product.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description || "No description"}</p>
                <p className="text-base font-bold text-accent">Ksh {product.price.toLocaleString()}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-accent/10">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5 text-xs h-8 border-accent/20 hover:bg-accent/10 hover:text-accent"
                    onClick={() => openEditModal(product)}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-8 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
                    onClick={() => { setDeletingProduct(product); setDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Add / Edit Dialog ─── */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!formLoading) setModalOpen(open); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingProduct ? <Pencil className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-accent" />}
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the product details below. Leave the image field empty to keep the current image."
                : "Fill in the product details. Products added here are automatically approved and published."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* Title & Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="admin-title" className="text-sm font-medium">Product Title <span className="text-red-500">*</span></Label>
                <Input
                  id="admin-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={formLoading}
                  placeholder="e.g. MacBook Pro M1 2020"
                  className="bg-background/50 border-accent/20 focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-price" className="text-sm font-medium">Price (Ksh) <span className="text-red-500">*</span></Label>
                <Input
                  id="admin-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  disabled={formLoading}
                  className="bg-background/50 border-accent/20 focus-visible:ring-accent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category <span className="text-red-500">*</span></Label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="w-full bg-background/50 border-accent/20 focus:ring-accent">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {shopCategories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="admin-desc" className="text-sm font-medium">Description</Label>
              <Textarea
                id="admin-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={formLoading}
                rows={4}
                placeholder="Describe the product specs, condition, features..."
                className="bg-background/50 border-accent/20 focus-visible:ring-accent resize-none"
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex justify-between">
                <span>Product Images {!editingProduct && <span className="text-red-500">*</span>}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {editingProduct ? "Upload to replace current image" : "Required — max 4 images"}
                </span>
              </Label>

              {/* Current image for editing */}
              {editingProduct && existingImageUrl && imageFiles.length === 0 && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-accent/20 bg-muted">
                  <img src={existingImageUrl} alt="Current" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-white py-0.5">Current</span>
                </div>
              )}

              <div
                className="group relative border-2 border-dashed border-accent/30 rounded-xl bg-muted/20 p-6 text-center hover:bg-accent/5 hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm font-medium">Click to upload images</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])}
                disabled={formLoading}
                className="hidden"
              />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-accent/20 bg-background">
                      <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="admin-whatsapp" className="text-sm font-medium">
                WhatsApp Number <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="admin-whatsapp"
                placeholder="254712345678"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                disabled={formLoading}
                className="bg-background/50 border-accent/20 focus-visible:ring-accent"
              />
            </div>

            {/* Footer */}
            <DialogFooter className="gap-2 pt-4 border-t border-accent/10">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit} className="bg-accent text-black hover:bg-accent/90 font-bold gap-2 min-w-[140px] shadow-lg shadow-accent/20">
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {formLoading ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!deleteLoading) setDeleteDialogOpen(open); }}>
        <DialogContent className="max-w-md bg-card border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{deletingProduct?.title}</strong>? This action cannot be undone. All associated images and reviews will also be removed.
            </DialogDescription>
          </DialogHeader>

          {deletingProduct?.image_url && (
            <div className="w-full h-32 rounded-lg overflow-hidden border border-red-500/20 bg-muted/30">
              <img src={deletingProduct.image_url} alt={deletingProduct.title} className="w-full h-full object-cover opacity-70" />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="gap-2 font-bold"
            >
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleteLoading ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
