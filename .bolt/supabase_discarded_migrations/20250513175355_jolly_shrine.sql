-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'owner', 'client')),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE SET NULL,
  created_at timestamp without time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "User can read own profile" ON users;

-- Create policies
CREATE POLICY "User can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    new.id,
    new.email,
    'client'  -- Default role for new users
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for performance
DROP INDEX IF EXISTS users_email_idx;
DROP INDEX IF EXISTS users_role_idx;
DROP INDEX IF EXISTS users_restaurant_idx;

CREATE INDEX users_email_idx ON users (email);
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_restaurant_idx ON users (restaurant_id);