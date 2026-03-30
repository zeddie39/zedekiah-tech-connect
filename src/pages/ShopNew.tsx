import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { categories as shopCategories } from "@/components/ShopCategories";
import { toast } from "@/components/ui/use-toast";
import { ImagePlus, Upload, Loader2 } from "lucide-react";
import ShopNavbar from "@/components/ShopNavbar";

export default function ShopNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]); // Multiple images
  const [previews, setPreviews] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate and cleanup object URLs for selected images
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  const canSubmit = useMemo(() => {
    return !!title.trim() && !!price && !!category && images.length > 0 && !loading;
  }, [title, price, category, images, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (images.length === 0) {
      setError("Please select at least one image.");
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to post.");
      setLoading(false);
      return;
    }

    // Insert product first (status=pending for admin approval)
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([{
        owner_id: session.user.id,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category: category || null,
        status: "pending",
        whatsapp_number: whatsappNumber || null,
      }])
      .select()
      .single();

    if (productError || !product) {
      setError(productError?.message || "Failed to add product.");
      setLoading(false);
      return;
    }

    // Upload each image to Supabase Storage
    const uploadedUrls: string[] = [];
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const filePath = `products/${product.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) {
        setError(`Failed to upload image: ${file.name}`);
        setLoading(false);
        return;
      }
      // Get public URL
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      if (!data?.publicUrl) {
        setError("Failed to get image URL.");
        setLoading(false);
        return;
      }
      uploadedUrls.push(data.publicUrl);
    }

    // Insert image URLs into product_images table
    for (const url of uploadedUrls) {
      const { error: imgInsertError } = await supabase
        .from('product_images')
        .insert([{ product_id: product.id, image_url: url }]);
      if (imgInsertError) {
        setError("Failed to save image info to database.");
        setLoading(false);
        return;
      }
    }

    toast({
      title: "Product Submitted",
      description: "Your product is pending admin approval and will be visible once approved.",
      duration: 3500,
    });
    navigate("/shop");
  }

  return (
    <>
      <ShopNavbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="overflow-hidden border border-accent/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-lg">
          {/* Header */}
          <div className="px-6 py-6 bg-gradient-to-r from-primary/95 to-primary/80 border-b border-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
            <div className="relative z-10">
              <div className="text-secondary/80 text-xs font-semibold uppercase tracking-wider mb-1">Seller Zone</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Add New Product</h1>
              <p className="text-primary-foreground/70 text-sm mt-1">List your tech item for thousands of buyers.</p>
            </div>
          </div>

          {/* Form */}
          <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Title and Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Product Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="e.g. MacBook Pro M1 2020"
                  className="bg-background/50 backdrop-blur border-accent/20 focus-visible:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">Price (Ksh)</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  disabled={loading}
                  className="bg-background/50 backdrop-blur border-accent/20 focus-visible:ring-accent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="w-full bg-background/50 backdrop-blur border-accent/20 focus:ring-accent">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {shopCategories.map(cat => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-medium">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={loading}
                rows={5}
                placeholder="Describe the condition, specs, and any defects..."
                className="bg-background/50 backdrop-blur border-accent/20 focus-visible:ring-accent resize-none"
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex justify-between">
                <span>Product Images <span className='text-red-500'>*</span></span>
                <span className="text-xs text-muted-foreground font-normal">Max 4 images</span>
              </Label>

              <div
                className="group relative border-2 border-dashed border-accent/30 rounded-xl bg-muted/30 p-8 text-center hover:bg-accent/5 hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max 800x400px)</p>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                id="images"
                type="file"
                accept="image/*"
                title="Upload Product Images"
                aria-label="Upload Product Images"
                multiple
                required
                onChange={e => setImages(e.target.files ? Array.from(e.target.files) : [])}
                disabled={loading}
                className="hidden"
              />

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-accent/20 bg-background shadow-sm hover:ring-2 hover:ring-accent transition-all">
                      <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold drop-shadow-md">Image {idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">WA</span>
                <Input
                  id="whatsapp"
                  placeholder="254712345678"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  disabled={loading}
                  className="pl-10 bg-background/50 backdrop-blur border-accent/20 focus-visible:ring-accent"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Buyers can contact you directly via WhatsApp if provided.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent/10">
              <Button type="button" variant="ghost" onClick={() => navigate("/shop")} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 min-w-[140px]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                {loading ? "Publishing..." : "Publish Product"}
              </Button>
            </div>
          </form>
        </Card>
        <div className="text-center mt-6 text-xs text-muted-foreground">
          By publishing, you agree to our Terms of Service. All listings are reviewed.
        </div>
      </div>
    </>
  );
}
