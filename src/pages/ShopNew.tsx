
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ShopNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        status: "pending",
      }])
      .select()
      .single();

    if (productError || !product) {
      setError("Failed to add product.");
      setLoading(false);
      return;
    }

    // Upload image if provided (simulate, since storage buckets not set up)
    if (image) {
      // In real implementation, upload to Storage, then get public URL
      // For now, we fail gracefully.
      setError("Image upload is not implemented yet.");
      setLoading(false);
      return;
    }

    // Optionally: Add to product_images table (skipped for now)

    // Redirect to shop page.
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
            <Input
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={loading}
              placeholder="Eg: Gadgets, Property, Services"
            />
          </div>
          <div>
            <Label htmlFor="image">Image (coming soon)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <div className="text-xs text-muted-foreground">
              Image upload not yet implemented.
            </div>
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
