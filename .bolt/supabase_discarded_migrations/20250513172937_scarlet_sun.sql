/*
  # Set up authentication schema

  1. Changes
    - Enable auth schema extensions
    - Create auth schema if it doesn't exist
    - Create auth.users table for Supabase authentication
    - Add necessary RLS policies

  2. Security
    - Enable RLS on auth.users table
    - Add policies for user management
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
  ) THEN
    CREATE TABLE auth.users (
      id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
      email text NOT NULL UNIQUE,
      encrypted_password text NOT NULL,
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
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now(),
      phone text,
      phone_confirmed_at timestamp with time zone,
      phone_change text,
      phone_change_token text,
      phone_change_sent_at timestamp with time zone,
      confirmed_at timestamp with time zone GENERATED ALWAYS AS (
        LEAST(email_confirmed_at, phone_confirmed_at)
      ) STORED,
      email_change_confirm_status smallint,
      banned_until timestamp with time zone,
      reauthentication_token text,
      reauthentication_sent_at timestamp with time zone,
      is_sso_user boolean NOT NULL DEFAULT false,
      deleted_at timestamp with time zone
    );

    -- Enable RLS
    ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view own user data." ON auth.users
      FOR SELECT TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Users can update own user data." ON auth.users
      FOR UPDATE TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;