ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_status text NOT NULL DEFAULT 'in_stock';

CREATE OR REPLACE FUNCTION public.validate_product_stock_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.stock_status NOT IN ('in_stock','low_stock','out_of_stock') THEN
    RAISE EXCEPTION 'Invalid stock_status: %', NEW.stock_status;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.validate_product_stock_status() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_validate_product_stock_status ON public.products;
CREATE TRIGGER trg_validate_product_stock_status
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.validate_product_stock_status();