/*
  # Restaurant Management Schema

  1. New Tables
    - `restaurantes`: Basic restaurant information and operating hours
    - `zonas`: Areas within restaurants
    - `mesas`: Tables in each zone
    - `pedidos`: Active and historical orders
    - `ventas`: Sales records

  2. Security
    - Enable RLS on all tables
    - Policies for restaurant owners
*/

-- Restaurantes table
CREATE TABLE IF NOT EXISTS restaurantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  direccion text NOT NULL,
  telefono text,
  email text,
  url_logo text,
  propietario_id uuid REFERENCES auth.users(id),
  horario jsonb DEFAULT '{
    "lunes": {"apertura": "09:00", "cierre": "22:00"},
    "martes": {"apertura": "09:00", "cierre": "22:00"},
    "miercoles": {"apertura": "09:00", "cierre": "22:00"},
    "jueves": {"apertura": "09:00", "cierre": "22:00"},
    "viernes": {"apertura": "09:00", "cierre": "23:00"},
    "sabado": {"apertura": "10:00", "cierre": "23:00"},
    "domingo": {"apertura": "10:00", "cierre": "22:00"}
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Zonas table
CREATE TABLE IF NOT EXISTS zonas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id uuid REFERENCES restaurantes(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text,
  created_at timestamptz DEFAULT now()
);

-- Mesas table
CREATE TABLE IF NOT EXISTS mesas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zona_id uuid REFERENCES zonas(id) ON DELETE CASCADE,
  numero text NOT NULL,
  capacidad int DEFAULT 4,
  estado text DEFAULT 'disponible',
  created_at timestamptz DEFAULT now()
);

-- Pedidos table
CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_mesa text NOT NULL,
  cliente_id uuid REFERENCES auth.users(id),
  restaurante_id uuid REFERENCES restaurantes(id),
  estado text DEFAULT 'pendiente',
  total decimal(10,2) DEFAULT 0,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT pedidos_estado_check CHECK (estado IN ('pendiente', 'preparando', 'listo', 'entregado', 'cancelado', 'completado'))
);

-- Ventas table
CREATE TABLE IF NOT EXISTS ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id uuid REFERENCES restaurantes(id),
  pedido_id uuid REFERENCES pedidos(id),
  total decimal(10,2) NOT NULL,
  metodo_pago text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE restaurantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE zonas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

-- Policies for restaurantes
CREATE POLICY "Restaurant owners can manage their own restaurants"
  ON restaurantes
  USING (propietario_id = auth.uid());

-- Policies for zonas
CREATE POLICY "Restaurant owners can manage their zones"
  ON zonas
  USING (
    restaurante_id IN (
      SELECT id FROM restaurantes WHERE propietario_id = auth.uid()
    )
  );

-- Policies for mesas
CREATE POLICY "Restaurant owners can manage their tables"
  ON mesas
  USING (
    zona_id IN (
      SELECT z.id FROM zonas z
      JOIN restaurantes r ON r.id = z.restaurante_id
      WHERE r.propietario_id = auth.uid()
    )
  );

-- Policies for pedidos
CREATE POLICY "Restaurant owners can view their orders"
  ON pedidos
  USING (
    restaurante_id IN (
      SELECT id FROM restaurantes WHERE propietario_id = auth.uid()
    )
  );

-- Policies for ventas
CREATE POLICY "Restaurant owners can view their sales"
  ON ventas
  USING (
    restaurante_id IN (
      SELECT id FROM restaurantes WHERE propietario_id = auth.uid()
    )
  );