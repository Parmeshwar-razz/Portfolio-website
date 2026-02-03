-- Create skill_categories table
CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for simplicity (consistent with other tables)
ALTER TABLE skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;

-- Add updated_at triggers
CREATE TRIGGER update_skill_categories_updated_at
    BEFORE UPDATE ON skill_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data (matching current hardcoded data)
DO $$
DECLARE
    ds_id UUID;
    de_id UUID;
    viz_id UUID;
    web_id UUID;
BEGIN
    -- Data Science & ML
    INSERT INTO skill_categories (name, order_index) VALUES ('Data Science & ML', 1) RETURNING id INTO ds_id;
    INSERT INTO skills (name, category_id, order_index) VALUES 
        ('Python', ds_id, 1), ('PyTorch', ds_id, 2), ('TensorFlow', ds_id, 3), 
        ('Scikit-learn', ds_id, 4), ('Pandas', ds_id, 5), ('NumPy', ds_id, 6), 
        ('OpenCV', ds_id, 7), ('NLP', ds_id, 8);

    -- Data Engineering
    INSERT INTO skill_categories (name, order_index) VALUES ('Data Engineering', 2) RETURNING id INTO de_id;
    INSERT INTO skills (name, category_id, order_index) VALUES 
        ('SQL', de_id, 1), ('PostgreSQL', de_id, 2), ('MongoDB', de_id, 3), 
        ('Apache Spark', de_id, 4), ('Airflow', de_id, 5), ('ETL Pipelines', de_id, 6), 
        ('Redis', de_id, 7);

    -- Visualization & BI
    INSERT INTO skill_categories (name, order_index) VALUES ('Visualization & BI', 3) RETURNING id INTO viz_id;
    INSERT INTO skills (name, category_id, order_index) VALUES 
        ('Tableau', viz_id, 1), ('PowerBI', viz_id, 2), ('Matplotlib', viz_id, 3), 
        ('Seaborn', viz_id, 4), ('Plotly', viz_id, 5), ('Streamlit', viz_id, 6);

    -- Web & Deployment
    INSERT INTO skill_categories (name, order_index) VALUES ('Web & Deployment', 4) RETURNING id INTO web_id;
    INSERT INTO skills (name, category_id, order_index) VALUES 
        ('FastAPI', web_id, 1), ('Flask', web_id, 2), ('Docker', web_id, 3), 
        ('AWS', web_id, 4), ('Git', web_id, 5), ('Next.js', web_id, 6), 
        ('React', web_id, 7);
END $$;
