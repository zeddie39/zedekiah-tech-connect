
CREATE TABLE public.status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('order','repair_request')),
  entity_id uuid NOT NULL,
  old_status text,
  new_status text NOT NULL,
  field text NOT NULL DEFAULT 'status',
  note text,
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_history_entity ON public.status_history(entity_type, entity_id, created_at DESC);

GRANT SELECT, INSERT ON public.status_history TO authenticated;
GRANT ALL ON public.status_history TO service_role;

ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own order history"
  ON public.status_history FOR SELECT TO authenticated
  USING (
    entity_type = 'order' AND EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = status_history.entity_id AND o.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Users view own repair history"
  ON public.status_history FOR SELECT TO authenticated
  USING (
    entity_type = 'repair_request' AND EXISTS (
      SELECT 1 FROM public.repair_requests r WHERE r.id = status_history.entity_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all history"
  ON public.status_history FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'support_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'support_admin'::app_role));

CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.status_history(entity_type, entity_id, old_status, new_status, field, changed_by)
    VALUES ('order', NEW.id, NULL, COALESCE(NEW.status,'pending'), 'status', NEW.buyer_id);
    IF NEW.payment_status IS NOT NULL THEN
      INSERT INTO public.status_history(entity_type, entity_id, old_status, new_status, field, changed_by)
      VALUES ('order', NEW.id, NULL, NEW.payment_status, 'payment_status', NEW.buyer_id);
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.status_history(entity_type, entity_id, old_status, new_status, field, changed_by)
    VALUES ('order', NEW.id, OLD.status, NEW.status, 'status', auth.uid());
  END IF;
  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    INSERT INTO public.status_history(entity_type, entity_id, old_status, new_status, field, changed_by)
    VALUES ('order', NEW.id, OLD.payment_status, NEW.payment_status, 'payment_status', auth.uid());
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_log_order_status ON public.orders;
CREATE TRIGGER trg_log_order_status
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

CREATE OR REPLACE FUNCTION public.log_repair_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.status_history(entity_type, entity_id, old_status, new_status, field, changed_by)
    VALUES ('repair_request', NEW.id, NULL, COALESCE(NEW.status,'pending'), 'status', NEW.user_id);
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.status_history(entity_type, entity_id, old_status, new_status, field, changed_by)
    VALUES ('repair_request', NEW.id, OLD.status, NEW.status, 'status', auth.uid());
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_log_repair_status ON public.repair_requests;
CREATE TRIGGER trg_log_repair_status
AFTER INSERT OR UPDATE ON public.repair_requests
FOR EACH ROW EXECUTE FUNCTION public.log_repair_status_change();

ALTER TABLE public.status_history REPLICA IDENTITY FULL;
