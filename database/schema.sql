DROP TABLE IF EXISTS stock_transactions;
DROP TABLE IF EXISTS materials;

CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  material_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  current_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
  reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_transactions (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('IN', 'OUT')),
  quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO materials
  (material_name, category, unit, current_quantity, reorder_level, unit_cost)
VALUES
  ('PET Resin', 'Raw Material', 'kg', 1250, 300, 1.45),
  ('Bottle Caps', 'Component', 'pieces', 8500, 2000, 0.03),
  ('Labels', 'Packaging', 'pieces', 4200, 1500, 0.02),
  ('Packaging Boxes', 'Packaging', 'pieces', 650, 250, 0.80);

INSERT INTO stock_transactions
  (material_id, transaction_type, quantity, notes)
VALUES
  (1, 'IN', 1250, 'Opening stock'),
  (2, 'IN', 8500, 'Opening stock'),
  (3, 'IN', 4200, 'Opening stock'),
  (4, 'IN', 650, 'Opening stock');
