/*
  # User Roles and Profiles Setup

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `role_id` (uuid, references roles)
      - `full_name` (text)
      - `phone` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role_id uuid REFERENCES roles ON DELETE RESTRICT,
  full_name text,
  phone text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for roles table
CREATE POLICY "Roles are viewable by authenticated users" 
  ON roles FOR SELECT 
  TO authenticated 
  USING (true);

-- Policies for user_profiles table
CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Insert default roles
INSERT INTO roles (name, description) 
VALUES 
  ('admin', 'Administrador del sistema'),
  ('owner', 'Dueño de restaurante'),
  ('employee', 'Empleado'),
  ('customer', 'Cliente')
ON CONFLICT (name) DO NOTHING;