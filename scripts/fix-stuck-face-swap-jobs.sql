-- Fix stuck face swap jobs that are actually completed
-- This script updates face swap jobs that show "processing" but are actually done
-- Run this in your Supabase SQL editor

-- First, check what jobs are stuck
SELECT 
  id,
  user_id,
  job_type,
  status,
  external_job_id,
  created_at,
  result_url
FROM processing_jobs
WHERE job_type = 'face_swap' 
  AND status = 'processing'
ORDER BY created_at DESC;

-- If you want to manually mark them as failed (so user can retry):
-- UPDATE processing_jobs
-- SET status = 'failed',
--     error = 'Please try again - job timed out'
-- WHERE job_type = 'face_swap' 
--   AND status = 'processing'
--   AND created_at < NOW() - INTERVAL '10 minutes';

-- If you know they completed successfully and have the result_url:
-- UPDATE processing_jobs
-- SET status = 'completed',
--     completed_at = NOW()
-- WHERE job_type = 'face_swap' 
--   AND status = 'processing'
--   AND result_url IS NOT NULL;
