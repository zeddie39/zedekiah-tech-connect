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
    <div className="max-w-2xl mx-auto py-8">
      <Card className="overflow-hidden border border-accent/30 rounded-2xl bg-card/90 shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 border-b border-accent/30">
          <div className="text-primary-foreground/80 text-xs">Submit product for approval</div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-primary-foreground">Add New Product</h1>
        </div>

        {/* Form */}
        <form className="p-4 sm:p-6 space-y-4" onSubmit={handleSubmit}>
          {/* Title and Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-sm">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                disabled={loading}
                placeholder="e.g., Samsung Galaxy S10"
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-sm">Price (Ksh)</Label>
              <Input
                id="price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                type="number"
                min={0}
                step="0.01"
                disabled={loading}
                className="bg-background"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger className="w-full">
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
          <div>
            <Label htmlFor="desc" className="text-sm">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="Describe the product, condition, features..."
              className="bg-background"
            />
            <div className="text-[11px] text-muted-foreground mt-1">Provide helpful details to improve visibility and trust.</div>
          </div>

          {/* Images */}
          <div>
            <Label className="text-sm">Images <span className='text-red-500'>*</span></Label>
            <div className="mt-2">
              <div
                className="rounded-xl border border-accent/30 bg-muted/40 p-4 flex items-center justify-center text-sm text-muted-foreground cursor-pointer hover:border-accent/60"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                aria-label="Upload images"
              >
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-accent" />
                  <span>Click to select images (multiple allowed)</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                id="images"
                type="file"
                accept="image/*"
                multiple
                required
                onChange={e => setImages(e.target.files ? Array.from(e.target.files) : [])}
                disabled={loading}
                className="hidden"
              />
              {images.length === 0 && (
                <div className="mt-2 text-[11px] text-muted-foreground">You must select at least one image.</div>
              )}
              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative rounded-md overflow-hidden border border-accent/20 bg-background">
                      <img src={src} alt={`Preview ${idx+1}`} className="w-full h-20 object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <Label htmlFor="whatsapp" className="text-sm">WhatsApp Number (optional)</Label>
            <Input
              id="whatsapp"
              placeholder="254712345678 or +254712345678"
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              disabled={loading}
              className="bg-background"
            />
            <div className="text-[11px] text-muted-foreground">Include country code (e.g., 254 for Kenya). We'll format links on the site for you.</div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={!canSubmit} className="inline-flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
              {loading ? "Posting..." : "Submit for Approval"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/shop")} disabled={loading}>
              Cancel
            </Button>
            <div className="text-[11px] text-muted-foreground self-center">
              Submitted products require admin approval before appearing in the shop.
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
