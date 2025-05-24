/*
  # Add inventory management tables

  1. New Tables
    - inventory
      - id (uuid, primary key)
      - name (text)
      - quantity (numeric)
      - unit (text)
      - minimum_stock (numeric)
      - restaurant_id (uuid, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on inventory table
    - Add policies for restaurant owners
*/

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL,
  minimum_stock numeric NOT NULL DEFAULT 0,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Owner can read their inventory"
  ON inventory FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = inventory.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can insert inventory items"
  ON inventory FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can update their inventory"
  ON inventory FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = inventory.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can delete their inventory"
  ON inventory FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = inventory.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_restaurant ON inventory(restaurant_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();