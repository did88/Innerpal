# Innerpal 🌙

**"Your inner friend, always"**

한국인의 감정을 이해하고 공감하는 AI 기반 감정 관리 앱입니다. 혼자서도 마음을 다정하게 돌볼 수 있도록 도와드립니다.

## 🎯 프로젝트 소개

Innerpal은 다음과 같은 차별화된 기능을 제공합니다:

- **🤖 AI 감정 동반자**: GPT 기반 개인화된 감정 분석 및 공감 대화
- **🧠 CBT 기반 치유**: 인지행동치료 원리를 적용한 자동 질문 시퀀스
- **📊 감정 인사이트**: 개인 감정 패턴 분석 및 성장 여정 추적
- **🇰🇷 한국어 특화**: 한국인의 감정 표현 방식에 최적화된 AI 모델
- **🔒 프라이버시 우선**: 안전하고 익명적인 감정 기록 환경

## 🚀 기술 스택

### Frontend
- **React Native**: 크로스 플랫폼 모바일 개발
- **Expo**: 개발 도구 및 배포 플랫폼
- **React Navigation**: 네비게이션 시스템

### Backend & AI
- **Supabase**: 실시간 데이터베이스 및 인증
- **OpenAI GPT-4**: 감정 분석 및 대화 생성
- **PostgreSQL**: 감정 데이터 저장 및 분석

### 핵심 라이브러리
- **React Hook Form**: 폼 관리
- **React Native Elements**: UI 컴포넌트
- **Chart Kit**: 데이터 시각화
- **Date-fns**: 날짜 처리

## 📁 프로젝트 구조

```
Innerpal/
├── App.js                 # 메인 앱 진입점
├── config/
│   └── app.js             # 앱 설정 (컬러, 폰트, 감정 설정)
├── lib/
│   └── supabase.js        # Supabase 클라이언트 및 DB 헬퍼
├── services/
│   └── openai.js          # OpenAI GPT API 서비스
├── components/
│   └── common.js          # 공통 UI 컴포넌트
├── screens/
│   └── HomeScreen.js      # 메인 홈 화면
├── hooks/
│   └── index.js           # 커스텀 React 훅들
├── utils/
│   └── index.js           # 유틸리티 함수들
└── assets/                # 이미지 및 정적 자원
```

## 🛠 설치 및 실행

### 필수 조건
- Node.js (16.0 이상)
- npm 또는 yarn
- Expo CLI
- 모바일 기기의 Expo Go 앱

### 설치 단계

1. **저장소 클론**
```bash
git clone https://github.com/did88/Innerpal.git
cd Innerpal
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env
```

`.env` 파일을 편집하여 다음 값들을 설정하세요:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

4. **개발 서버 시작**
```bash
npm start
```

5. **모바일에서 실행**
   - 스마트폰에 Expo Go 앱 설치
   - 터미널에 표시된 QR 코드 스캔
   - 또는 `a` (Android) / `i` (iOS) 키를 눌러 에뮬레이터에서 실행

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#4A5568` (차분한 인디고 블루)
- **Secondary**: `#A78BFA` (따뜻한 라벤더)
- **Accent**: `#F6E05E` (소프트 골드)
- **Background**: `#FEFCF0` (크림 화이트)

### 감정 카테고리
- 😊 기쁨 (Joy) - `#48BB78`
- 😢 슬픔 (Sadness) - `#4299E1`
- 😠 분노 (Anger) - `#F56565`
- 😰 불안 (Fear) - `#ED8936`
- 😮 놀람 (Surprise) - `#A78BFA`
- 😤 혐오 (Disgust) - `#38B2AC`
- 😐 평온 (Neutral) - `#718096`

## 🔧 개발 현황

### ✅ 완료된 기능 (Week 1-2)
- [x] 프로젝트 기본 구조 설정
- [x] Supabase 데이터베이스 연동
- [x] OpenAI GPT API 서비스 구현
- [x] 기본 UI 컴포넌트 시스템
- [x] 홈 화면 구현
- [x] 커스텀 훅 상태 관리
- [x] 유틸리티 함수 라이브러리

### 🚧 진행 중 (Week 3-4)
- [ ] 사용자 인증 시스템
- [ ] Inner Talk 화면 (AI 대화)
- [ ] 감정 입력 폼
- [ ] 기본 감정 기록 저장

### 📋 예정 기능 (Week 5-8)
- [ ] CBT 질문 시퀀스 구현
- [ ] 감정 히스토리 차트
- [ ] 감정 패턴 인사이트
- [ ] 푸시 알림 시스템

