#!/bin/bash
set -euo pipefail

# [1] Generate JS bundle
mkdir -p android/app/src/main/assets
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# [2] Build release APK
cd android
./gradlew assembleRelease
cd ..

echo "[✅] 빌드 완료!"
echo "APK 경로: android/app/build/outputs/apk/release/app-release.apk"
