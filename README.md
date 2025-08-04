# 의료 AI 챗봇 서비스

## 📋 프로젝트 소개

의료 특화 AI 챗봇 서비스로, 사용자가 증상을 설명하면 AI가 의사처럼 대화하며 증상을 파악하고 적절한 조언을 제공합니다.

## ✨ 주요 기능

- 🤖 **AI 기반 대화형 진료**: OpenAI GPT-3.5-turbo 모델 사용
- 🎯 **자동 증상 분석**: 충분한 정보 수집 시 자동으로 요약 제공
- ⚠️ **응급 상황 감지**: 위험한 증상 시 즉시 병원 방문 권고
- 📱 **반응형 디자인**: 모바일/데스크톱 모두 지원
- 💰 **무료 호스팅**: Vercel 무료 플랜 사용

## 🚀 배포 방법

### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

### 2. Vercel 로그인
```bash
vercel login
```

### 3. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정:
- `OPENAI_API_KEY`: OpenAI API 키

### 4. 배포 실행
```bash
vercel --prod
```

## 🛠️ 로컬 개발

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 📁 프로젝트 구조

```
├── app/
│   ├── api/chat/route.ts    # AI 챗봇 API
│   ├── chat/page.tsx        # 채팅 페이지
│   └── page.tsx             # 메인 페이지
├── components/              # 재사용 컴포넌트
├── styles/                  # 스타일 파일
└── public/                  # 정적 파일
```

## 🔧 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-3.5-turbo
- **Hosting**: Vercel (무료)

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 