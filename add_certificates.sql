-- ============================================
-- CERTIFICATES TABLE
-- ============================================
-- 1. Create the table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE,
    credential_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS (for now, as per other tables)
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;

-- 3. Add updated_at trigger
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Add to sections table if not exists
INSERT INTO sections (name, is_visible, order_index) 
VALUES ('Certificates', true, 8)
ON CONFLICT (name) DO NOTHING;
