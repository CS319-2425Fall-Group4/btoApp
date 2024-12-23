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
    role VARCHAR(20) CHECK (role IN ('DIRECTOR', 'ADVISOR', 'GUIDE', 'COORDINATOR', 'ADMINISTRATOR')) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE school (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(255) NOT NULL,
    priority INTEGER NOT NULL CHECK (priority > 0),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE visitor (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    phone_number VARCHAR(15) NOT NULL CHECK (phone_number ~ '^\+?[0-9]{7,15}$'),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    visitor_id INT NOT NULL REFERENCES visitor(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    interests TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE visit (
    id SERIAL PRIMARY KEY,
    visitor_id INT NOT NULL REFERENCES visitor(id) ON DELETE CASCADE,
    school_id INT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "timeSlot" (
    id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL REFERENCES visit(id) ON DELETE CASCADE,
    slot_time TIME NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE guide (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    availability BOOLEAN DEFAULT true,
    status enum_guide_status DEFAULT 'TRAINEE',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE tour_application (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL REFERENCES visitor(id),
    institution_id INT REFERENCES school(id),
    confirmation_code VARCHAR(255) UNIQUE,
    status enum_tour_application_status DEFAULT 'PENDING',
    preferred_dates DATE[] NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
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
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
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

-- Insert into "user"
INSERT INTO "user" (name, email, password, role) VALUES
('John Doe', 'john.doe@example.com', 'password123', 'GUIDE'),
('Jane Smith', 'jane.smith@example.com', 'password123', 'COORDINATOR'),
('Emily Brown', 'emily.brown@example.com', 'password123', 'ADVISOR'),
('Michael Green', 'michael.green@example.com', 'password123', 'DIRECTOR'),
('Alice White', 'alice.white@example.com', 'password123', 'ADMINISTRATOR');

-- Insert into school
INSERT INTO school (name, city, priority) VALUES
('High School A', 'Ankara', 1),
('High School B', 'Istanbul', 2),
('High School C', 'Izmir', 3);

-- Insert into visitor
INSERT INTO visitor (email, phone_number) VALUES
('visitor1@example.com', '+905555555555'),
('visitor2@example.com', '+905554444444');

-- Insert into student
INSERT INTO student (visitor_id, name, interests) VALUES
(1, 'Ali Veli', 'Mathematics, Science'),
(2, 'Ayşe Fatma', 'History, Literature');

-- Insert into visit
INSERT INTO visit (visitor_id, school_id, visit_date) VALUES
(1, 1, '2024-12-01'),
(2, 2, '2024-12-02');

-- Insert into "timeSlot"
INSERT INTO "timeSlot" (visit_id, slot_time) VALUES
(1, '10:00:00'),
(1, '14:00:00'),
(2, '09:00:00');

-- Insert into guide
INSERT INTO guide (user_id, availability, status) VALUES
(1, true, 'ACTIVE'),
(2, false, 'INACTIVE');

-- Insert into tour_application
INSERT INTO tour_application (applicant_id, institution_id, confirmation_code, preferred_dates) VALUES
(1, 1, 'CONF12345', ARRAY['2024-12-01', '2024-12-05']::date[]),
(2, 2, 'CONF67890', ARRAY['2024-12-02', '2024-12-06']::date[]);


-- Insert into schedule
INSERT INTO schedule (tour_application_id, guide_id, scheduled_date, start_time, end_time, status) VALUES
(1, 1, '2024-12-01', '10:00:00', '12:00:00', 'CONFIRMED'),
(2, 2, '2024-12-02', '09:00:00', '11:00:00', 'CONFIRMED');
