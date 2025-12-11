-- admin_users 테이블의 RLS 정책 수정
-- 서버에서만 접근 가능하도록 RLS를 비활성화하거나 정책을 변경

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Admin users table is server-only" ON admin_users;

-- RLS 비활성화 (서버 사이드에서만 접근하므로 RLS 불필요)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

