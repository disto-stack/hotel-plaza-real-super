-- Seed: Initial rooms data
-- Description: Inserts initial room data for the hotel

-- Insert rooms data
-- Using ON CONFLICT to prevent duplicates if seed runs multiple times
INSERT INTO public.rooms (
    room_number,
    room_type,
    floor,
    capacity,
    price_per_night,
    price_per_hour,
    extra_person_charge_per_night,
    status,
    description,
    amenities
) VALUES
    -- Second floor
    ('201', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('202', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('203', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('204', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('205', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('206', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('207', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('208', 'double', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    
    -- Third floor
    ('302', 'familiar', 3, 3, 30000.00, 25000.00, 20000.00, 'available', 'Habitación familiar con cama individual, doble y camarotes', ARRAY['Baño privado']),
    ('303', 'familiar', 3, 6, 30000.00, 25000.00, 20000.00, 'available', 'Habitación familiar con cama individual, doble y camarotes', ARRAY['Baño privado']),
    ('304', 'familiar', 3, 8, 30000.00, 25000.00, 20000.00, 'available', 'Habitación familiar con cama individual, doble y camarotes', ARRAY['Baño privado']),
    
    -- Fourth floor
    ('401', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('402', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('403', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['']),
    ('404', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('405', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('406', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('407', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']),
    ('408', 'single', 2, 2, 30000.00, 25000.00, 10000.00, 'available', 'Habitación con cama doble', ARRAY['Baño privado']);