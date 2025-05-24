/*
  # Fix Auth Schema

  1. Changes
    - Add missing auth schema if it doesn't exist
    - Ensure auth.users table exists with required columns
    - Update profiles table to properly link with auth.users
    - Add necessary triggers for auth/profile sync

  2. Security
    - Enable RLS on profiles table
    - Add policies for profile access
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure auth.users exists (if not already created by Supabase)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    CREATE TABLE auth.users (
      id uuid NOT NULL PRIMARY KEY,
      email text,
      encrypted_password text,
      email_confirmed_at timestamp with time zone,
      invited_at timestamp with time zone,
      confirmation_token text,
      confirmation_sent_at timestamp with time zone,
      recovery_token text,
      recovery_sent_at timestamp with time zone,
      email_change_token text,
      email_change text,
      email_change_sent_at timestamp with time zone,
      last_sign_in_at timestamp with time zone,
      raw_app_meta_data jsonb,
      raw_user_meta_data jsonb,
      is_super_admin boolean,
      created_at timestamp with time zone,
      updated_at timestamp with time zone,
      phone text,
      phone_confirmed_at timestamp with time zone,
      phone_change text,
      phone_change_token text,
      phone_change_sent_at timestamp with time zone,
      confirmed_at timestamp with time zone,
      email_change_confirm_status smallint,
      banned_until timestamp with time zone,
      reauthentication_token text,
      reauthentication_sent_at timestamp with time zone,
      is_sso_user boolean DEFAULT false,
      deleted_at timestamp with time zone
    );
  END IF;
END $$;

-- Update profiles table to ensure it has correct structure
CREATE TABLE IF NOT EXISTS public.profiles_new (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_new_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_role_check CHECK (role = ANY (ARRAY['admin'::text, 'owner'::text, 'employee'::text, 'customer'::text]))
);

-- Copy data from old profiles table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO public.profiles_new (id, email, first_name, last_name, avatar_url, role, created_at, updated_at)
    SELECT id, email, first_name, last_name, avatar_url, role, created_at, updated_at
    FROM public.profiles
    ON CONFLICT (id) DO NOTHING;
    
    DROP TABLE public.profiles;
  END IF;
END $$;

-- Rename new profiles table to profiles
ALTER TABLE IF EXISTS public.profiles_new RENAME TO profiles;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();