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

## 🚀 최신 업데이트 (Week 3-4)

<<<<<<< Updated upstream
### ✨ 새로 추가된 핵심 기능들
=======
### Frontend
- **React Native 0.79.2**: 크로스 플랫폼 모바일 개발
- **Expo SDK 53**: 개발 도구 및 배포 플랫폼
- **React Navigation 7**: 네비게이션 시스템 (Stack & Bottom Tabs)
>>>>>>> Stashed changes

#### 1. 📝 감정 입력 폼 (EmotionInputScreen)
- **직관적인 감정 선택**: 7가지 감정 카드로 쉬운 선택
- **감정 강도 조절**: 1-5단계 강도 설정
- **상황 태그**: 18개 일반적 상황 태그 선택
- **자유 텍스트**: 1000자 제한 감정 표현
- **실시간 검증**: 사용자 친화적 입력 가이드

<<<<<<< Updated upstream
#### 2. 🧠 CBT 가이드 시스템 (CBTSessionScreen)
**전문적인 4단계 인지행동치료 프로세스:**
- **생각 인식** → **증거 탐색** → **대안적 사고** → **행동 계획**
- 진행도 표시 및 애니메이션
- 맞춤형 질문 시퀀스 (텍스트/척도 입력)
- 단계별 도움말 및 팁 제공

#### 3. 💡 CBT 인사이트 (CBTInsightsScreen)  
- **성장 지표**: Before/After 기분 변화 시각화
- **개인화된 분석**: AI 기반 패턴 인사이트
- **세션 요약**: 확장 가능한 답변 리뷰
- **추천 활동**: 다음 단계 가이드

#### 4. 💭 Inner Talk 개선
- **컨텍스트 인식 대화**: 대화 깊이별 차별화된 AI 응답
- **CBT 자동 제안**: 깊은 대화 후 CBT 가이드 연결
- **빠른 응답 버튼**: 감정별 맞춤 응답
- **실시간 감정 태그**: 현재 감정 상태 표시

## 🎯 핵심 기능 플로우

### 완전한 감정 관리 여정
```
홈 화면 → 감정 기록 → Inner Talk → CBT 가이드 → 인사이트 → 성장
   ↓           ↓          ↓           ↓          ↓        ↓
🏠 시작 → 📝 감정입력 → 💭 AI대화 → 🧠 CBT → 💡 분석 → 🌱 개선
```
=======
### 핵심 라이브러리
- **React Hook Form 7.56**: 폼 관리
- **React Native Elements 3.4**: UI 컴포넌트
- **React Native Chart Kit 6.12**: 데이터 시각화
- **Date-fns 4.1**: 날짜 처리
- **React Native Vector Icons 10.2**: 아이콘 시스템

## 📱 현재 구현된 기능

### ✅ 완료된 핵심 기능
- [x] **프로젝트 기본 구조 설정** - Expo + React Native 환경
- [x] **네비게이션 시스템** - Bottom Tab + Stack Navigation
- [x] **홈 화면** - 퀵 액션 버튼 및 카드 기반 UI
- [x] **Inner Talk 화면** - AI와의 대화 인터페이스
- [x] **API 연결 테스트** - Supabase 및 OpenAI 연동 확인
- [x] **반응형 UI 시스템** - SafeArea 적용 및 크로스 플랫폼 대응
- [x] **로딩 화면** - 브랜드 아이덴티티가 반영된 스플래시