### 🔮 향후 계획 (Week 9+)
- [ ] 감정 DNA 분석 시스템
- [ ] 역할극 기반 CBT
- [ ] 감정 미래 예측
- [ ] 익명 커뮤니티 기능

## 📊 사용 가능한 스크립트

```bash
# 개발 서버 시작
npm start

# Android에서 실행
npm run android

# iOS에서 실행 (macOS 필요)
npm run ios

# 웹에서 실행
npm run web

# 의존성 정리
npm run clean

# 타입 체크 (TypeScript 전환 시)
npm run type-check
```

## 🔐 환경 변수 설정

### Supabase 설정
1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. Settings > API에서 URL과 anon key 복사
3. `.env` 파일에 추가

### OpenAI 설정
1. [platform.openai.com](https://platform.openai.com)에서 API 키 생성
2. `.env` 파일에 추가
3. 사용량 제한 설정 권장

## 🗃️ 데이터베이스 스키마

### 주요 테이블 구조

```sql
-- 사용자 프로필
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  personality TEXT,
  comfort_style TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 감정 기록
CREATE TABLE emotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  emotion_text TEXT NOT NULL,
  primary_emotion TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  emotion_tags TEXT[],
  gpt_response TEXT,
  cbt_conversation JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 감정 패턴 분석
CREATE TABLE emotion_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  period_type TEXT CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  pattern_data JSONB,
  insights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 핵심 기능 상세

### 1. AI 감정 분석
```javascript
// 감정 텍스트 분석 예시
const result = await openAIService.analyzeEmotion(
  "오늘 직장에서 상사에게 혼났어. 정말 기분이 안 좋아."
);

// 결과:
// {
//   primary_emotion: "분노",
//   intensity: 4,
//   keywords: ["혼났어", "기분이 안 좋아"],
//   empathy_response: "직장에서 힘든 일이 있으셨군요..."
// }
```

### 2. CBT 질문 시퀀스
```javascript
// CBT 기반 인지재구성 질문 생성
const questions = await openAIService.generateCBTQuestions(emotionAnalysis);

// 결과:
// [
//   { step: "사고 인식", question: "그 상황에서 어떤 생각이 들었나요?" },
//   { step: "증거 탐색", question: "그 생각을 뒷받침하는 사실은 무엇인가요?" },
//   { step: "대안 탐색", question: "다른 해석의 여지는 없을까요?" }
// ]
```

### 3. 감정 패턴 인사이트
- 주간/월간 감정 트렌드 분석
- 감정 촉발 요인 패턴 발견
- 개인화된 성장 제안
- 감정 회복 속도 측정

## 🚨 문제 해결

### 자주 발생하는 문제들

**1. 앱이 실행되지 않는 경우**
```bash
# 캐시 클리어 후 재시작
npm start -- --clear
```

**2. 의존성 충돌**
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

**3. Expo Go 연결 안됨**
- 같은 WiFi 네트워크 확인
- 방화벽 설정 확인
- Expo CLI 최신 버전 업데이트

**4. GPT API 오류**
- OpenAI API 키 확인
- API 사용량 한도 확인
- 네트워크 연결 상태 확인

## 🤝 기여하기

Innerpal 프로젝트에 기여해주시는 모든 분들을 환영합니다!

### 기여 방법
1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/새로운기능`)
3. 변경사항 커밋 (`git commit -m '새로운 기능 추가'`)
4. 브랜치에 Push (`git push origin feature/새로운기능`)
5. Pull Request 생성

### 코딩 컨벤션
- **파일명**: PascalCase (컴포넌트), camelCase (유틸리티)
- **함수명**: camelCase
- **상수명**: UPPER_SNAKE_CASE
- **컴포넌트**: 함수형 컴포넌트 + 훅 사용
- **스타일**: StyleSheet.create() 사용

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 등
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 문의사항이나 제안이 있으시면 언제든 연락해주세요:

- **GitHub Issues**: [Issues 페이지](https://github.com/did88/Innerpal/issues)
- **프로젝트 관리자**: @did88

## 🙏 감사의 말

- **OpenAI**: GPT-4 API 제공
- **Supabase**: 훌륭한 백엔드 서비스
- **Expo 팀**: 모바일 개발 도구
- **React Native 커뮤니티**: 지속적인 지원과 라이브러리들

---

**Innerpal - 당신의 내면의 친구가 되어드립니다 💙**

> "감정을 숨기지 말고, 이해하고 받아들이며, 함께 성장해나가요."