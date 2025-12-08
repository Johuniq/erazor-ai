-- Anonymous users table for tracking usage without authentication
CREATE TABLE IF NOT EXISTS anon_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 3,
  last_credit_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anonymous processing jobs table
CREATE TABLE IF NOT EXISTS anon_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_user_id UUID NOT NULL REFERENCES anon_users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('bg_removal', 'upscale')),
  external_job_id TEXT,
  source_url TEXT NOT NULL,
  result_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE anon_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anon_processing_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for anonymous tables - only service role can access
CREATE POLICY "Service role can manage anon users" ON anon_users FOR ALL USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role can manage anon jobs" ON anon_processing_jobs FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_anon_users_fingerprint ON anon_users(fingerprint);
CREATE INDEX IF NOT EXISTS idx_anon_processing_jobs_anon_user_id ON anon_processing_jobs(anon_user_id);