### 🎨 UI/UX 구현 상황
- [x] **브랜드 컬러 시스템** - 차분한 인디고 블루 (#4A5568) 기반
- [x] **감정 카테고리 컬러** - 7가지 감정별 색상 정의
- [x] **카드 기반 레이아웃** - 그림자 효과 및 borderLeft 강조
- [x] **탭 네비게이션** - 이모지 아이콘과 활성 상태 표시
- [x] **반응형 버튼** - activeOpacity 및 터치 피드백
>>>>>>> Stashed changes

## 📁 프로젝트 구조

```
Innerpal/
<<<<<<< Updated upstream
├── App.js                      # 메인 네비게이션 (업데이트됨)
├── screens/
│   ├── InnerTalkScreen.js      # AI 대화 (대폭 개선)
│   ├── EmotionInputScreen.js   # 감정 입력 폼 (신규)
│   ├── CBTSessionScreen.js     # CBT 질문 시퀀스 (신규)
│   ├── CBTInsightsScreen.js    # CBT 완료 인사이트 (신규)
│   ├── HomeScreen.js           # 홈 화면
│   └── ApiTestScreen.js        # API 테스트
├── config/ & lib/ & services/  # 기존 구조 유지
└── components/ & hooks/ & utils/
```

## 🔧 개발 현황

### ✅ 완료된 기능 (Week 3-4)
- [x] **감정 입력 폼 완성** - 직관적인 UI/UX
- [x] **CBT 질문 시퀀스 구현** - 전문적 4단계 프로세스
- [x] **CBT 인사이트 화면** - 세션 완료 후 분석
- [x] **Inner Talk 개선** - 컨텍스트 인식 대화
- [x] **네비게이션 통합** - 모든 화면 연결
- [x] **디자인 시스템 통일** - 일관된 UI/UX

### 🚧 다음 단계 (Week 5-6)
- [ ] 실제 GPT API 연동 (현재 시뮬레이션)
- [ ] Supabase 데이터베이스 저장
- [ ] 사용자 인증 시스템
- [ ] 감정 히스토리 차트

## 🎨 디자인 철학

### 감정 친화적 디자인
- **부드러운 색상**: 차분하고 안정감 있는 컬러 팔레트
- **직관적 아이콘**: 감정별 이모지와 컬러 코딩
- **애니메이션**: 자연스러운 전환과 피드백
- **접근성**: 큰 터치 영역과 명확한 시각적 피드백

### 주요 색상 체계
```
Primary: #4A5568    (안정감 있는 진회색)
Success: #48BB78    (기쁨 - 밝은 초록)
Info: #4299E1       (슬픔 - 차분한 파랑)
Warning: #ED8936    (불안 - 따뜻한 주황)
Danger: #F56565     (분노 - 부드러운 빨강)
Purple: #A78BFA     (놀람 - 신비로운 보라)
Teal: #38B2AC       (혐오 - 차분한 청록)
```

## 🧠 CBT 기능 상세
=======
├── App.js                 # 메인 앱 진입점 (Navigation 설정)
├── package.json           # 의존성 및 스크립트
├── config/
│   └── app.js             # 앱 설정 (컬러, 폰트, 감정 설정)
├── lib/
│   └── supabase.js        # Supabase 클라이언트 및 DB 헬퍼
├── services/
│   └── openai.js          # OpenAI GPT API 서비스
├── components/
│   └── common.js          # 공통 UI 컴포넌트
├── screens/
│   ├── HomeScreen.js      # 메인 홈 화면 (현재 App.js에 임베드)
│   ├── InnerTalkScreen.js # AI 대화 화면
│   └── ApiTestScreen.js   # API 연결 테스트 화면
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
- Expo CLI (`npm install -g @expo/cli`)
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
```

## 🔧 개발 현황 및 진행 상황

### ✅ Week 1-2: 기본 구조 완료
- [x] Expo + React Native 프로젝트 초기화
- [x] React Navigation 설정 (Bottom Tabs + Stack)
- [x] Supabase 클라이언트 연동
- [x] OpenAI API 서비스 구현
- [x] 기본 UI 컴포넌트 시스템
- [x] 홈 화면 구현 (퀵 액션 + 카드 레이아웃)
- [x] Inner Talk 화면 기본 틀
- [x] API 테스트 화면

### 🚧 Week 3-4: 현재 진행 중
- [ ] **사용자 인증 시스템** (Supabase Auth)
- [ ] **Inner Talk 실제 대화 기능** (OpenAI 연동)
- [ ] **감정 입력 폼** (React Hook Form)
- [ ] **감정 기록 저장** (Supabase DB)
- [ ] **HomeScreen.js 독립 파일화** (현재 App.js에 임베드됨)

### 📋 Week 5-6: 예정 기능
- [ ] **CBT 질문 시퀀스 구현**
- [ ] **감정 히스토리 차트** (Chart Kit)
- [ ] **감정 패턴 인사이트**
- [ ] **푸시 알림 시스템** (Expo Notifications)
- [ ] **프로필 설정 화면**

### 🔮 Week 7-8: 고도화
- [ ] **감정 DNA 분석 시스템**
- [ ] **역할극 기반 CBT**
- [ ] **감정 미래 예측**
- [ ] **익명 커뮤니티 기능**
- [ ] **데이터 시각화 고도화**

## 🎨 디자인 시스템

### 컬러 팔레트
```javascript
const APP_CONFIG = {
  colors: {
    background: '#FEFCF0',    // 크림 화이트
    primary: '#4A5568',       // 차분한 인디고 블루
    textLight: '#718096',     // 밝은 회색
    text: '#2D3748',          // 진한 회색
    border: '#E2E8F0',        // 테두리
    textMuted: '#A0AEC0',     // 음소거된 텍스트
  }
};
```

### 감정 카테고리
- 😊 기쁨 (Joy) - `#48BB78`
- 😢 슬픔 (Sadness) - `#4299E1`
- 😠 분노 (Anger) - `#F56565`
- 😰 불안 (Fear) - `#ED8936`
- 😮 놀람 (Surprise) - `#A78BFA`
- 😤 혐오 (Disgust) - `#38B2AC`
- 😐 평온 (Neutral) - `#718096`

## 🔐 환경 변수 설정
>>>>>>> Stashed changes

### 4단계 인지행동치료 프로세스

#### 1단계: 생각 인식하기 💭
```
- 자동 사고 패턴 파악
- 생각의 강도 측정 (1-10 척도)
- 반복되는 사고 패턴 분석
```

#### 2단계: 증거 탐색하기 🔍  
```
- 객관적 증거 vs 주관적 해석 구분
- 반박 증거 찾기
- 타인의 관점에서 바라보기
```

#### 3단계: 대안적 사고 💡
```
- 균형잡힌 관점 모색
- 최악/최고/현실적 시나리오 분석  
- 학습 기회 발견
```

#### 4단계: 행동 계획 🎯
```
- 구체적 대처 방안 수립
- 즉시 실행 가능한 작은 행동
- 기분 변화 추적
```

## 📊 기술적 구현 특징

### 상태 관리
- **React Hooks**: useState, useEffect 활용
- **네비게이션 파라미터**: 화면 간 데이터 전달
- **실시간 검증**: 폼 입력 상태 관리

### UI/UX 개선사항
- **키보드 회피**: KeyboardAvoidingView 적용
- **스크롤 최적화**: 자동 스크롤 및 성능 최적화
- **터치 피드백**: activeOpacity 및 햅틱 피드백
- **로딩 상태**: 자연스러운 로딩 인디케이터

### 애니메이션 시스템
```javascript
// 진행도 바 애니메이션
Animated.timing(progressValue, {
  toValue: currentStep / totalSteps,
  duration: 300,
  useNativeDriver: false
}).start();

// 카드 등장 애니메이션  
Animated.parallel([
  Animated.timing(fadeAnim, { toValue: 1 }),
  Animated.timing(slideAnim, { toValue: 0 })
]).start();
```

## 🚀 설치 및 실행

<<<<<<< Updated upstream
### 빠른 시작
```bash
git clone https://github.com/did88/Innerpal.git
cd Innerpal
npm install
npm start
```

### 새로운 기능 테스트
1. **감정 기록**: 홈 화면 → "감정 기록" 버튼
2. **CBT 가이드**: 감정 기록 후 → "CBT 가이드 시작하기"
3. **AI 대화**: Inner Talk 탭 → 자유로운 대화
4. **인사이트**: CBT 완료 후 자동 연결

## 🎯 사용자 경험 플로우

### 신규 사용자 여정
```
1. 앱 시작 → 스플래시 화면
2. 홈 화면 → 기능 소개 카드들
3. "감정 기록" → 직관적 입력 폼
4. Inner Talk → AI와 자연스러운 대화  
5. CBT 제안 → 전문적 가이드 세션
6. 인사이트 → 성장 분석 및 격려
7. 지속적 사용 → 패턴 인식 및 개선
```

### 재방문 사용자 플로우
```
홈 화면 → 빠른 감정 기록 → Inner Talk 계속
   ↓
이전 CBT 인사이트 확인 → 새로운 세션 시작
```

## 💡 개발 팁 및 베스트 프랙티스

### 코드 구조화
- **컴포넌트 분리**: 재사용 가능한 작은 컴포넌트
- **스타일 분리**: StyleSheet.create() 사용
- **상수 관리**: APP_CONFIG 객체로 중앙 관리

### 성능 최적화
- **이미지 최적화**: 적절한 크기 및 형식 사용
- **메모리 관리**: useEffect cleanup 함수 활용
- **렌더링 최적화**: FlatList 대신 ScrollView 적절히 사용

## 🔮 향후 개발 로드맵

### 단기 목표 (1-2개월)
- [ ] 실제 AI API 연동
- [ ] 데이터 저장 및 동기화
- [ ] 감정 히스토리 차트
- [ ] 사용자 인증 시스템

### 중기 목표 (3-6개월)  
- [ ] 고급 감정 분석 알고리즘
- [ ] 개인화된 CBT 시퀀스
- [ ] 소셜 기능 (익명 커뮤니티)
- [ ] 다국어 지원

### 장기 목표 (6개월+)
- [ ] 웨어러블 디바이스 연동
- [ ] 음성 감정 인식
- [ ] 전문가 연결 서비스
- [ ] 연구 데이터 기여 옵션
=======
// 결과:
// [
//   { step: "사고 인식", question: "그 상황에서 어떤 생각이 들었나요?" },
//   { step: "증거 탐색", question: "그 생각을 뒷받침하는 사실은 무엇인가요?" },
//   { step: "대안 탐색", question: "다른 해석의 여지는 없을까요?" }
// ]
```

### 3. 현재 구현된 화면들

#### 홈 화면 (현재 App.js에 임베드)
- 4개 퀵 액션 버튼 (Inner Talk, 감정 분석, API 테스트, 응급 위로)
- 카드 기반 정보 표시 (새 기능, API 테스트, 인사이트, 기록, 팁)
- 반응형 레이아웃 및 그림자 효과

#### Inner Talk 화면
- AI와의 실시간 대화 인터페이스
- 감정 입력 및 응답 시스템

#### API 테스트 화면
- Supabase 연결 테스트
- OpenAI API 응답 확인
- 실시간 연결 상태 모니터링

## 🚨 현재 알려진 이슈

### 1. 구조적 개선 필요
- **HomeScreen 독립화**: 현재 App.js에 임베드된 HomeScreen 컴포넌트를 별도 파일로 분리 필요
- **config/app.js 활용**: APP_CONFIG가 App.js에 하드코딩되어 있음

### 2. 기능 구현 필요
- **실제 AI 대화**: Inner Talk 화면에서 OpenAI API 실제 연동
- **감정 저장**: 사용자 입력을 Supabase에 저장하는 기능
- **사용자 인증**: 익명 또는 계정 기반 인증 시스템

### 3. 성능 및 UX
- **로딩 상태**: API 호출 시 로딩 인디케이터 추가
- **에러 핸들링**: 네트워크 오류 및 API 오류 처리
- **오프라인 모드**: 기본적인 오프라인 기능 지원
>>>>>>> Stashed changes

## 🤝 기여하기

### 개발에 참여하는 방법
1. **이슈 리포팅**: 버그나 개선사항 제안
2. **기능 개발**: 새로운 화면이나 컴포넌트 추가
3. **디자인 개선**: UI/UX 향상 제안
4. **번역 도움**: 다국어 지원 확대

### 코딩 컨벤션
```javascript
// 컴포넌트명: PascalCase
const EmotionInputScreen = () => {...}

// 함수명: camelCase  
const handleSubmitEmotion = () => {...}

// 상수명: UPPER_SNAKE_CASE
const APP_CONFIG = {...}

// 스타일: camelCase
const styles = StyleSheet.create({
  emotionCard: {...}
});
```

## 📞 지원 및 피드백

- **GitHub Issues**: 기술적 문제 및 기능 요청
- **사용자 피드백**: 앱 내 피드백 기능 (개발 예정)
- **개발자 연락**: @did88

---

**Innerpal** - 당신의 내면의 친구가 되어드립니다 💙

> "감정을 숨기지 말고, 이해하고 받아들이며, 함께 성장해나가요."