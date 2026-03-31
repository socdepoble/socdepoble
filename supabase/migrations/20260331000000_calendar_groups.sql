-- =========================================================
-- V12 - [SÓC DE POBLE CALENDAR SYNC MOTOR]
-- =========================================================
-- Ejecutar en el Editor SQL de Supabase (Sóc de poble - PRD)

-- 1. Crear tabla de Grupos / Calendarios Internos
CREATE TABLE IF NOT EXISTS sdb_internal_calendars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color_id TEXT DEFAULT '#169CF9',
    role_required TEXT DEFAULT 'authenticated', -- master, admin, user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Asegurar Grupos Clave Init
INSERT INTO sdb_internal_calendars (id, name, description, color_id, role_required) VALUES 
('11111111-2222-3333-4444-555555555501', 'Tú y Yo (Agent-Admin)', 'Calendario privado entre el Mestre y los Agentes', '#F97316', 'master'),
('11111111-2222-3333-4444-555555555502', 'Súperadministradores', 'Calendario técnico y logístico para súperadmins', '#8B5CF6', 'master'),
('11111111-2222-3333-4444-555555555503', 'Betatesters / Team', 'Reuniones de testing y despliegues del equipo sdb', '#10B981', 'authenticated'),
('11111111-2222-3333-4444-555555555504', 'El Rentonar', 'Eventos exclusivos asociados a la Masia El Rentonar', '#169CF9', 'authenticated'),
('11111111-2222-3333-4444-555555555505', 'Sóc de Poble (General)', 'Eventos públicos o de comunidad de Sóc de Poble', '#D946EF', 'authenticated')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    color_id = EXCLUDED.color_id, 
    role_required = EXCLUDED.role_required;

-- 3. Crear Tabla de Eventos Sincronizados
CREATE TABLE IF NOT EXISTS sdb_internal_calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calendar_id UUID REFERENCES sdb_internal_calendars(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time_start TIMESTAMP WITH TIME ZONE,
    agent_id UUID, -- Referencia opcional para mostrar a los agentes interactuando
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RLS Políticas de seguridad (Seguridad Sólida OMEGA)
ALTER TABLE sdb_internal_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdb_internal_calendar_events ENABLE ROW LEVEL SECURITY;

-- Ver calendarios
CREATE POLICY "Select on sdb_internal_calendars" 
ON sdb_internal_calendars FOR SELECT TO authenticated
USING (true);

-- Ver eventos de los calendarios disponibles
CREATE POLICY "Select on sdb_internal_calendar_events" 
ON sdb_internal_calendar_events FOR SELECT TO authenticated
USING (true);

-- Insertar eventos (Sólo authenticated/masters)
CREATE POLICY "Insert on sdb_internal_calendar_events"
ON sdb_internal_calendar_events FOR INSERT TO authenticated
WITH CHECK (true);

-- Borrar eventos (El creador o un rol 'master' via App)
CREATE POLICY "Delete on sdb_internal_calendar_events"
ON sdb_internal_calendar_events FOR DELETE TO authenticated
USING (created_by = auth.uid());

-- Triggers de Update _at
CREATE OR REPLACE FUNCTION update_sdb_events_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = EXCLUDED.updated_at;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sdb_events_modtime_trigger
BEFORE UPDATE ON sdb_internal_calendar_events
FOR EACH ROW
EXECUTE FUNCTION update_sdb_events_modtime();
