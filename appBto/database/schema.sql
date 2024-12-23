-- Connect to database
\c pern_db;

-- Create ENUM types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_guide_status') THEN
        CREATE TYPE enum_guide_status AS ENUM ('TRAINEE', 'ACTIVE', 'INACTIVE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_tour_application_status') THEN
        CREATE TYPE enum_tour_application_status AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_schedule_status') THEN
        CREATE TYPE enum_schedule_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
    END IF;
END$$;

-- Create user table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('DIRECTOR', 'ADVISOR', 'GUIDE', 'COORDINATOR', 'ADMINISTRATOR')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT INTO "user" (email, password, role) 
VALUES 
    ('test@bilkent.edu.tr', 'password123', 'GUIDE'),
    ('admin@bilkent.edu.tr', 'admin123', 'ADMINISTRATOR'),
    ('coordinator@bilkent.edu.tr', 'coord123', 'COORDINATOR')
ON CONFLICT (email) DO NOTHING;
