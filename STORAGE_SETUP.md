# Storage Bucket Setup Guide

You need to create storage buckets in Supabase for image uploads to work.

## Required Buckets

1. **projects** - For project images
2. **certificates** - For certificate images
3. **resumes** - For resume PDFs

## How to Create Buckets

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Click on **Storage** in the left sidebar

### Step 2: Create Each Bucket
For each bucket listed above:

1. Click the **"New bucket"** button
2. Enter the bucket name (e.g., `projects`)
3. **IMPORTANT**: Toggle **"Public bucket"** to ON
4. Click **"Create bucket"**

### Step 3: Verify
After creating all buckets, you should see:
- ✅ projects (Public)
- ✅ certificates (Public)
- ✅ resumes (Public)

## Why Public?
Making buckets public allows:
- Images to be displayed on your portfolio website
- Resume to be downloadable
- No authentication needed for viewing

The buckets are public for **reading only**. Only authenticated admin users can upload/delete files.

---

**After creating these buckets, try uploading a project image again. It should work!**
