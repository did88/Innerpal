# Innerpal

Expo를 사용하여 개발된 React Native 모바일 애플리케이션입니다.

## 🚀 시작하기

### 필수 조건

- Node.js (버전 16 이상)
- npm 또는 yarn
- Expo CLI (`npm install -g expo-cli`)
- 모바일 기기의 Expo Go 앱

### 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/did88/Innerpal.git
cd Innerpal
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
```
`.env` 파일을 편집하여 실제 값을 입력하세요:
- `EXPO_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `EXPO_PUBLIC_OPENAI_API_KEY`: OpenAI API 키

4. 개발 서버 시작
```bash
npm start
```

5. 모바일 기기의 Expo Go 앱으로 QR 코드 스캔

## 🛠 기술 스택

- **React Native**: 크로스 플랫폼 모바일 개발
- **Expo**: 개발 플랫폼 및 도구
- **Supabase**: 백엔드 서비스
- **React Navigation**: 네비게이션 라이브러리
- **React Hook Form**: 폼 처리
- **React Native Elements**: UI 컴포넌트
- **Chart Kit**: 차트 및 데이터 시각화
- **Vector Icons**: 아이콘 라이브러리

## 📁 프로젝트 구조

```
Innerpal/
├── App.js              # 메인 앱 컴포넌트
├── index.js            # 앱 진입점
├── package.json        # 의존성 및 스크립트
├── app.json           # Expo 설정
├── .env.example       # 환경 변수 템플릿
├── .gitignore         # Git 무시 파일
├── README.md          # 프로젝트 문서
└── assets/            # 이미지 및 정적 자원
    ├── icon.png
    ├── adaptive-icon.png
    ├── splash-icon.png
    └── favicon.png
```

## 🔒 보안

- `.env` 파일은 절대 저장소에 커밋하지 마세요
- `.env.example`을 템플릿으로 사용하여 필요한 환경 변수를 확인하세요
- 민감한 데이터는 Expo SecureStore를 사용하여 안전하게 저장하세요

## 📱 사용 가능한 스크립트

- `npm start`: Expo 개발 서버 시작
- `npm run android`: Android 기기/에뮬레이터에서 실행
- `npm run ios`: iOS 기기/시뮬레이터에서 실행
- `npm run web`: 웹 버전으로 실행

## 📋 개발 계획

현재 프로젝트는 초기 설정 단계입니다. 다음과 같은 기능들을 구현할 예정입니다:

### 예정된 기능
- 🔐 사용자 인증 시스템 (Supabase)
- 📊 데이터 시각화 및 차트
- 📱 탭 기반 네비게이션
- 📝 폼 기반 사용자 입력
- 🔔 푸시 알림
- 💾 안전한 로컬 데이터 저장

### 라이브러리별 용도
- **@supabase/supabase-js**: 백엔드 데이터베이스 연동
- **@react-navigation**: 화면 간 이동 및 네비게이션
- **react-native-chart-kit**: 데이터 차트 및 그래프
- **react-hook-form**: 효율적인 폼 관리
- **expo-notifications**: 푸시 알림 기능
- **expo-secure-store**: 민감한 데이터 보안 저장

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/새로운기능`)
3. 변경사항 커밋 (`git commit -m '새로운 기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/새로운기능`)
5. Pull Request 생성

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

## 📄 라이선스

이 프로젝트는 비공개 및 독점 소유입니다.

---

### 💡 개발 팁

1. **환경 설정**: 처음 설정할 때는 `.env.example`을 복사해서 `.env` 파일을 만드세요.
2. **디버깅**: Expo Go 앱에서 디바이스를 흔들면 개발자 메뉴가 나타납니다.
3. **업데이트**: `expo install` 명령어로 Expo SDK와 호환되는 패키지 버전을 설치할 수 있습니다.

### 🔧 문제 해결

- **앱이 실행되지 않는 경우**: `npm start -- --clear` 로 캐시를 지우고 다시 시도해보세요.
- **의존성 오류**: `rm -rf node_modules package-lock.json && npm install` 로 의존성을 재설치하세요.
- **Expo Go 연결 문제**: 같은 WiFi 네트워크에 연결되어 있는지 확인하세요.