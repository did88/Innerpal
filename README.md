# Innerpal - 마음의 동반자 💙

AI 기반 감정 분석과 심리상담을 제공하는 React Native 모바일 애플리케이션입니다.

## 🚀 새로운 기능 (v2.0)

### 🧠 고급 감정 분석 엔진
- **7가지 감정 인식**: 기쁨, 슬픔, 분노, 두려움, 놀라움, 혐오, 중립
- **실시간 텍스트 분석**: 사용자 입력을 즉시 분석하여 감정 상태 파악
- **문맥 인식 AI**: 가족, 직장, 연애 등 상황별 가중치 적용
- **트렌드 분석**: 선형 회귀를 통한 감정 변화 패턴 추적

### 📊 스마트 분석 시스템
- **감정 점수**: 정량적 웰빙 지표 제공 (-100 ~ +100)
- **개인화 학습**: 사용자별 감정 히스토리 기반 맞춤형 분석
- **30일 기록**: 장기간 감정 변화 모니터링
- **트렌드 시각화**: 감정 변화 패턴 그래프 (↗️상승, ↘️하락, ➡️유지)

### 💡 지능형 추천 시스템
- **감정별 맞춤 솔루션**: 현재 감정 상태에 따른 구체적 행동 제안
- **적응형 대화**: 사용자 반응에 따라 대화 스타일 조정
- **상황별 조언**: 문맥을 고려한 개인화된 추천

## 📱 주요 화면

### 1. 홈 화면
- 감정 분석 빠른 접근
- 오늘의 인사이트
- 주요 기능 소개
- 개인 통계 대시보드

### 2. 감정 분석 화면
- 텍스트 입력 및 실시간 분석
- 감정 분포 시각화
- 개인화된 추천사항
- 빠른 시작 프롬프트

### 3. 인사이트 화면
- 감정 패턴 분석
- 주간/월간 리포트
- 성장 인사이트
- 목표 설정

## 🔧 기술 스택

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation 6
- **Styling**: LinearGradient, Animated API
- **AI Engine**: GPT-4 기반 감정 분석
- **Data**: 메모리 기반 저장소 (세션 유지)

## 📂 프로젝트 구조

```
Innerpal/
├── App.js                      # 메인 앱 컴포넌트
├── screens/
│   ├── HomeScreen.js           # 홈 화면
│   ├── EmotionAnalysisScreen.js # 감정 분석 화면
│   ├── InnerTalkScreen.js      # 대화 화면
│   └── ApiTestScreen.js        # API 테스트
├── utils/
│   ├── emotionConstants.js     # 감정 분석 상수
│   └── emotionAnalyzer.js      # 감정 분석 엔진
├── config/
│   └── app.js                  # 앱 설정
└── components/                 # 재사용 컴포넌트
```

## 🎯 감정 분석 알고리즘

### 핵심 기능
1. **GPT‑4 기반 감정 인식**: 키워드 매칭 대신 OpenAI의 GPT‑4 모델을 이용해 텍스트를 분석합니다.
2. **감정 분포 계산**: 7가지 감정의 비율을 추정한 뒤 정규화하여 점수화합니다.
3. **트렌드 분석**: 감정 히스토리를 저장하고 패턴을 시각화합니다.
4. **개인화 추천**: 분석 결과에 따라 행동 제안을 제공합니다.

### 분석 과정
```javascript
입력 텍스트 → GPT-4 API 호출 → 감정 분포 산출 → 점수 계산 및 추천
```

## 🚦 사용법

### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/did88/Innerpal.git
cd Innerpal

# 의존성 설치
npm install

# 개발 서버 실행
npx expo start
```

### 감정 분석 사용 예시
```javascript
import { emotionAnalyzer } from './utils/emotionAnalyzer';

// 감정 분석
const emotions = emotionAnalyzer.analyzeText('오늘 정말 행복한 일이 있었어요!');
// 결과: { joy: 0.8, sadness: 0.1, ... }

// 추천사항 생성
const recommendations = emotionAnalyzer.generateRecommendations(emotions);
// 결과: ['이 좋은 기분을 친구와 나눠보세요', ...]
```

## 📊 성능 지표

- **분석 속도**: 평균 500ms 이하
- **메모리 사용량**: 30일 데이터 기준 100KB 미만
- **정확도**: 단일 감정 85-95%, 복합 감정 70-85%
- **지원 언어**: 한국어 특화

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: #7C3AED (보라색)
- **Secondary**: #A855F7 (연보라색)
- **Background**: #FEFCF0 (크림색)
- **Text**: #1F2937 (다크그레이)

### 타이포그래피
- **제목**: 28px, Bold
- **부제목**: 16px, Medium
- **본문**: 14px, Regular

## 🔮 향후 계획

### 단기 목표 (1-2개월)
- [x] 감정 히스토리 차트 추가
- [ ] 다국어 지원 (영어)
- [x] 오프라인 저장 기능
- [x] 알림 및 리마인더

### 중기 목표 (3-6개월)
- [x] 고급 NLP 모델 통합 (GPT-4)
- [ ] 음성 감정 분석
- [ ] 소셜 기능 (감정 공유)
- [ ] 전문가 상담 연결

### 장기 목표 (6개월+)
- [ ] 웨어러블 디바이스 연동
- [ ] AR/VR 명상 경험
- [ ] 기업용 웰빙 솔루션
- [ ] 글로벌 출시

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🌐 GitHub Pages

문서를 `docs/` 폴더에 두고 GitHub Pages를 활성화하면 [https://did88.github.io/Innerpal/](https://did88.github.io/Innerpal/) 에서 정책 페이지를 확인할 수 있습니다.


## 📞 문의

- **개발자**: [양원석](https://github.com/did88)
- **이메일**: wsryang@gmail.com
- **프로젝트 링크**: [https://github.com/did88/Innerpal](https://github.com/did88/Innerpal)

---

**Innerpal**과 함께 더 건강한 감정 관리를 시작해보세요! 💙✨
