# 데이터베이스 마이그레이션 가이드

## 방법 1: Supabase SQL Editor 사용 (권장)

### 1. Supabase 대시보드 접속

1. https://app.supabase.com 접속
2. 프로젝트 선택 (jshhxdgpaqrkvzlqdktw)

### 2. SQL Editor 열기

- 왼쪽 메뉴에서 **"SQL Editor"** 클릭

### 3. 마이그레이션 파일 실행

각 마이그레이션 파일을 순서대로 실행하세요:

#### 순서:

1. `001_initial_schema.sql` - 기본 테이블 생성 (이미 실행했을 수 있음)
2. `002_add_admin_users.sql` - 관리자 테이블 생성 (이미 실행했을 수 있음)
3. `003_fix_admin_users_rls.sql` - RLS 정책 수정 (이미 실행했을 수 있음)
4. `004_add_campaign_analytics.sql` - 조회수 추적 기능 추가 ⭐ **새로 실행 필요**

### 4. 실행 방법

1. SQL Editor에서 "New query" 클릭
2. 마이그레이션 파일 내용을 복사해서 붙여넣기
3. 우측 하단 **"Run"** 버튼 클릭 또는 `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

## 방법 2: Supabase CLI 사용 (고급)

```bash
# Supabase CLI 설치 (필요시)
npm install -g supabase

# Supabase에 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref jshhxdgpaqrkvzlqdktw

# 마이그레이션 적용
supabase db push
```

## 현재 실행해야 할 마이그레이션

### `004_add_campaign_analytics.sql`

조회수 추적 기능을 추가하는 마이그레이션입니다.

**내용:**

- `campaigns` 테이블에 `view_count` 컬럼 추가
- `campaign_views` 테이블 생성 (상세 로그)
- 조회수 증가 함수 생성

**실행 후:**

- 캠페인 조회수 자동 추적 시작
- `/admin/analytics` 페이지에서 통계 확인 가능
