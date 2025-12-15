# 웹 보안 학습 가이드

## 1. Rate Limiting (요청 제한)

### 왜 필요한가?
- **DoS 공격 방지**: 한 IP에서 초당 수천 개의 요청을 보내 서버를 마비시킬 수 있음
- **무차별 대입 공격 방지**: 로그인 API에 비밀번호를 계속 시도하는 공격
- **리소스 보호**: 서버 CPU, 메모리, DB 연결을 보호

### 원리
1. IP 주소(또는 사용자 ID)를 키로 사용
2. 시간 윈도우(예: 1분) 내 요청 횟수를 카운트
3. 최대 허용 횟수 초과 시 429 에러 반환
4. 시간이 지나면 카운터 리셋

### 어디에 적용?
- **로그인 API**: 15분당 5회 (무차별 대입 방지)
- **서명 생성 API**: 1분당 3회 (스팸 방지)
- **일반 API**: 1분당 30회 (정상 사용자 보호)

### 구현 방법
```typescript
// 메모리 기반 (간단하지만 서버 재시작 시 초기화)
const store = { [ip]: { count: 0, resetTime: Date.now() + 60000 } };

// Redis 기반 (프로덕션 권장, 여러 서버 간 공유 가능)
await redis.incr(`rate:${ip}`);
await redis.expire(`rate:${ip}`, 60);
```

---

## 2. Input Validation & Sanitization (입력 검증 및 정화)

### 왜 필요한가?
- **XSS 공격 방지**: `<script>alert('hack')</script>` 같은 악성 코드 삽입
- **SQL Injection 방지**: `' OR '1'='1` 같은 쿼리 조작 (Supabase는 자동 방지하지만 추가 검증)
- **데이터 무결성**: 잘못된 형식의 데이터로 인한 오류 방지
- **DoS 방지**: 너무 긴 문자열로 메모리 고갈

### 원리
1. **검증(Validation)**: 데이터 형식이 올바른지 확인
   - 길이 체크
   - 형식 체크 (이메일, URL 등)
   - 타입 체크
2. **정화(Sanitization)**: 위험한 문자를 안전하게 변환
   - HTML 태그 이스케이프: `<` → `&lt;`
   - HTML 태그 제거: `<script>` → (제거)

### 어디에 적용?
- **모든 사용자 입력**: API의 request body, query parameter
- **특히 위험한 곳**:
  - 게시글 제목/내용 (XSS)
  - 사용자 이름 (XSS)
  - 이미지 URL (Open Redirect)
  - 이메일 (이메일 형식)

### 구현 방법
```typescript
// HTML 이스케이프
function sanitizeHtml(input: string) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 길이 검증
if (input.length > 1000) {
  return { error: '너무 깁니다' };
}
```

---

## 3. Security Headers (보안 헤더)

### 왜 필요한가?
- **XSS 방지**: 브라우저의 XSS 필터 활성화
- **클릭재킹 방지**: iframe으로 사이트를 감싸서 가짜 버튼 클릭 유도
- **MIME 스니핑 방지**: 악성 파일을 이미지로 위장
- **CSP**: 허용된 리소스만 로드 (스크립트, 스타일 등)

### 주요 헤더들

#### X-Content-Type-Options: nosniff
- 브라우저가 파일 타입을 추측하지 않도록 함
- `text/plain` 파일을 `text/html`로 해석하는 것 방지

#### X-Frame-Options: DENY
- 사이트를 iframe에 넣지 못하게 함
- 클릭재킹 방지

#### Content-Security-Policy (CSP)
- 허용된 스크립트, 스타일, 이미지 소스만 로드
- 인라인 스크립트 차단 가능

### 어디에 적용?
- **모든 HTTP 응답**에 적용 (middleware에서 자동)
- 특히 중요한 곳:
  - 로그인 페이지
  - 관리자 페이지
  - 사용자 입력이 있는 페이지

### 구현 방법
```typescript
// Next.js middleware.ts
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Content-Security-Policy', "default-src 'self'");
```

---

## 4. CSRF Protection (CSRF 방지)

### 왜 필요한가?
- **CSRF 공격**: 악성 사이트에서 사용자의 쿠키를 이용해 요청을 보냄
- 예: 사용자가 로그인한 상태에서 악성 사이트 방문 → 그 사이트가 사용자 모르게 서버에 요청

### 원리
1. 서버가 고유한 토큰 생성 (세션별로 다름)
2. 폼에 토큰을 숨겨서 전송
3. 요청 시 토큰을 검증
4. 토큰이 없거나 틀리면 요청 거부

### 어디에 적용?
- **상태 변경 요청**: POST, PUT, DELETE
- 특히 중요한 곳:
  - 로그인/로그아웃
  - 데이터 생성/수정/삭제
  - 비밀번호 변경

