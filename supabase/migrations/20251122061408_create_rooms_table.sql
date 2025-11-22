-- Migration: create_rooms_table
-- Description: Creates the rooms table for hotel room management

CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    price_per_night DECIMAL(10, 2) NOT NULL CHECK (price_per_night >= 0),
    price_per_hour DECIMAL(10, 2) NOT NULL CHECK (price_per_hour >= 0),
    extra_person_charge_per_night DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (extra_person_charge_per_night >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    description TEXT,
    amenities TEXT[],
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rooms_room_number ON public.rooms(room_number);
CREATE INDEX idx_rooms_room_type ON public.rooms(room_type);
CREATE INDEX idx_rooms_floor ON public.rooms(floor);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_rooms_capacity ON public.rooms(capacity);
CREATE INDEX idx_rooms_deleted_at ON public.rooms(deleted_at);

CREATE TRIGGER update_rooms_updated_at 
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.rooms ADD CONSTRAINT chk_rooms_status 
    CHECK (status IN ('available', 'occupied', 'out_of_order'));

ALTER TABLE public.rooms ADD CONSTRAINT chk_rooms_room_type 
    CHECK (room_type IN ('single', 'double', 'familiar'));

ALTER TABLE public.rooms ADD CONSTRAINT chk_rooms_floor 
    CHECK (floor >= 0);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all rooms" 
ON public.rooms FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND deleted_at IS NULL
);

CREATE POLICY "Only admins can insert rooms" 
ON public.rooms FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'::user_role
    )
);

CREATE POLICY "Staff can update rooms" 
ON public.rooms FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role IN ('admin'::user_role, 'receptionist'::user_role)
    )
    AND deleted_at IS NULL
);

CREATE POLICY "Only admins can delete rooms" 
ON public.rooms FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'::user_role
    )
);