CREATE TABLE public.user_cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_cart TO authenticated;
GRANT ALL ON public.user_cart TO service_role;

ALTER TABLE public.user_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart"
  ON public.user_cart FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at_user_cart()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_user_cart_updated
  BEFORE UPDATE ON public.user_cart
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_user_cart();