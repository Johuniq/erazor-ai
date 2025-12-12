-- Erazor AI Database Schema

-- Users profile table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 10,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  polar_customer_id TEXT,
  polar_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role can manage all profiles" ON profiles FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Image processing jobs table
CREATE TABLE IF NOT EXISTS processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('bg_removal', 'upscale', 'face_swap')),
  external_job_id TEXT,
  source_url TEXT NOT NULL,
  result_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  credits_used INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment explaining job types
COMMENT ON COLUMN processing_jobs.job_type IS 'Type of image processing job: bg_removal (1 credit), upscale (1 credit), face_swap (2 credits)';

-- Enable RLS on processing_jobs
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own jobs" ON processing_jobs;
DROP POLICY IF EXISTS "Users can insert own jobs" ON processing_jobs;
DROP POLICY IF EXISTS "Users can update own jobs" ON processing_jobs;
DROP POLICY IF EXISTS "Users can delete own jobs" ON processing_jobs;
DROP POLICY IF EXISTS "Service role can manage all jobs" ON processing_jobs;

-- RLS Policies for processing_jobs
CREATE POLICY "Users can view own jobs" ON processing_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON processing_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON processing_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON processing_jobs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all jobs" ON processing_jobs FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Credit transactions table for tracking
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON credit_transactions;

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON credit_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    10
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Add welcome bonus transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 10, 'bonus', 'Welcome bonus credits');
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Processing history table (for face swap and other async jobs)
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own history" ON processing_history;
DROP POLICY IF EXISTS "Users can insert own history" ON processing_history;
DROP POLICY IF EXISTS "Users can update own history" ON processing_history;
DROP POLICY IF EXISTS "Service role can manage all history" ON processing_history;

-- RLS Policies for processing_history
CREATE POLICY "Users can view own history" ON processing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON processing_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON processing_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all history" ON processing_history FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_processing_history_user_id ON processing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_history_job_id ON processing_history(job_id);
CREATE INDEX IF NOT EXISTS idx_processing_history_created_at ON processing_history(created_at DESC);

COMMENT ON TABLE processing_history IS 'Stores processing history for all image operations including face swap';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_processing_jobs_user_id ON processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
