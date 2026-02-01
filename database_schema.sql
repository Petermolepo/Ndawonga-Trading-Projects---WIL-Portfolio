-- Ndawonga Trading & Projects Database Schema
-- Run this script to create all necessary tables

CREATE DATABASE IF NOT EXISTS ndawonga_db;
USE ndawonga_db;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  year INT,
  location VARCHAR(255),
  featured_image VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenders table
CREATE TABLE IF NOT EXISTS tenders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  closing_date DATE,
  file VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team table
CREATE TABLE IF NOT EXISTS team (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  bio TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table (contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  category VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotes table (quote requests)
CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  project_type VARCHAR(100),
  area_sq_m DECIMAL(10,2) DEFAULT 0,
  complexity VARCHAR(50) DEFAULT 'medium',
  estimated_cost DECIMAL(15,2) DEFAULT 0,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table (certificates, company documents)
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(255),
  visible BOOLEAN DEFAULT TRUE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chatbot logs table
CREATE TABLE IF NOT EXISTS chatbot_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255),
  user_message TEXT,
  bot_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO team (name, position, bio) VALUES
('John Ndawonga', 'Managing Director', 'Experienced civil engineer with 15+ years in infrastructure development.'),
('Sarah Mthembu', 'Project Manager', 'Specialist in waste management and environmental compliance.'),
('Michael Khumalo', 'Site Engineer', 'Expert in road construction and earthworks projects.');

INSERT INTO projects (title, description, type, year, location, status) VALUES
('N1 Highway Rehabilitation', 'Major highway rehabilitation project covering 25km stretch', 'Roads', 2023, 'Gauteng', 'active'),
('Waste Management Facility', 'Construction of modern waste processing facility', 'Waste Management', 2023, 'KwaZulu-Natal', 'active'),
('Water Treatment Plant', 'Upgrade of municipal water treatment infrastructure', 'Water & Sanitation', 2022, 'Limpopo', 'active');

INSERT INTO documents (title, filename, visible) VALUES
('CIDB Certificate', 'cidb-certificate.pdf', TRUE),
('B-BBEE Certificate', 'bbbee-level1-certificate.pdf', TRUE),
('Company Profile', 'ndawonga-company-profile.pdf', TRUE);