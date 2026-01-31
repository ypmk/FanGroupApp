DELETE FROM merch_items;

ALTER TABLE merch_items
DROP COLUMN IF EXISTS price_cents;