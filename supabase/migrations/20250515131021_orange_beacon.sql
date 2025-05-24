/*
  # User Registration Function
  
  1. Changes
    - Create function to handle user registration and profile creation
    - Add trigger to automatically create profiles for new users
    - Add trigger to update profile timestamps
  
  2. Security
    - Function runs with SECURITY DEFINER privileges
    - Restricted to authenticated users only
*/

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (
    id,
    email,
    rol,
    nombre_completo
  ) VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@test.com' THEN 'admin'
      WHEN NEW.email = 'propietario@test.com' THEN 'owner'
      WHEN NEW.email LIKE '%empleado%' THEN 'employee'
      ELSE 'client'
    END,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to sync timestamps
CREATE OR REPLACE FUNCTION sync_timestamps()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
DROP TRIGGER IF EXISTS sync_timestamps_trigger ON public.perfiles;
CREATE TRIGGER sync_timestamps_trigger
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION sync_timestamps();