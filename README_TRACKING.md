# 조회수 추적 시스템 확인 가이드

## 저장되는 데이터

캠페인 페이지 접속 시 다음 데이터가 DB에 저장됩니다:

1. **campaigns.view_count**: 캠페인별 총 조회수 (자동 증가)
2. **campaign_views 테이블**: 상세 조회 로그
   - IP 주소
   - User-Agent (브라우저 정보)
   - Referer (어디서 왔는지)
   - 조회 시간

## 저장 확인 방법

### 방법 1: Supabase 대시보드에서 확인

1. **campaigns 테이블 확인**
   - Supabase → Table Editor → `campaigns`
   - `view_count` 컬럼 확인 (숫자가 증가하는지 확인)

2. **campaign_views 테이블 확인**
   - Table Editor → `campaign_views`
   - 새로운 행이 추가되는지 확인

### 방법 2: SQL로 확인

Supabase SQL Editor에서 실행:

```sql
-- 캠페인별 조회수 확인
SELECT id, title, view_count 
FROM campaigns 
ORDER BY view_count DESC;

-- 상세 조회 로그 확인
SELECT cv.*, c.title as campaign_title
FROM campaign_views cv
JOIN campaigns c ON cv.campaign_id = c.id
ORDER BY cv.viewed_at DESC
LIMIT 20;
```

### 방법 3: 관리자 대시보드에서 확인

1. 관리자로 로그인
2. `/admin/analytics` 페이지 접속
3. 캠페인별 조회수 확인

## 테스트 방법

1. **마이그레이션 실행 확인**
   - `004_add_campaign_analytics.sql` 실행했는지 확인
   - `scripts/test-tracking.sql` 실행하여 테이블/함수 존재 확인

2. **실제 테스트**
   - 캠페인 상세 페이지 접속
   - 브라우저 개발자 도구 → Network 탭에서 `/api/campaigns/[id]/track` 요청 확인
   - Supabase에서 `view_count` 증가 확인

## 문제 해결

### 조회수가 증가하지 않는 경우

1. **마이그레이션 미실행**
   ```sql
   -- Supabase SQL Editor에서 실행
   ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
   ```

2. **함수 미생성**
   ```sql
   -- increment_campaign_views 함수 생성
   CREATE OR REPLACE FUNCTION increment_campaign_views(campaign_uuid UUID)
   RETURNS void AS $$
   BEGIN
     UPDATE campaigns 
     SET view_count = view_count + 1 
     WHERE id = campaign_uuid;
   END;
   $$ LANGUAGE plpgsql;
   ```

3. **서버 콘솔 확인**
   - 개발 서버 콘솔에서 에러 메시지 확인
   - `RPC error` 또는 `Log insert error` 확인

## 저장 흐름

```
사용자 → 캠페인 페이지 접속
  ↓
trackView() 함수 호출 (클라이언트)
  ↓
POST /api/campaigns/[id]/track
  ↓
서버에서 처리:
  1. increment_campaign_views() 함수 실행 → campaigns.view_count 증가
  2. campaign_views 테이블에 로그 INSERT
  ↓
DB에 저장 완료 ✅
```

