# 의료특화 AI 챗봇 서비스 설계서

## 1. 서비스 개요

### 1.1 서비스 목적
- 병원 방문 전 환자의 증상에 대한 초기 상담 제공
- 의료 정보에 대한 신뢰할 수 있는 답변 제공
- 병원 방문 결정을 위한 가이드 역할

### 1.2 타겟 사용자
- 병원 방문을 고려하는 일반 환자
- 증상에 대한 초기 정보를 원하는 사용자
- 의료 상담을 위한 예비 정보 수집자

## 2. 시스템 아키텍처

### 2.1 전체 시스템 구성도
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Service    │
│   (React/Next)  │◄──►│   (Node.js)     │◄──►│   (OpenAI API)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Host   │    │   VPS/Cloud     │    │   OpenAI Cloud  │
│   (Vercel)      │    │   (Railway)     │    │   (API)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 기술 스택
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: OpenAI GPT-4 API
- **Database**: SQLite (MVP용)
- **Hosting**: Vercel (Frontend) + Railway (Backend)
- **Monitoring**: Vercel Analytics (무료)

## 3. 상세 설계

### 3.1 Frontend 설계

#### 3.1.1 페이지 구조
```
/
├── / (홈페이지)
├── /chat (채팅 인터페이스)
├── /history (대화 기록)
├── /about (서비스 소개)
└── /disclaimer (면책조항)
```

#### 3.1.2 주요 컴포넌트
- `ChatInterface`: 메인 채팅 UI
- `MessageBubble`: 메시지 표시 컴포넌트
- `SymptomSelector`: 증상 선택 컴포넌트
- `LoadingIndicator`: 로딩 표시
- `Disclaimer`: 의료 면책조항

### 3.2 Backend 설계

#### 3.2.1 API 엔드포인트
```
POST /api/chat
- 사용자 메시지 처리
- AI 응답 생성
- 대화 기록 저장

GET /api/history
- 사용자 대화 기록 조회

POST /api/feedback
- 사용자 피드백 수집
```

#### 3.2.2 데이터베이스 스키마
```sql
-- 사용자 테이블
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 대화 테이블
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    message TEXT,
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 피드백 테이블
CREATE TABLE feedback (
    id INTEGER PRIMARY KEY,
    conversation_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

### 3.3 AI 서비스 설계

#### 3.3.1 프롬프트 엔지니어링
```javascript
const systemPrompt = `
당신은 의료 상담을 도와주는 AI 어시스턴트입니다.

주의사항:
1. 진단을 내리지 마세요
2. 구체적인 약물 처방을 하지 마세요
3. 응급 상황 시 즉시 병원 방문을 권고하세요
4. 의료진과의 상담을 권장하세요

답변 형식:
1. 증상에 대한 일반적인 설명
2. 주의해야 할 증상들
3. 병원 방문 권고 시점
4. 예비 준비사항
`;
```

#### 3.3.2 응급 상황 감지
```javascript
const emergencyKeywords = [
    '심한 통증', '의식 상실', '호흡 곤란', '출혈',
    '가슴 통증', '마비', '발작', '중독'
];

const isEmergency = (message) => {
    return emergencyKeywords.some(keyword => 
        message.includes(keyword)
    );
};
```

## 4. MVP 개발 계획

### 4.1 Phase 1: 기본 기능 (1-2주)
- [ ] 프로젝트 설정 및 기본 구조
- [ ] 채팅 인터페이스 구현
- [ ] OpenAI API 연동
- [ ] 기본 프롬프트 설정

### 4.2 Phase 2: 핵심 기능 (2-3주)
- [ ] 의료 특화 프롬프트 최적화
- [ ] 응급 상황 감지 및 대응
- [ ] 대화 기록 저장
- [ ] 기본 UI/UX 개선

### 4.3 Phase 3: 고도화 (1-2주)
- [ ] 증상 선택 UI
- [ ] 피드백 시스템
- [ ] 성능 최적화
- [ ] 배포 및 모니터링

## 5. 비용 최적화 전략

### 5.1 개발 비용
- **Frontend**: Vercel (무료 플랜)
- **Backend**: Railway (무료 플랜)
- **Database**: SQLite (로컬 저장)
- **AI API**: OpenAI GPT-4 (사용량 기반)

### 5.2 운영 비용 예상
- **월 사용자 100명 기준**
  - OpenAI API: $10-20/월
  - Railway: $5/월
  - **총 예상 비용: $15-25/월**

### 5.3 비용 절약 방안
1. **캐싱 전략**: 동일한 질문에 대한 응답 캐싱
2. **토큰 최적화**: 프롬프트 길이 최적화
3. **사용량 제한**: 일일 사용량 제한 설정
4. **무료 티어 활용**: 각 서비스의 무료 플랜 최대 활용

## 6. 보안 및 규정 준수

### 6.1 개인정보 보호
- 개인정보 수집 최소화
- 세션 기반 임시 저장
- 데이터 암호화

### 6.2 의료 면책조항
- AI 응답의 한계 명시
- 의료진 상담 권고
- 응급 상황 시 즉시 병원 방문 안내

## 7. 성공 지표 (KPI)

### 7.1 사용자 지표
- 일일 활성 사용자 (DAU)
- 세션 지속 시간
- 재방문율

### 7.2 비즈니스 지표
- 사용자 만족도 (피드백 평점)
- 병원 방문 전환율
- 운영 비용 대비 수익

### 7.3 기술 지표
- API 응답 시간
- 시스템 가동률
- 오류 발생률

## 8. 향후 확장 계획

### 8.1 기능 확장
- 다국어 지원
- 음성 인식/합성
- 이미지 업로드 (피부 증상 등)
- 병원 예약 연동

### 8.2 수익화 모델
- 프리미엄 기능 (상세 상담)
- 병원 제휴 수수료
- 의료 보험사 파트너십

## 9. 리스크 관리

### 9.1 기술적 리스크
- AI API 장애 대응
- 데이터 백업 전략
- 확장성 고려

### 9.2 법적 리스크
- 의료법 규정 준수
- 개인정보보호법 준수
- 면책조항 강화

이 설계서를 바탕으로 MVP 개발을 시작하시겠습니까? 