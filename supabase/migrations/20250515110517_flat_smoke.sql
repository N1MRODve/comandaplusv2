/*
  # Fix pedidos table policies
  
  1. Changes
    - Drop all existing policies
    - Recreate policies with proper permissions for:
      - Clients (view/create their own orders)
      - Restaurant owners (manage their restaurant's orders)
      - Employees (view/update orders for their restaurant)
      - Admins (full access)
  
  2. Security
    - Ensure proper RLS policies
    - Add appropriate checks for each role
*/

-- First drop ALL existing policies
DROP POLICY IF EXISTS "Clients can view and create their own orders" ON pedidos;
DROP POLICY IF EXISTS "Restaurant owners can manage their restaurant's orders" ON pedidos;
DROP POLICY IF EXISTS "Employees can view and update orders" ON pedidos;
DROP POLICY IF EXISTS "Admins have full access to orders" ON pedidos;
DROP POLICY IF EXISTS "Restaurant owners can view their orders" ON pedidos;
DROP POLICY IF EXISTS "Restaurant owners can manage their own restaurants" ON pedidos;

-- Then create new policies
CREATE POLICY "allow_clients_own_orders"
ON pedidos FOR ALL
TO authenticated
USING (cliente_id = auth.uid())
WITH CHECK (cliente_id = auth.uid());

CREATE POLICY "allow_restaurant_owners_manage_orders"
ON pedidos FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurantes
    WHERE restaurantes.id = pedidos.restaurante_id
    AND restaurantes.propietario_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM restaurantes
    WHERE restaurantes.id = pedidos.restaurante_id
    AND restaurantes.propietario_id = auth.uid()
  )
);

CREATE POLICY "allow_employees_manage_orders"
ON pedidos FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM empleados
    WHERE empleados.restaurante_id = pedidos.restaurante_id
    AND empleados.perfil_id = auth.uid()
    AND empleados.esta_activo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM empleados
    WHERE empleados.restaurante_id = pedidos.restaurante_id
    AND empleados.perfil_id = auth.uid()
    AND empleados.esta_activo = true
  )
);

CREATE POLICY "allow_admins_manage_orders"
ON pedidos FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
);