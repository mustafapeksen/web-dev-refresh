CREATE TABLE
    IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL CHECK (age BETWEEN 1 AND 120),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(30),
        is_active BOOLEAN NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
    );