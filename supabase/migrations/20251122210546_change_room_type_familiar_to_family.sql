-- Migration: change_room_type_familiar_to_family
-- Description: Changes room_type from 'familiar' to 'family' to use correct English terminology

ALTER TABLE public.rooms 
DROP CONSTRAINT IF EXISTS chk_rooms_room_type;

UPDATE public.rooms 
SET room_type = 'family' 
WHERE room_type = 'familiar';

ALTER TABLE public.rooms 
ADD CONSTRAINT chk_rooms_room_type 
    CHECK (room_type IN ('single', 'double', 'family'));