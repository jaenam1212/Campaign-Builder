-- 캠페인 조회수 및 통계 테이블 추가

-- campaigns 테이블에 view_count 컬럼 추가
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 캠페인 조회 로그 테이블 (상세 분석용)
CREATE TABLE IF NOT EXISTS campaign_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  device_type TEXT -- 'desktop', 'mobile', 'tablet'
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_campaign_views_campaign_id ON campaign_views(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_views_viewed_at ON campaign_views(viewed_at DESC);

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_campaign_views(campaign_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE campaigns 
  SET view_count = view_count + 1 
  WHERE id = campaign_uuid;
END;
$$ LANGUAGE plpgsql;

