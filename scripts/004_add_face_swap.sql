-- Update database schema to support face swap feature
-- Run this migration to add face_swap support to existing tables

-- 1. Update processing_jobs table to include face_swap job type
ALTER TABLE processing_jobs 
DROP CONSTRAINT IF EXISTS processing_jobs_job_type_check;

ALTER TABLE processing_jobs 
ADD CONSTRAINT processing_jobs_job_type_check 
CHECK (job_type IN ('bg_removal', 'upscale', 'face_swap'));

-- 2. Update anon_processing_jobs table to include face_swap job type
ALTER TABLE anon_processing_jobs 
DROP CONSTRAINT IF EXISTS anon_processing_jobs_job_type_check;

ALTER TABLE anon_processing_jobs 
ADD CONSTRAINT anon_processing_jobs_job_type_check 
CHECK (job_type IN ('bg_removal', 'upscale', 'face_swap'));

-- 3. Add comment explaining the job types
COMMENT ON COLUMN processing_jobs.job_type IS 'Type of image processing job: bg_removal (1 credit), upscale (1 credit), face_swap (2 credits)';
COMMENT ON COLUMN anon_processing_jobs.job_type IS 'Type of image processing job: bg_removal (1 credit), upscale (1 credit), face_swap (2 credits)';

-- 4. Update processing_history table if it exists (used by face swap API)
CREATE TABLE IF NOT EXISTS processing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('bg_removal', 'upscale', 'face_swap')),
  status TEXT DEFAULT 'processing' CHECK (status IN ('queue', 'processing', 'completed', 'failed')),
  original_filename TEXT,
  result_url TEXT,
  credits_used INTEGER DEFAULT 1,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS on processing_history
ALTER TABLE processing_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own history" ON processing_history;
DROP POLICY IF EXISTS "Users can insert own history" ON processing_history;
DROP POLICY IF EXISTS "Users can update own history" ON processing_history;
DROP POLICY IF EXISTS "Service role can manage all history" ON processing_history;

-- RLS Policies for processing_history
CREATE POLICY "Users can view own history" ON processing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON processing_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON processing_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all history" ON processing_history FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_processing_history_user_id ON processing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_history_job_id ON processing_history(job_id);
CREATE INDEX IF NOT EXISTS idx_processing_history_created_at ON processing_history(created_at DESC);

-- 5. Add sample data comment
COMMENT ON TABLE processing_history IS 'Stores processing history for all image operations including face swap';

-- Verify the changes
DO $$
BEGIN
  RAISE NOTICE 'Database migration completed successfully!';
  RAISE NOTICE 'Processing jobs now support: bg_removal, upscale, face_swap';
  RAISE NOTICE 'Processing history table created/updated for face swap tracking';
END $$;
