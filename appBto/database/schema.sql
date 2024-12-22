CREATE TABLE school (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    city VARCHAR(255) NOT NULL,
    priority INTEGER NOT NULL
);

CREATE TABLE visitor (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL
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
    user_id INT,
    availability BOOLEAN DEFAULT true,
    status VARCHAR(10) CHECK (status IN ('TRAINEE', 'ACTIVE', 'INACTIVE')) DEFAULT 'TRAINEE',
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tour_application (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL REFERENCES visitor(id),
    institution_id INT REFERENCES school(id),
    confirmation_code VARCHAR(255) UNIQUE,
    status VARCHAR(10) CHECK (status IN ('PENDING', 'SCHEDULED', 'CANCELLED')) DEFAULT 'PENDING',
    preferred_dates DATE[] NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    tour_application_id INT NOT NULL REFERENCES tour_application(id),
    guide_id INT NOT NULL REFERENCES guide(id),
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(10) CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    advisor_approval BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);




