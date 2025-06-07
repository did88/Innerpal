@echo off
echo [1] JS 번들 생성 중...
mkdir android\app\src\main\assets 2>nul
npx react-native bundle ^
  --platform android ^
  --dev false ^
  --entry-file index.js ^
  --bundle-output android/app/src/main/assets/index.android.bundle ^
  --assets-dest android/app/src/main/res

echo [2] 릴리즈 APK 빌드 중...
cd android
call gradlew.bat assembleRelease
cd ..

echo [✅] 빌드 완료!
echo APK 경로: android\app\build\outputs\apk\release\app-release.apk
