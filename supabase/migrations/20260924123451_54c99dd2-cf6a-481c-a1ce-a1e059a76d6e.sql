CREATE TYPE public.item_rarity AS ENUM ('COMMON','UNCOMMON','RARE','EPIC','LEGENDARY');

CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  image_url text,
  rarity public.item_rarity NOT NULL,
  virtual_value bigint NOT NULL CHECK (virtual_value >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.items TO anon, authenticated;
GRANT ALL ON public.items TO service_role;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view items" ON public.items FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  image_url text,
  price bigint NOT NULL CHECK (price >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cases TO anon, authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active cases" ON public.cases FOR SELECT TO anon, authenticated USING (active);

CREATE TABLE public.case_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  probability numeric(6,3) NOT NULL CHECK (probability > 0 AND probability <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (case_id, item_id)
);
CREATE INDEX case_items_case_id_idx ON public.case_items(case_id);
GRANT SELECT ON public.case_items TO anon, authenticated;
GRANT ALL ON public.case_items TO service_role;
ALTER TABLE public.case_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view case items" ON public.case_items FOR SELECT TO anon, authenticated USING (true);

-- Probabilities of each case must total exactly 100 (checked at commit time)
CREATE OR REPLACE FUNCTION public.check_case_probabilities()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE cid uuid; total numeric;
BEGIN
  cid := COALESCE(NEW.case_id, OLD.case_id);
  IF NOT EXISTS (SELECT 1 FROM public.cases WHERE id = cid) THEN RETURN NULL; END IF;
  SELECT COALESCE(SUM(probability),0) INTO total FROM public.case_items WHERE case_id = cid;
  IF total <> 100 THEN
    RAISE EXCEPTION 'Probabilities for case % must sum to 100 (got %)', cid, total;
  END IF;
  RETURN NULL;
END; $$;
CREATE CONSTRAINT TRIGGER case_items_probability_sum
AFTER INSERT OR UPDATE OR DELETE ON public.case_items
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION public.check_case_probabilities();

INSERT INTO public.items (name, description, image_url, rarity, virtual_value) VALUES
('Steel Pulse', 'Original common virtual collectible.', '/images/item-pistol.jpg', 'COMMON', 40),
('Scrap Grips', 'Original common virtual collectible.', '/images/item-gloves.jpg', 'COMMON', 50),
('Rust Blade', 'Original common virtual collectible.', '/images/item-blade.jpg', 'COMMON', 60),
('Dim Shard', 'Original common virtual collectible.', '/images/item-gem.jpg', 'COMMON', 70),
('Patrol Visor', 'Original common virtual collectible.', '/images/item-helmet.jpg', 'COMMON', 80),
('Static Sidearm', 'Original common virtual collectible.', '/images/item-pistol.jpg', 'COMMON', 90),
('Toxin Grips', 'Original uncommon virtual collectible.', '/images/item-gloves.jpg', 'UNCOMMON', 250),
('Circuit Edge', 'Original uncommon virtual collectible.', '/images/item-blade.jpg', 'UNCOMMON', 300),
('Jade Core', 'Original uncommon virtual collectible.', '/images/item-gem.jpg', 'UNCOMMON', 350),
('Scout Helm', 'Original uncommon virtual collectible.', '/images/item-helmet.jpg', 'UNCOMMON', 400),
('Volt Pistol', 'Original uncommon virtual collectible.', '/images/item-pistol.jpg', 'UNCOMMON', 450),
('Moss Knuckles', 'Original uncommon virtual collectible.', '/images/item-gloves.jpg', 'UNCOMMON', 500),
('Cryo Pulse', 'Original rare virtual collectible.', '/images/item-pistol.jpg', 'RARE', 1200),
('Frost Fang', 'Original rare virtual collectible.', '/images/item-blade.jpg', 'RARE', 1400),
('Azure Prism', 'Original rare virtual collectible.', '/images/item-gem.jpg', 'RARE', 1600),
('Tide Visor', 'Original rare virtual collectible.', '/images/item-helmet.jpg', 'RARE', 1800),
('Glacier Wraps', 'Original rare virtual collectible.', '/images/item-gloves.jpg', 'RARE', 2000),
('Ion Carver', 'Original rare virtual collectible.', '/images/item-blade.jpg', 'RARE', 2200),
('Void Edge', 'Original epic virtual collectible.', '/images/item-blade.jpg', 'EPIC', 6000),
('Nebula Shard', 'Original epic virtual collectible.', '/images/item-gem.jpg', 'EPIC', 7000),
('Phantom Helm', 'Original epic virtual collectible.', '/images/item-helmet.jpg', 'EPIC', 8000),
('Spectre Blaster', 'Original epic virtual collectible.', '/images/item-pistol.jpg', 'EPIC', 9000),
('Rift Gauntlets', 'Original epic virtual collectible.', '/images/item-gloves.jpg', 'EPIC', 10000),
('Eclipse Talon', 'Original epic virtual collectible.', '/images/item-blade.jpg', 'EPIC', 11000),
('Aurum Visor', 'Original legendary virtual collectible.', '/images/item-helmet.jpg', 'LEGENDARY', 40000),
('Solar Crown Gem', 'Original legendary virtual collectible.', '/images/item-gem.jpg', 'LEGENDARY', 48000),
('Dragonfire Edge', 'Original legendary virtual collectible.', '/images/item-blade.jpg', 'LEGENDARY', 55000),
('Genesis Cannon', 'Original legendary virtual collectible.', '/images/item-pistol.jpg', 'LEGENDARY', 62000),
('Titan Fists', 'Original legendary virtual collectible.', '/images/item-gloves.jpg', 'LEGENDARY', 70000),
('Oblivion Prism', 'Original legendary virtual collectible.', '/images/item-gem.jpg', 'LEGENDARY', 80000);
INSERT INTO public.cases (name, description, image_url, price) VALUES
('Starter Case', 'Your first step into the vault.', '/images/case-cryo.jpg', 100),
('Neon Case', 'Glowing gear from the neon district.', '/images/case-nebula.jpg', 500),
('Cyber Case', 'Cutting-edge tech arsenal.', '/images/case-cryo.jpg', 1500),
('Elite Case', 'For proven collectors only.', '/images/case-nebula.jpg', 4000),
('Legendary Case', 'The highest odds for legendary drops.', '/images/case-aurum.jpg', 10000);
INSERT INTO public.case_items (case_id, item_id, probability) VALUES
((SELECT id FROM public.cases WHERE name='Starter Case'), (SELECT id FROM public.items WHERE name='Steel Pulse'), 40),
((SELECT id FROM public.cases WHERE name='Starter Case'), (SELECT id FROM public.items WHERE name='Scrap Grips'), 20),
((SELECT id FROM public.cases WHERE name='Starter Case'), (SELECT id FROM public.items WHERE name='Toxin Grips'), 20),
((SELECT id FROM public.cases WHERE name='Starter Case'), (SELECT id FROM public.items WHERE name='Cryo Pulse'), 12),
((SELECT id FROM public.cases WHERE name='Starter Case'), (SELECT id FROM public.items WHERE name='Void Edge'), 6),
((SELECT id FROM public.cases WHERE name='Starter Case'), (SELECT id FROM public.items WHERE name='Aurum Visor'), 2),
((SELECT id FROM public.cases WHERE name='Neon Case'), (SELECT id FROM public.items WHERE name='Scrap Grips'), 35),
((SELECT id FROM public.cases WHERE name='Neon Case'), (SELECT id FROM public.items WHERE name='Rust Blade'), 20),
((SELECT id FROM public.cases WHERE name='Neon Case'), (SELECT id FROM public.items WHERE name='Circuit Edge'), 22),
((SELECT id FROM public.cases WHERE name='Neon Case'), (SELECT id FROM public.items WHERE name='Frost Fang'), 13),
((SELECT id FROM public.cases WHERE name='Neon Case'), (SELECT id FROM public.items WHERE name='Nebula Shard'), 7),
((SELECT id FROM public.cases WHERE name='Neon Case'), (SELECT id FROM public.items WHERE name='Solar Crown Gem'), 3),
((SELECT id FROM public.cases WHERE name='Cyber Case'), (SELECT id FROM public.items WHERE name='Rust Blade'), 30),
((SELECT id FROM public.cases WHERE name='Cyber Case'), (SELECT id FROM public.items WHERE name='Dim Shard'), 20),
((SELECT id FROM public.cases WHERE name='Cyber Case'), (SELECT id FROM public.items WHERE name='Jade Core'), 24),
((SELECT id FROM public.cases WHERE name='Cyber Case'), (SELECT id FROM public.items WHERE name='Azure Prism'), 15),
((SELECT id FROM public.cases WHERE name='Cyber Case'), (SELECT id FROM public.items WHERE name='Phantom Helm'), 8),
((SELECT id FROM public.cases WHERE name='Cyber Case'), (SELECT id FROM public.items WHERE name='Dragonfire Edge'), 3),
((SELECT id FROM public.cases WHERE name='Elite Case'), (SELECT id FROM public.items WHERE name='Dim Shard'), 25),
((SELECT id FROM public.cases WHERE name='Elite Case'), (SELECT id FROM public.items WHERE name='Patrol Visor'), 20),
((SELECT id FROM public.cases WHERE name='Elite Case'), (SELECT id FROM public.items WHERE name='Scout Helm'), 25),
((SELECT id FROM public.cases WHERE name='Elite Case'), (SELECT id FROM public.items WHERE name='Tide Visor'), 17),
((SELECT id FROM public.cases WHERE name='Elite Case'), (SELECT id FROM public.items WHERE name='Spectre Blaster'), 9),
((SELECT id FROM public.cases WHERE name='Elite Case'), (SELECT id FROM public.items WHERE name='Genesis Cannon'), 4),
((SELECT id FROM public.cases WHERE name='Legendary Case'), (SELECT id FROM public.items WHERE name='Patrol Visor'), 15),
((SELECT id FROM public.cases WHERE name='Legendary Case'), (SELECT id FROM public.items WHERE name='Static Sidearm'), 15),
((SELECT id FROM public.cases WHERE name='Legendary Case'), (SELECT id FROM public.items WHERE name='Volt Pistol'), 25),
((SELECT id FROM public.cases WHERE name='Legendary Case'), (SELECT id FROM public.items WHERE name='Glacier Wraps'), 22),
((SELECT id FROM public.cases WHERE name='Legendary Case'), (SELECT id FROM public.items WHERE name='Rift Gauntlets'), 15),
((SELECT id FROM public.cases WHERE name='Legendary Case'), (SELECT id FROM public.items WHERE name='Titan Fists'), 8);