### 구현 방법
```typescript
// 1. 토큰 생성 (폼 렌더링 시)
const token = crypto.randomBytes(32).toString('hex');
cookie.set('csrf_token', token);

// 2. 폼에 포함
<input type="hidden" name="csrf_token" value={token} />

// 3. 검증 (API에서)
if (request.body.csrf_token !== cookie.csrf_token) {
  return 403;
}
```

---

## 5. 파일 업로드 검증

### 왜 필요한가?
- **악성 파일 업로드**: 실행 파일, 스크립트 파일 업로드
- **서버 리소스 고갈**: 너무 큰 파일 업로드
- **MIME 타입 스푸핑**: `.exe` 파일을 `.jpg`로 위장

### 원리
1. **파일 확장자 검증**: `.jpg`, `.png` 등만 허용
2. **MIME 타입 검증**: 실제 파일 내용 확인
3. **파일 크기 제한**: 예) 5MB 이하
4. **파일 내용 검증**: 이미지인지 실제로 확인

### 어디에 적용?
- **이미지 업로드 API**
- **파일 첨부 기능**

### 구현 방법
```typescript
// MIME 타입 검증
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.type)) {
  return { error: '허용되지 않은 파일 형식' };
}

// 파일 크기 제한
if (file.size > 5 * 1024 * 1024) {
  return { error: '파일이 너무 큽니다' };
}
```

---

## 6. 인증/인가 (Authentication/Authorization)

### 왜 필요한가?
- **인증(Auth)**: 사용자가 누구인지 확인
- **인가(Authorization)**: 사용자가 할 수 있는 작업 확인
- **권한 없는 접근 방지**: 다른 사람의 데이터 수정/삭제

### 원리
1. 로그인 시 세션/토큰 발급
2. 요청마다 세션/토큰 검증
3. 리소스 접근 시 권한 확인

### 어디에 적용?
- **모든 보호된 API**
- 특히 중요한 곳:
  - 데이터 생성/수정/삭제
  - 관리자 기능
  - 개인 정보 조회

### 구현 방법
```typescript
// 현재 프로젝트에서는 이미 구현됨
const isAdmin = await isAdmin();
if (!isAdmin) {
  return 401;
}

// 리소스 소유자 확인
if (campaign.user_id !== currentUserId) {
  return 403;
}
```

---

## 7. 로깅 및 모니터링

### 왜 필요한가?
- **공격 탐지**: 의심스러운 활동 감지
- **디버깅**: 문제 발생 시 원인 파악
- **감사(Audit)**: 누가 무엇을 했는지 기록

### 원리
1. 중요한 이벤트 기록 (로그인 실패, 권한 거부 등)
2. 로그 분석 도구로 모니터링
3. 이상 패턴 감지 시 알림

### 어디에 적용?
- **로그인 시도** (성공/실패)
- **권한 거부**
- **Rate limit 초과**
- **에러 발생**

### 구현 방법
```typescript
// 로그인 실패 기록
if (!isValidPassword) {
  logger.warn('Login failed', { email, ip });
  return 401;
}

// 의심스러운 활동
if (failedAttempts > 5) {
  logger.alert('Brute force attempt', { ip });
}
```

---

## 적용 우선순위

### 높은 우선순위 (즉시 적용)
1. ✅ **Input Validation** - 모든 입력 검증
2. ✅ **Rate Limiting** - 로그인, 서명 생성 API
3. ✅ **Security Headers** - 모든 응답
4. ✅ **인증/인가** - 보호된 API

### 중간 우선순위 (곧 적용)
5. **CSRF Protection** - 상태 변경 API
6. **파일 업로드 검증** - 이미지 업로드 시
7. **로깅** - 중요한 이벤트

### 낮은 우선순위 (나중에)
8. **2FA** - 관리자 계정
9. **IP 화이트리스트** - 관리자 접근
10. **비밀번호 정책** - 복잡도 요구사항

---

## 실습 과제

각 보안 기능을 직접 구현해보세요:

1. **Rate Limiter 만들기**
   - 메모리 기반으로 시작
   - IP별 요청 수 추적
   - 로그인 API에 적용

2. **Input Validator 만들기**
   - 텍스트 길이 검증 함수
   - HTML 태그 제거 함수
   - 이메일 검증 함수
   - 캠페인 생성 API에 적용

3. **Security Headers 추가**
   - middleware.ts에 헤더 설정
   - CSP 정책 작성

4. **CSRF 토큰 시스템**
   - 토큰 생성 함수
   - 토큰 검증 함수
   - 폼에 토큰 포함

---

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - 가장 흔한 보안 취약점
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security) - 웹 보안 기본
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers) - Next.js 보안 가이드

