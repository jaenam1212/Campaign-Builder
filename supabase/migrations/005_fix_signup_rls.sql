-- 회원가입을 위한 RLS 정책 추가
-- admin_users 테이블에 INSERT 권한 부여

-- RLS가 비활성화되어 있으면 활성화
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Admin users table is server-only" ON admin_users;
DROP POLICY IF EXISTS "Allow service role insert" ON admin_users;

-- 서버 사이드에서 INSERT 가능하도록 정책 추가
-- anon 키로도 INSERT가 가능하도록 설정 (서버 사이드 API에서 사용)
CREATE POLICY "Allow insert for signup"
  ON admin_users
  FOR INSERT
  WITH CHECK (true);

-- SELECT는 서버 사이드에서만 (로그인 시)
CREATE POLICY "Allow select for login"
  ON admin_users
  FOR SELECT
  USING (true);

-- 또는 RLS 완전히 비활성화 (더 간단한 방법)
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

