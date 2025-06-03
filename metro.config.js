const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Supabase 호환성을 위한 최소한의 설정
config.resolver.sourceExts.push('cjs');

module.exports = config;