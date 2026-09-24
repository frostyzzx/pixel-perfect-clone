DROP FUNCTION public.open_case(uuid);

CREATE OR REPLACE FUNCTION public.open_case(_user_id uuid, _case_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _case public.cases%ROWTYPE;
  _balance bigint;
  _roll numeric;
  _acc numeric := 0;
  _item_id uuid;
  _opening_id uuid;
  _rec record;
  _item public.items%ROWTYPE;
BEGIN
  IF _user_id IS NULL THEN RAISE EXCEPTION 'NOT_AUTHENTICATED'; END IF;

  SELECT * INTO _case FROM public.cases WHERE id = _case_id AND active;
  IF NOT FOUND THEN RAISE EXCEPTION 'CASE_NOT_FOUND'; END IF;

  SELECT balance INTO _balance FROM public.profiles WHERE id = _user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'PROFILE_NOT_FOUND'; END IF;
  IF _balance < _case.price THEN RAISE EXCEPTION 'INSUFFICIENT_BALANCE'; END IF;

  UPDATE public.profiles SET balance = balance - _case.price WHERE id = _user_id;

  _roll := (('x' || encode(extensions.gen_random_bytes(6), 'hex'))::bit(48)::bigint)::numeric / 281474976710656 * 100;

  FOR _rec IN SELECT item_id, probability FROM public.case_items WHERE case_id = _case_id ORDER BY id LOOP
    _acc := _acc + _rec.probability;
    _item_id := _rec.item_id;
    EXIT WHEN _roll < _acc;
  END LOOP;
  IF _item_id IS NULL THEN RAISE EXCEPTION 'CASE_EMPTY'; END IF;

  INSERT INTO public.case_openings (user_id, case_id, item_id, cost)
  VALUES (_user_id, _case_id, _item_id, _case.price) RETURNING id INTO _opening_id;

  INSERT INTO public.inventory_items (user_id, item_id, case_opening_id) VALUES (_user_id, _item_id, _opening_id);

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (_user_id, 'CASE_OPEN', -_case.price, 'Opened ' || _case.name);

  SELECT * INTO _item FROM public.items WHERE id = _item_id;

  RETURN jsonb_build_object(
    'opening_id', _opening_id,
    'balance', _balance - _case.price,
    'item', jsonb_build_object('id', _item.id, 'name', _item.name, 'image_url', _item.image_url,
                               'rarity', _item.rarity, 'virtual_value', _item.virtual_value)
  );
END; $$;

REVOKE ALL ON FUNCTION public.open_case(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.open_case(uuid, uuid) TO service_role;