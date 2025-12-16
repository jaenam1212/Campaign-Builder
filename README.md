# 캠페인 빌더

캠페인을 쉽게 만들고 공유할 수 있는 플랫폼입니다.

## 주요 기능

- 캠페인 작성 (제목, 이미지, 내용, 행동강령)
- 컬러 커스터마이징
- SNS 인증 및 서명 기능 (옵션)
- 캠페인 공유
- 작성 중인 캠페인 자동 저장 (Zustand)

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXXX
```

- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager 컨테이너 ID (선택사항, GTM-로 시작하는 ID)

### 3. 개발 서버 실행

```bash
npm run dev
```

## 프로젝트 구조

```
campaign-builder/
├── app/                    # Next.js App Router
│   ├── campaigns/         # 캠페인 관련 페이지
│   │   └── new/          # 새 캠페인 작성
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 메인 페이지
├── components/            # 컴포넌트
│   ├── campaign/         # 캠페인 편집 관련 컴포넌트
│   └── Header.tsx        # 헤더 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   └── supabase.ts       # Supabase 클라이언트
└── store/                 # 상태 관리 (Zustand)
    └── campaignStore.ts   # 캠페인 스토어
```

## 기술 스택

- **프레임워크**: Next.js 16
- **상태 관리**: Zustand
- **데이터베이스**: Supabase
- **스타일링**: Tailwind CSS
- **타입스크립트**: TypeScript

## 개발 예정 기능

- [ ] Supabase 연동 및 데이터 저장
- [ ] 사용자 인증 (로그인/회원가입)
- [ ] 캠페인 목록 조회
- [ ] 캠페인 공개 페이지
- [ ] 서명 기능 구현
- [ ] SNS 공유 기능 강화
