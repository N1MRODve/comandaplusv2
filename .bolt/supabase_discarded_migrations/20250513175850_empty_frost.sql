/*
  # Restaurant Management Schema

  1. Tables
    - restaurants (basic restaurant info)
    - menu_categories (menu organization)
    - dishes (menu items)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for owner access
    - Create indexes for performance
  
  3. Views
    - public_menu_view for customer access
    - dish_detail_view for detailed dish info
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text,
  phone text,
  email text,
  logo_url text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  opening_hours jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  image_url text,
  allergens text[],
  available boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Restaurants policies
  DROP POLICY IF EXISTS "Owner can read their restaurant" ON restaurants;
  DROP POLICY IF EXISTS "Owner can insert their restaurant" ON restaurants;
  DROP POLICY IF EXISTS "Owner can update their restaurant" ON restaurants;
  DROP POLICY IF EXISTS "Owner can delete their restaurant" ON restaurants;
  
  -- Menu categories policies
  DROP POLICY IF EXISTS "Owner can read their menu categories" ON menu_categories;
  DROP POLICY IF EXISTS "Owner can insert menu categories" ON menu_categories;
  DROP POLICY IF EXISTS "Owner can update their menu categories" ON menu_categories;
  DROP POLICY IF EXISTS "Owner can delete their menu categories" ON menu_categories;
  
  -- Dishes policies
  DROP POLICY IF EXISTS "Owner can read their dishes" ON dishes;
  DROP POLICY IF EXISTS "Owner can insert dishes" ON dishes;
  DROP POLICY IF EXISTS "Owner can update their dishes" ON dishes;
  DROP POLICY IF EXISTS "Owner can delete their dishes" ON dishes;
END $$;

-- Policies for restaurants
CREATE POLICY "Owner can read their restaurant"
  ON restaurants FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can insert their restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update their restaurant"
  ON restaurants FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can delete their restaurant"
  ON restaurants FOR DELETE
  USING (auth.uid() = owner_id);

-- Policies for menu_categories
CREATE POLICY "Owner can read their menu categories"
  ON menu_categories FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = menu_categories.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can insert menu categories"
  ON menu_categories FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can update their menu categories"
  ON menu_categories FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = menu_categories.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can delete their menu categories"
  ON menu_categories FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = menu_categories.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

-- Policies for dishes
CREATE POLICY "Owner can read their dishes"
  ON dishes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = dishes.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can insert dishes"
  ON dishes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can update their dishes"
  ON dishes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = dishes.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

CREATE POLICY "Owner can delete their dishes"
  ON dishes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = dishes.restaurant_id
    AND restaurants.owner_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category_id);

-- Drop existing views if they exist
DROP VIEW IF EXISTS public_menu_view;
DROP VIEW IF EXISTS dish_detail_view;

-- Create view for public menu
CREATE VIEW public_menu_view AS
SELECT 
  d.id as dish_id,
  d.name as dish_name,
  d.description,
  d.price,
  d.image_url,
  d.allergens,
  c.id as category_id,
  c.name as category_name,
  d.restaurant_id
FROM dishes d
JOIN menu_categories c ON d.category_id = c.id
WHERE d.available = true;

-- Create view for dish details (includes category info)
CREATE VIEW dish_detail_view AS
SELECT 
  d.id as dish_id,
  d.name as dish_name,
  d.description,
  d.price,
  d.image_url,
  d.allergens,
  d.available,
  d.restaurant_id,
  c.id as category_id,
  c.name as category_name
FROM dishes d
LEFT JOIN menu_categories c ON d.category_id = c.id;