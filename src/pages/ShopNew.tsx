import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { categories as shopCategories } from "@/components/ShopCategories";

export default function ShopNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]); // Multiple images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Require at least one image
    if (images.length === 0) {
      setError("Please select at least one image.");
      setLoading(false);
      return;
    }

    // Get logged in session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to post.");
      setLoading(false);
      return;
    }

    // Insert product first
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([{
        owner_id: session.user.id,
        title,
        description,
        price: Number(price),
        category,
        status: "approved", // changed from pending to approved
      }])
      .select()
      .single();

    if (productError || !product) {
      setError("Failed to add product.");
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

    // Redirect to shop page
    navigate("/shop");
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              type="number"
              min={0}
              step="0.01"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              disabled={loading}
              className="w-full border rounded px-3 py-2 bg-background text-foreground"
            >
              <option value="" disabled>Select a category</option>
              {shopCategories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="images">Images <span className='text-red-500'>*</span></Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              required
              onChange={e => setImages(e.target.files ? Array.from(e.target.files) : [])}
              disabled={loading}
            />
            <div className="text-xs text-muted-foreground">
              You must select at least one image. Multiple images allowed.
            </div>
            {images.length > 0 && (
              <ul className="mt-2 text-xs text-green-600">
                {images.map((img, idx) => (
                  <li key={idx}>{img.name}</li>
                ))}
              </ul>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Add Product"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/shop")} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
