CREATE TABLE school (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
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




