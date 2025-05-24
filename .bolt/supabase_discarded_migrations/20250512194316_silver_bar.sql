/*
  # Fix authentication schema setup

  1. Changes
    - Drop the existing profiles table that has incorrect configuration
    - Create new profiles table with correct schema and constraints
    - Add RLS policies for proper access control
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for users to read and update their own profiles
*/

-- First, safely check and drop the existing profiles table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    DROP TABLE IF EXISTS public.profiles;
  END IF;
END $$;

-- Create the new profiles table with correct schema
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  role text DEFAULT 'customer'::text NOT NULL,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE SET NULL,

  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT role_check CHECK (role IN ('admin', 'owner', 'employee', 'customer'))
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();