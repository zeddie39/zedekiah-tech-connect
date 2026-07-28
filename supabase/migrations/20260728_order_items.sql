-- 1. Create the order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Migrate existing data from orders to order_items
-- Assuming every existing order had a product_id and amount
INSERT INTO public.order_items (order_id, product_id, quantity, price_at_time)
SELECT id, product_id, 1, amount
FROM public.orders
WHERE product_id IS NOT NULL;

-- 3. Make product_id nullable in orders (so we can eventually drop it without breaking active deployments yet)
ALTER TABLE public.orders ALTER COLUMN product_id DROP NOT NULL;

-- 4. Enable Row Level Security on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.buyer_id = auth.uid()
        )
    );

-- Allow inserting for authenticated users checking out
CREATE POLICY "Users can insert their own order items" ON public.order_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.buyer_id = auth.uid()
        )
    );
