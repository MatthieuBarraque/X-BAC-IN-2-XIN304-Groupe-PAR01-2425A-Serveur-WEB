CREATE DATABASE forum_app;

\c forum_app;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id),
    can_create_topic BOOLEAN DEFAULT FALSE,
    can_create_post BOOLEAN DEFAULT TRUE,
    can_moderate BOOLEAN DEFAULT FALSE
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    topic_id INTEGER REFERENCES topics(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (role_name) VALUES ('user'), ('moderator'), ('admin');

INSERT INTO permissions (role_id, can_create_topic, can_create_post, can_moderate)
VALUES 
(1, TRUE, TRUE, FALSE),
(2, TRUE, TRUE, TRUE),
(3, TRUE, TRUE, TRUE);
