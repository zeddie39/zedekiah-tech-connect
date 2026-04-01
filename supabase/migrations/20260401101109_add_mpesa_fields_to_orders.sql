
-- Add M-Pesa tracking columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_request_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS mpesa_receipt TEXT;

-- Index for fast lookup by callback
CREATE INDEX IF NOT EXISTS idx_orders_checkout_request_id ON public.orders(checkout_request_id);
