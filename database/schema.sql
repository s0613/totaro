-- Sora Extend Korean 데이터베이스 스키마
-- 작성일: 2025-10-12

-- ============================================
-- 1. ENUM 타입 정의
-- ============================================

CREATE TYPE job_status AS ENUM (
    'queued',      -- 대기 중
    'planning',    -- 프롬프트 계획 생성 중
    'generating',  -- 세그먼트 생성 중
    'merging',     -- 병합 중
    'completed',   -- 완료
    'failed'       -- 실패
);

-- ============================================
-- 2. 테이블 생성
-- ============================================

-- users 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- jobs 테이블
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status job_status DEFAULT 'queued' NOT NULL,
    prompt TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    progress FLOAT DEFAULT 0.0 CHECK (progress >= 0 AND progress <= 1),
    result_path VARCHAR(500),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT jobs_prompt_check CHECK (char_length(prompt) >= 1 AND char_length(prompt) <= 500)
);

-- job_logs 테이블
CREATE TABLE IF NOT EXISTS public.job_logs (
    id BIGSERIAL PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(20) DEFAULT 'INFO' CHECK (level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR')),
    message TEXT NOT NULL
);

-- ============================================
-- 3. 인덱스 생성
-- ============================================

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON public.job_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_logs_timestamp ON public.job_logs(timestamp DESC);

-- ============================================
-- 4. RLS (Row Level Security) 정책
-- ============================================

-- users 테이블 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- jobs 테이블 RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
    ON public.jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
    ON public.jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
    ON public.jobs FOR UPDATE
    USING (auth.uid() = user_id);

-- job_logs 테이블 RLS
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job logs"
    ON public.job_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE jobs.id = job_logs.job_id
            AND jobs.user_id = auth.uid()
        )
    );

-- ============================================
-- 5. 트리거 함수 (updated_at 자동 업데이트)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. 편의 함수 (optional)
-- ============================================

-- 사용자 생성 시 users 테이블에 자동 추가
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. 테스트 데이터 (optional, 개발 환경용)
-- ============================================

-- 테스트용 작업 생성 함수
CREATE OR REPLACE FUNCTION public.create_test_job(
    p_user_id UUID,
    p_prompt TEXT,
    p_config JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    v_job_id UUID;
BEGIN
    INSERT INTO public.jobs (user_id, prompt, config)
    VALUES (p_user_id, p_prompt, p_config)
    RETURNING id INTO v_job_id;

    RETURN v_job_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. 권한 설정
-- ============================================

-- anon 역할에 SELECT 권한 부여 (공개 읽기용)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT ON public.job_logs TO anon;

-- authenticated 역할에 CRUD 권한 부여
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.jobs TO authenticated;
GRANT ALL ON public.job_logs TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.job_logs_id_seq TO authenticated;

-- ============================================
-- 스키마 생성 완료
-- ============================================
