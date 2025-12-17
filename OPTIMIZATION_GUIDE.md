# 성능 최적화 가이드

## 적용된 최적화 사항

### 1. 폰트 캐싱 최적화
- ✅ **preload 전략**: 자주 사용되는 폰트만 preload (Noto Sans KR, East Sea Dokdo)
- ✅ **fallback 폰트**: 모든 폰트에 시스템 폰트 fallback 설정
- ✅ **display: swap**: 폰트 로딩 중에도 텍스트 표시
- ✅ **불필요한 폰트 제거**: Geist, Geist Mono 제거

**효과**: 초기 폰트 요청 14개 → 2개 preload + 나머지는 필요시 로드

### 2. 이미지 캐싱 (OG Image API)
- ✅ **Edge Runtime**: CDN 엣지에서 실행하여 지연시간 감소
- ✅ **강력한 캐싱**: `max-age=31536000, immutable` (1년)
- ✅ **CDN 캐시 헤더**: Vercel CDN 최적화
- ✅ **ETag 지원**: 조건부 요청으로 대역폭 절약
- ✅ **404 캐싱**: 5분간 캐싱으로 반복 요청 방지

**효과**: OG 이미지 요청 시 Function 실행 최소화, CDN에서 대부분 처리

### 3. Analytics & GTM 최적화
- ✅ **지연 로딩**: 사용자 인터랙션 또는 3초 후 로드
- ✅ **Passive 이벤트 리스너**: 스크롤 성능 향상
- ✅ **strategy: lazyOnload**: 페이지 로드 후 스크립트 실행

**효과**: 초기 페이지 로드 시 GTM 요청 제거, 사용자 경험 개선

### 4. 정적 자산 캐싱
- ✅ **Next.js 설정**: 이미지, 정적 파일에 1년 캐시
- ✅ **미들웨어 캐싱**: 폰트, 이미지 등 정적 자산에 immutable 헤더
- ✅ **API 캐싱**: 일반 API는 60초, OG 이미지는 1년
- ✅ **404 캐싱**: WordPress 스캔 등 24시간 캐싱

**효과**: CDN 히트율 극대화, Edge Requests 감소

### 5. 번들 최적화
- ✅ **compress**: Gzip/Brotli 압축 활성화
- ✅ **poweredByHeader**: X-Powered-By 헤더 제거
- ✅ **optimizePackageImports**: Vercel Analytics 최적화

## Vercel 설정 가이드

### 환경 변수 설정
Vercel 대시보드 → Settings → Environment Variables에 추가:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Edge Config 설정 (선택사항)
더 강력한 캐싱을 위해 Vercel Edge Config 사용 가능:
1. Vercel 대시보드 → Storage → Edge Config 생성
2. 캠페인 데이터를 Edge Config에 복제
3. ISR(Incremental Static Regeneration) 활용

### 성능 모니터링
Vercel Analytics에서 확인 가능한 지표:
- **Edge Requests**: 초기 요청 수 (CDN 미스)
- **Cache Hit Rate**: CDN 캐시 히트율
- **Function Invocations**: 서버리스 함수 실행 수
- **Edge Function Invocations**: Edge에서 실행된 함수 수

## 예상 개선 효과

### Before (최적화 전)
- 방문자 7명
- Edge Requests: 11,000
- Function Invocations: 69
- 방문자당 평균: ~1,570 requests

### After (최적화 후)
- 방문자 7명
- Edge Requests: 예상 ~300-500 (94% 감소)
- Function Invocations: 예상 ~20-30 (65% 감소)
- 방문자당 평균: ~40-70 requests

**감소 요인:**
1. 폰트 preload 최적화: -140 requests (14폰트 × 10회)
2. OG 이미지 CDN 캐싱: -8,000 requests (크롤러 반복 요청 캐싱)
3. GTM 지연 로딩: -70 requests
4. 정적 자산 캐싱: -2,000 requests
5. 404 캐싱: -500 requests (WordPress 스캔)

## 추가 권장 사항

### 1. ISR (Incremental Static Regeneration)
캠페인 페이지를 정적으로 생성하고 필요시 재검증:

```typescript
// app/campaigns/[id]/page.tsx
export const revalidate = 3600; // 1시간마다 재검증
```

### 2. 이미지 최적화
캠페인 이미지를 base64 대신 Supabase Storage + CDN 사용:
- Supabase Storage에 업로드
- CDN URL 사용
- Next.js Image 컴포넌트로 자동 최적화

### 3. React Query 캐싱 개선
```typescript
// lib/react-query.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
    },
  },
});
```

### 4. 크롤러 대응
주요 크롤러는 이미 허용 목록에 있지만, 필요시 추가:
- 카카오톡: Kakao
- 네이버: Yeti
- 라인: LINE

## 모니터링 방법

### 1. Vercel Analytics
대시보드에서 실시간 확인:
- Edge Requests 추이
- Function Duration
- Cache Hit Rate

### 2. Chrome DevTools
- Network 탭: 캐시 헤더 확인
- Lighthouse: 성능 점수
- Performance: 로딩 타임라인

### 3. GTmetrix / WebPageTest
- 전체 페이지 로드 시간
- 요청 수
- 파일 크기

## 배포 체크리스트

- [ ] 환경 변수 설정 확인
- [ ] `npm run build` 성공 확인
- [ ] Vercel에 배포
- [ ] 배포 후 네트워크 탭에서 캐시 헤더 확인
- [ ] OG 이미지 크롤러 테스트 (카카오톡 공유)
- [ ] Vercel Analytics에서 24시간 후 수치 확인

## 문제 해결

### Edge Requests가 여전히 높은 경우
1. Vercel Analytics → Functions 탭에서 어느 엔드포인트가 많이 호출되는지 확인
2. Chrome DevTools에서 Cache-Control 헤더가 제대로 설정되었는지 확인
3. 봇 차단 로그 확인 (middleware.ts)

### 폰트가 로딩되지 않는 경우
1. 브라우저 콘솔에서 에러 확인
2. preload vs lazy load 전략 조정
3. fallback 폰트 확인

### GTM이 작동하지 않는 경우
1. GTM ID 환경 변수 확인
2. 3초 대기 또는 사용자 인터랙션 후 확인
3. 네트워크 탭에서 GTM 스크립트 로드 확인
