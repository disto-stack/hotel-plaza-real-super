-- Migration: create_occupation_types
-- Description: Creates ENUM types for the occupation system

CREATE TYPE stay_type AS ENUM (
    'hourly',
    'nightly'
);

CREATE TYPE occupation_status AS ENUM (
    'reserved',
    'checked_in',
    'checked_out',
    'cancelled'
);