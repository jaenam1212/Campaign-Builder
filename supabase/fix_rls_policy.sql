-- RLS 정책 수정: user_id가 null이어도 INSERT 허용
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;

CREATE POLICY "Anyone can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (true);

