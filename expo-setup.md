# Expo 개발 환경 완전 설정 가이드

## 🚀 빠른 시작 (5분 설정)

### 1단계: 기본 도구 설치

```bash
# Node.js 18+ 설치 확인
node --version

# Expo CLI 설치 (글로벌)
npm install -g @expo/cli

# Expo 계정 로그인 (선택사항)
npx expo login
```

### 2단계: 프로젝트 설정

```bash
# 프로젝트 클론
git clone https://github.com/did88/Innerpal.git
cd Innerpal

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

### 3단계: 앱 실행

```bash
# 개발 서버 시작
npx expo start

# QR 코드가 나타나면:
# - iOS: 카메라 앱으로 QR 코드 스캔
# - Android: Expo Go 앱으로 QR 코드 스캔
```

## 📱 디바이스별 설정

### iOS 설정

1. **App Store에서 Expo Go 설치**
2. **시뮬레이터 사용 (Mac만 해당)**:
   ```bash
   # Xcode 설치 후
   npx expo start --ios
   ```

### Android 설정

1. **Google Play에서 Expo Go 설치**
2. **에뮬레이터 사용**:
   ```bash
   # Android Studio 설치 후
   npx expo start --android
   ```

### 웹 브라우저 테스트

```bash
# 웹에서 바로 테스트
npx expo start --web
```

## 🔧 고급 설정

### 개발 도구 설치

```bash
# React DevTools
npm install -g react-devtools

# Flipper (디버깅용)
# https://fbflipper.com/에서 다운로드
```

### VS Code 확장 프로그램

1. **ES7+ React/Redux/React-Native snippets**
2. **React Native Tools** 
3. **Expo Tools**
4. **Auto Rename Tag**
5. **Bracket Pair Colorizer**

### Git 설정

```bash
# 커밋 전 자동 포맷팅
npm install --save-dev husky prettier

# .gitignore 확인
echo "node_modules/
.expo/
.env
dist/
*.log" > .gitignore
```

## 🐛 문제 해결

### 일반적인 오류들

1. **"Expo CLI not found"**
   ```bash
   npm install -g @expo/cli
   ```

2. **"Metro bundler failed"**
   ```bash
   npx expo start --clear
   ```

3. **"Cannot connect to development server"**
   - 같은 WiFi 네트워크 확인
   - 방화벽 설정 확인
   - `npx expo start --tunnel` 시도

4. **"Module not found"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 성능 최적화

```bash
# 빠른 새로고침 활성화
npx expo start --dev-client

# 터널 모드 (느리지만 안정적)
npx expo start --tunnel

# 오프라인 모드
npx expo start --offline
```

## 📦 빌드 및 배포

### 개발 빌드

```bash
# Android APK 생성
npx expo build:android

# iOS IPA 생성 (Mac 필요)
npx expo build:ios
```

### 프로덕션 배포

```bash
# EAS Build 설정
npx expo install @expo/cli
npx eas build:configure

# 앱 스토어 제출
npx eas submit
```

## 🔍 디버깅 팁

### 로그 확인

```bash
# 상세 로그 표시
npx expo start --dev-client

# 원격 디버깅
npx expo start --dev-client --clear
```

### 퍼포먼스 모니터링

```bash
# 번들 크기 분석
npx expo export --dump-sourcemap

# 메모리 사용량 확인
# 앱 내에서 React DevTools 사용
```

## ⚙️ 설정 파일 최적화

### app.json 설정

```json
{
  "expo": {
    "name": "Innerpal",
    "slug": "innerpal",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FEFCF0"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.innerpal.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FEFCF0"
      },
      "package": "com.innerpal.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### metro.config.js 최적화

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 속도 최적화
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
```

## 📊 모니터링 및 분석

### 앱 성능 분석

```bash
# 번들 분석
npx expo export --dump-sourcemap
npx react-native-bundle-visualizer

# 크래시 리포트
npx expo install expo-application expo-constants
```

### 사용자 경험 분석

```bash
# Expo Analytics 설정
npx expo install expo-analytics-amplitude

# 성능 메트릭 수집
npx expo install @react-native-async-storage/async-storage
```

## 🌐 배포 체크리스트

### 배포 전 확인사항

- [ ] 다양한 디바이스에서 테스트 완료
- [ ] 성능 최적화 완료
- [ ] 오류 처리 및 로깅 설정
- [ ] 앱 아이콘 및 스플래시 스크린 완성
- [ ] 앱 스토어 설명 및 스크린샷 준비
- [ ] 개인정보처리방침 및 이용약관 준비

### 성능 벤치마크

- 앱 시작 시간: < 3초
- 화면 전환 시간: < 500ms
- 메모리 사용량: < 100MB
- 배터리 사용량: 일반적 수준

---

이 가이드를 따라하면 Innerpal 앱을 성공적으로 개발하고 배포할 수 있습니다. 추가 도움이 필요하면 GitHub Issues를 통해 문의해주세요!