/*
  # Create admin user

  1. Changes
    - Creates an admin user with email and password
    - Sets up proper authentication fields
    - Ensures idempotency by checking if user exists first
  
  2. Security
    - Password is properly hashed using bcrypt
    - User is created with confirmed email
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'owner', 'employee', 'customer')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Insert admin user if not exists
DO $$ 
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'dieterlorenzo@icloud.com'
  ) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      confirmation_token,
      recovery_token,
      aud
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'dieterlorenzo@icloud.com',
      crypt('d15759280', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      true,
      'authenticated',
      '',
      '',
      'authenticated'
    );

    -- Insert corresponding profile
    INSERT INTO public.profiles (
      id,
      email,
      role,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      'dieterlorenzo@icloud.com',
      'admin',
      now(),
      now()
    );
  END IF;
END $$;