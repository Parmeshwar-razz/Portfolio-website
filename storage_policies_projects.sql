-- Storage Policies for Projects Bucket
-- Run this in Supabase SQL Editor

-- 1. Allow public READ access (so images can be viewed on your website)
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
  'Public Access for Projects',
  'projects',
  '(bucket_id = ''projects'')',
  '(bucket_id = ''projects'')'
)
ON CONFLICT DO NOTHING;

-- 2. Allow authenticated users to UPLOAD
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
  'Authenticated users can upload to projects',
  'projects',
  '((bucket_id = ''projects'') AND (auth.role() = ''authenticated''))',
  '((bucket_id = ''projects'') AND (auth.role() = ''authenticated''))'
)
ON CONFLICT DO NOTHING;

-- 3. Allow authenticated users to UPDATE
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
  'Authenticated users can update projects',
  'projects',
  '((bucket_id = ''projects'') AND (auth.role() = ''authenticated''))',
  '((bucket_id = ''projects'') AND (auth.role() = ''authenticated''))'
)
ON CONFLICT DO NOTHING;

-- 4. Allow authenticated users to DELETE
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
  'Authenticated users can delete from projects',
  'projects',
  '((bucket_id = ''projects'') AND (auth.role() = ''authenticated''))',
  '((bucket_id = ''projects'') AND (auth.role() = ''authenticated''))'
)
ON CONFLICT DO NOTHING;
