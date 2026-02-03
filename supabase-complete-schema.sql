-- COMPLETE DATABASE SCHEMA FOR PORTFOLIO
-- Run this in your Supabase SQL Editor to create all necessary tables

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. BLOGS TABLE
-- ============================================
DROP TABLE IF EXISTS blogs CASCADE;

CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    read_time TEXT NOT NULL DEFAULT '5 min read',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. EXPERIMENTS TABLE
-- ============================================
DROP TABLE IF EXISTS experiments CASCADE;

CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    notebook_url TEXT,
    dataset_url TEXT,
    status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. MESSAGES TABLE
-- ============================================
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. SECTIONS TABLE
-- ============================================
DROP TABLE IF EXISTS sections CASCADE;

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    is_visible BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default sections (matching frontend section names)
INSERT INTO sections (name, is_visible, order_index) VALUES
    ('Hero', true, 1),
    ('About', true, 2),
    ('Skills', true, 3),
    ('Projects', true, 4),
    ('Data Science Lab', true, 5),
    ('Blog', true, 6),
    ('Contact', true, 7)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- DISABLE RLS FOR ALL TABLES (for debugging)
-- You can enable it later with proper policies
-- ============================================
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiments DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE sections DISABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiments_updated_at
    BEFORE UPDATE ON experiments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample project
INSERT INTO projects (title, category, tech_stack, description, github_url, live_url, image_url, status) VALUES
    ('Sample Portfolio Project', 'Full Stack', ARRAY['React', 'Next.js', 'Tailwind CSS'], 'A beautiful portfolio website built with modern technologies.', 'https://github.com/yourusername/portfolio', 'https://yourportfolio.com', '', 'active')
ON CONFLICT DO NOTHING;

-- Sample blog post
INSERT INTO blogs (title, slug, category, content, read_time, status) VALUES
    ('Getting Started with Next.js', 'getting-started-with-nextjs', 'Tech', 'Next.js is a powerful React framework...', '5 min read', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Sample experiment
INSERT INTO experiments (title, description, tech_stack, notebook_url, dataset_url, status) VALUES
    ('Customer Churn Prediction', 'Predicting customer churn using machine learning algorithms.', ARRAY['Python', 'Scikit-learn', 'Pandas'], 'https://colab.research.google.com/...', 'https://kaggle.com/...', 'Completed')
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. SITE SETTINGS TABLE (for Resume Management)
-- ============================================
DROP TABLE IF EXISTS site_settings CASCADE;

CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_url TEXT,
    resume_filename TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial empty row
INSERT INTO site_settings (resume_url, resume_filename) VALUES (NULL, NULL);

-- Disable RLS for site_settings
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Add updated_at trigger for site_settings
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
