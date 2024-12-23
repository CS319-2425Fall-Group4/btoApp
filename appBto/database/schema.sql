-- Create ENUM types
DO $$
BEGIN
   CREATE TYPE enum_guide_status AS ENUM ('TRAINEE', 'ACTIVE', 'INACTIVE');
   CREATE TYPE enum_tour_application_status AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED');
   CREATE TYPE enum_schedule_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
EXCEPTION
   WHEN duplicate_object THEN NULL;
END$$;

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('DIRECTOR', 'ADVISOR', 'GUIDE', 'COORDINATOR', 'ADMINISTRATOR'))
);

CREATE TABLE school (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(255) NOT NULL,
    priority INTEGER NOT NULL CHECK (priority > 0)
);

CREATE TABLE visitor (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    phone_number VARCHAR(15) NOT NULL CHECK (phone_number ~ '^\+?[0-9]{7,15}$')
);

-- individual student details related to a specific visitor.
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    visitor_id INT NOT NULL REFERENCES visitor(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    interests TEXT
);
-- details about the visit, including the associated school and visitor.
CREATE TABLE visit (
    id SERIAL PRIMARY KEY,
    visitor_id INT NOT NULL REFERENCES visitor(id) ON DELETE CASCADE,
    school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL
);

CREATE TABLE timeSlot (
    id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL REFERENCES visit(id) ON DELETE CASCADE,
    slot_time TIME NOT NULL
);

CREATE TABLE guide (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    availability BOOLEAN DEFAULT true,
    status enum_guide_status DEFAULT 'TRAINEE',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE  DEFAULT NOW()
);

CREATE TABLE tour_application (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL REFERENCES visitor(id),
    institution_id INT REFERENCES school(id),
    confirmation_code VARCHAR(255) UNIQUE,
    status enum_tour_application_status DEFAULT 'PENDING',
    preferred_dates DATE[] NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    tour_application_id INT NOT NULL REFERENCES tour_application(id),
    guide_id INT NOT NULL REFERENCES guide(id),
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status enum_schedule_status DEFAULT 'PENDING',
    advisor_approval BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dene (
    id SERIAL PRIMARY KEY
);

-- Add indexes for frequently queried fields
CREATE INDEX idx_tour_application_status ON tour_application(status);
CREATE INDEX idx_guide_status_availability ON guide(status, availability);
CREATE INDEX idx_schedule_date_status ON schedule(scheduled_date, status);

-- Add composite index for schedule conflicts
CREATE INDEX idx_schedule_guide_date ON schedule(guide_id, scheduled_date) 
WHERE status != 'CANCELLED';

-- Add index for school priority
CREATE INDEX idx_school_priority ON school(priority DESC);



