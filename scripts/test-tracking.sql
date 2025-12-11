-- 조회수 추적 테스트용 SQL 쿼리들
-- Supabase SQL Editor에서 실행하여 확인

-- 1. campaigns 테이블에 view_count 컬럼이 있는지 확인
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'campaigns' AND column_name = 'view_count';

-- 2. campaign_views 테이블이 있는지 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'campaign_views';

-- 3. increment_campaign_views 함수가 있는지 확인
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'increment_campaign_views';

-- 4. 현재 캠페인별 조회수 확인
SELECT id, title, view_count, created_at 
FROM campaigns 
ORDER BY view_count DESC;

-- 5. 상세 조회 로그 확인 (최근 10개)
SELECT cv.id, c.title, cv.viewed_at, cv.ip_address, cv.user_agent, cv.referer
FROM campaign_views cv
JOIN campaigns c ON cv.campaign_id = c.id
ORDER BY cv.viewed_at DESC
LIMIT 10;

