// Innerpal 앱 설정
export const APP_CONFIG = {
  name: 'Innerpal',
  version: '1.0.0',
  description: 'Your inner friend, always',
  
  // Innerpal 브랜드 컬러
  colors: {
    primary: '#4A5568',      // 차분한 인디고 블루
    secondary: '#A78BFA',    // 따뜻한 라벤더
    accent: '#F6E05E',       // 소프트 골드
    background: '#FEFCF0',   // 크림 화이트
    surface: '#FFFFFF',      // 순백
    text: '#2D3748',         // 진한 그레이
    textLight: '#718096',    // 연한 그레이
    textMuted: '#A0AEC0',    // 뮤트 그레이
    border: '#E2E8F0',       // 경계선
    success: '#48BB78',      // 성공 색상
    warning: '#ED8936',      // 경고 색상
    error: '#F56565',        // 오류 색상
    info: '#4299E1',         // 정보 색상
  },
  
  // 폰트 설정
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    }
  },
  
  // 간격 설정
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // 둥근 모서리
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  
  // 그림자
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
}

// 감정 관련 설정
export const EMOTION_CONFIG = {
  // 기본 감정 카테고리
  categories: [
    { id: 'joy', name: '기쁨', color: '#48BB78', emoji: '😊' },
    { id: 'sadness', name: '슬픔', color: '#4299E1', emoji: '😢' },
    { id: 'anger', name: '분노', color: '#F56565', emoji: '😠' },
    { id: 'fear', name: '불안', color: '#ED8936', emoji: '😰' },
    { id: 'surprise', name: '놀람', color: '#A78BFA', emoji: '😮' },
    { id: 'disgust', name: '혐오', color: '#38B2AC', emoji: '😤' },
    { id: 'neutral', name: '평온', color: '#718096', emoji: '😐' },
  ],
  
  // 감정 강도 레벨
  intensityLevels: [
    { level: 1, label: '아주 약함', color: '#E2E8F0' },
    { level: 2, label: '약함', color: '#CBD5E0' },
    { level: 3, label: '보통', color: '#A0AEC0' },
    { level: 4, label: '강함', color: '#718096' },
    { level: 5, label: '아주 강함', color: '#4A5568' },
  ]
}

// API 설정
export const API_CONFIG = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  openai: {
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 500,
  }
}