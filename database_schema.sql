-- PostgreSQL Database Schema for Door Management System
-- Run this script to create the database and tables

-- Create database (run this first)
-- CREATE DATABASE door_management;

-- Connect to the database
-- \c door_management;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doors table
CREATE TABLE IF NOT EXISTS doors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'closed' CHECK (status IN ('open', 'closed', 'locked')),
    is_online BOOLEAN DEFAULT true,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    door_id INTEGER REFERENCES doors(id),
    door_name VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('entry', 'exit', 'denied')),
    method VARCHAR(50) NOT NULL CHECK (method IN ('pin', 'rfid', 'fingerprint', 'admin', 'system')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_doors_status ON doors(status);
CREATE INDEX IF NOT EXISTS idx_doors_online ON doors(is_online);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_activities_door_id ON activities(door_id);

-- Insert sample data
INSERT INTO users (name, email, role, password) VALUES
('John Doe', 'john@example.com', 'user', '$2b$10$example_hash_1'),
('Jane Smith', 'jane@example.com', 'user', '$2b$10$example_hash_2'),
('Admin User', 'admin@example.com', 'admin', '$2b$10$example_hash_3')
ON CONFLICT (email) DO NOTHING;

INSERT INTO doors (name, location, status, is_online) VALUES
('Main Entrance', 'Building A', 'closed', true),
('Side Door', 'Building B', 'open', true),
('Emergency Exit', 'Building C', 'locked', false),
('Back Door', 'Building D', 'closed', true)
ON CONFLICT DO NOTHING;

INSERT INTO activities (user_id, user_name, door_id, door_name, action, method) VALUES
('user1', 'John Doe', 1, 'Main Entrance', 'entry', 'pin'),
('user2', 'Jane Smith', 2, 'Side Door', 'exit', 'rfid'),
('user3', 'Bob Wilson', 3, 'Emergency Exit', 'denied', 'pin')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doors_updated_at BEFORE UPDATE ON doors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for dashboard stats
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM doors) as total_doors,
    (SELECT COUNT(*) FROM doors WHERE is_online = true) as active_doors,
    (SELECT COUNT(*) FROM doors WHERE is_online = true) as online_doors,
    (SELECT COUNT(*) FROM doors WHERE is_online = false) as offline_doors,
    (SELECT COUNT(*) FROM activities WHERE timestamp > NOW() - INTERVAL '24 hours') as recent_activity;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

COMMIT;
