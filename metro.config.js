const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Supabase 호환성을 위한 설정
config.resolver.sourceExts.push('cjs');

// React Native 호환성을 위한 Node.js 폴리필
config.resolver.alias = {
  'crypto': 'react-native-get-random-values',
  'stream': 'readable-stream',
  'url': 'react-native-url-polyfill',
  'util': 'util',
};

module.exports = config;
