-- 관리자 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- RLS 비활성화 (관리자 테이블은 서버에서만 접근)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 관리자 테이블은 서버에서만 접근 가능 (RLS 정책 설정)
CREATE POLICY "Admin users table is server-only"
  ON admin_users
  FOR ALL
  USING (false);

-- 예시: 관리자 계정 추가 (SQL로 직접 추가)
-- 비밀번호는 bcrypt로 해시화해야 합니다.
-- Node.js에서 해시 생성: const bcrypt = require('bcrypt'); const hash = await bcrypt.hash('your_password', 10);
-- 또는 온라인 도구: https://bcrypt-generator.com/
-- 
-- INSERT INTO admin_users (email, password_hash, is_admin) 
-- VALUES ('admin@example.com', '$2a$10$YourBcryptHashHere', true);

