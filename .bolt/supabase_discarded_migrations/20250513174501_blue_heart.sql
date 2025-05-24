/*
  # Fix profile roles constraint

  1. Changes
    - Update the role check constraint in profiles table to match users table roles
    - Add 'client' role to allowed values
    - Remove 'employee' and 'customer' roles that aren't used

  2. Security
    - No changes to RLS policies
    - Only modifies the check constraint
*/

DO $$ 
BEGIN
  -- Drop the existing role_check constraint
  ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS role_check;

  -- Add the new constraint with updated roles
  ALTER TABLE profiles 
  ADD CONSTRAINT role_check 
  CHECK (role = ANY (ARRAY['admin'::text, 'owner'::text, 'client'::text]));

  -- Update any existing 'customer' roles to 'client'
  UPDATE profiles 
  SET role = 'client' 
  WHERE role = 'customer';
END $$;