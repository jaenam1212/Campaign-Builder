# 데이터베이스 설정 가이드

## 방법 1: Prisma 사용 (권장)

Prisma는 타입 안정성과 자동 완성을 제공합니다.

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일에 DATABASE_URL 추가:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

Supabase 대시보드 > Settings > Database > Connection string에서 "URI" 형식으로 가져올 수 있습니다.

### 3. Prisma 마이그레이션 실행
```bash
npx prisma generate
npx prisma db push
```

또는 마이그레이션 파일 생성:
```bash
npx prisma migrate dev --name init
```

### 4. Prisma Studio (선택사항)
데이터베이스를 시각적으로 확인:
```bash
npm run db:studio
```

## 방법 2: SQL 직접 실행

Supabase 대시보드에서 직접 SQL을 실행하는 방법입니다.

### 1. Supabase 대시보드 접속
1. https://app.supabase.com 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 "SQL Editor" 클릭

### 2. SQL 파일 실행
`supabase/migrations/001_initial_schema.sql` 파일의 내용을 복사해서 SQL Editor에 붙여넣고 실행하세요.

## 데이터베이스 구조

### campaigns 테이블
- 캠페인 정보 저장
- JSON 타입으로 colors 저장
- 배열 타입으로 actionItems 저장

### signatures 테이블
- 서명 정보 저장
- campaigns와 외래키 관계 (CASCADE 삭제)

### Row Level Security (RLS)
- 모든 사용자가 캠페인과 서명을 읽을 수 있음
- 사용자는 자신의 캠페인만 수정/삭제 가능
- 서명은 누구나 추가 가능

