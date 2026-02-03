-- ============================================
-- STORAGE POLICIES FOR CERTIFICATES BUCKET
-- ============================================
-- Run this in Supabase SQL Editor after creating the 'certificates' bucket

-- NOTE: Remove the ALTER TABLE command as it requires owner privileges
-- RLS is already enabled by default on storage.objects

-- 1. Policy: Allow PUBLIC READ access to all files in certificates bucket
-- This allows anyone to view certificate images on your public website
CREATE POLICY "Public Access - Read Certificates"
ON storage.objects FOR SELECT
USING ( bucket_id = 'certificates' );

-- 2. Policy: Allow AUTHENTICATED users to INSERT files
-- This allows admins to upload certificate images
CREATE POLICY "Authenticated Users Can Upload Certificates"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'certificates' 
    AND auth.role() = 'authenticated'
);

-- 3. Policy: Allow AUTHENTICATED users to UPDATE files
-- This allows admins to replace certificate images
CREATE POLICY "Authenticated Users Can Update Certificates"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'certificates' 
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'certificates' 
    AND auth.role() = 'authenticated'
);

-- 4. Policy: Allow AUTHENTICATED users to DELETE files
-- This allows admins to delete certificate images
CREATE POLICY "Authenticated Users Can Delete Certificates"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'certificates' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- ALTERNATIVE: If the above doesn't work, use the Supabase Dashboard UI
-- ============================================
-- Go to: Storage → certificates bucket → Policies tab → New Policy
-- Then create each policy manually using the UI
-- ============================================
