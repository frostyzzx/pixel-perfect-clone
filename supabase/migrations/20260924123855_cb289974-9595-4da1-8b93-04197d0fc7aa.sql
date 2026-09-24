CREATE TABLE public.case_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid NOT NULL REFERENCES public.cases(id),
  item_id uuid NOT NULL REFERENCES public.items(id),
  cost bigint NOT NULL CHECK (cost >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX case_openings_user_idx ON public.case_openings(user_id, created_at DESC);
GRANT SELECT ON public.case_openings TO authenticated;
GRANT ALL ON public.case_openings TO service_role;
ALTER TABLE public.case_openings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own openings" ON public.case_openings FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  amount bigint NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX transactions_user_idx ON public.transactions(user_id, created_at DESC);
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_id uuid NOT NULL REFERENCES public.items(id),
  case_opening_id uuid REFERENCES public.case_openings(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inventory_items_user_idx ON public.inventory_items(user_id, created_at DESC);
GRANT SELECT ON public.inventory_items TO authenticated;
GRANT ALL ON public.inventory_items TO service_role;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own inventory" ON public.inventory_items FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_balance_non_negative;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_balance_non_negative CHECK (balance >= 0);

-- Atomic, server-side case opening. Uses only database values; client supplies just the case id.
CREATE OR REPLACE FUNCTION public.open_case(_case_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _case public.cases%ROWTYPE;
  _balance bigint;
  _roll numeric;
  _acc numeric := 0;
  _item_id uuid;
  _opening_id uuid;
  _rec record;
  _item public.items%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'NOT_AUTHENTICATED'; END IF;

  SELECT * INTO _case FROM public.cases WHERE id = _case_id AND active;
  IF NOT FOUND THEN RAISE EXCEPTION 'CASE_NOT_FOUND'; END IF;

  -- Row lock serializes concurrent openings for the same user (prevents double spending)
  SELECT balance INTO _balance FROM public.profiles WHERE id = _uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'PROFILE_NOT_FOUND'; END IF;
  IF _balance < _case.price THEN RAISE EXCEPTION 'INSUFFICIENT_BALANCE'; END IF;

  UPDATE public.profiles SET balance = balance - _case.price WHERE id = _uid;

  -- Cryptographically secure roll in [0, 100)
  _roll := (('x' || encode(extensions.gen_random_bytes(6), 'hex'))::bit(48)::bigint)::numeric / 281474976710656 * 100;

  FOR _rec IN SELECT item_id, probability FROM public.case_items WHERE case_id = _case_id ORDER BY id LOOP
    _acc := _acc + _rec.probability;
    _item_id := _rec.item_id;
    EXIT WHEN _roll < _acc;
  END LOOP;
  IF _item_id IS NULL THEN RAISE EXCEPTION 'CASE_EMPTY'; END IF;

  INSERT INTO public.case_openings (user_id, case_id, item_id, cost)
  VALUES (_uid, _case_id, _item_id, _case.price) RETURNING id INTO _opening_id;

  INSERT INTO public.inventory_items (user_id, item_id, case_opening_id) VALUES (_uid, _item_id, _opening_id);

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (_uid, 'CASE_OPEN', -_case.price, 'Opened ' || _case.name);

  SELECT * INTO _item FROM public.items WHERE id = _item_id;

  RETURN jsonb_build_object(
    'opening_id', _opening_id,
    'balance', _balance - _case.price,
    'item', jsonb_build_object('id', _item.id, 'name', _item.name, 'image_url', _item.image_url,
                               'rarity', _item.rarity, 'virtual_value', _item.virtual_value)
  );
END; $$;

REVOKE ALL ON FUNCTION public.open_case(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.open_case(uuid) TO authenticated;