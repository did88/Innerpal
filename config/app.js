// Innerpal 앱 설정 - 미니멀 디자인 시스템 (흰색 + 보라색)
export const APP_CONFIG = {
  name: 'Innerpal',
  version: '1.0.0',
  description: 'Your inner friend, always',
  
  // 미니멀 컬러 팔레트 (흰색 + 보라색 조합)
  colors: {
    // 기본 색상
    white: '#FFFFFF',
    purple: '#8B5CF6',        // 메인 보라색 (Violet-500)
    purpleLight: '#A78BFA',   // 라이트 보라색 (Violet-400)
    purpleDark: '#7C3AED',    // 다크 보라색 (Violet-600)
    purpleUltraLight: '#F3F4F6', // 매우 연한 보라색 배경
    
    // 시스템 색상
    background: '#FFFFFF',     // 순백색 배경
    surface: '#FFFFFF',        // 카드 배경
    surfaceGray: '#F9FAFB',    // 연한 회색 (Gray-50)
    
    // 텍스트 색상
    text: '#111827',           // 진한 텍스트 (Gray-900)
    textLight: '#6B7280',      // 밝은 텍스트 (Gray-500)
    textMuted: '#9CA3AF',      // 음소거된 텍스트 (Gray-400)
    textInverse: '#FFFFFF',    // 역전 텍스트 (흰색)
    
    // 보더 및 구분선
    border: '#E5E7EB',         // 기본 테두리 (Gray-200)
    borderLight: '#F3F4F6',    // 연한 테두리 (Gray-100)
    
    // 상태 색상
    success: '#10B981',        // 성공 (Emerald-500)
    warning: '#F59E0B',        // 경고 (Amber-500)
    error: '#EF4444',          // 오류 (Red-500)
    info: '#3B82F6',           // 정보 (Blue-500)
    
    // 그라데이션 (보라색 계열만)
    gradients: {
      primary: ['#8B5CF6', '#A78BFA'],      // 메인 보라색 그라데이션
      light: ['#C4B5FD', '#DDD6FE'],        // 연한 보라색
      dark: ['#7C3AED', '#6D28D9'],         // 진한 보라색
      subtle: ['#F9FAFB', '#F3F4F6'],       // 미묘한 회색
    }
  },
  
  // 미니멀 타이포그래피
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  
  // 미니멀 스페이싱 (4px 기반)
  spacing: {
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
    '8': 32,
    '10': 40,
    '12': 48,
    '16': 64,
    '20': 80,
  },
  
  // 미니멀 보더 반지름
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },
  
  // 미니멀 그림자
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
  },
}

// 감정 관련 설정 - 보라색 계열로 통일
export const EMOTION_CONFIG = {
  categories: [
    { 
      id: 'joy', 
      name: '기쁨', 
      color: '#8B5CF6',     // 보라색
      lightColor: '#F3F4F6',
      emoji: '😊',
    },
    { 
      id: 'sadness', 
      name: '슬픔', 
      color: '#6B7280',     // 회색
      lightColor: '#F9FAFB',
      emoji: '😢',
    },
    { 
      id: 'anger', 
      name: '분노', 
      color: '#EF4444',     // 빨간색 (유지)
      lightColor: '#FEF2F2',
      emoji: '😠',
    },
    { 
      id: 'fear', 
      name: '불안', 
      color: '#F59E0B',     // 주황색 (유지)
      lightColor: '#FFFBEB',
      emoji: '😰',
    },
    { 
      id: 'surprise', 
      name: '놀람', 
      color: '#A78BFA',     // 연한 보라색
      lightColor: '#F5F3FF',
      emoji: '😮',
    },
    { 
      id: 'disgust', 
      name: '혐오', 
      color: '#6B7280',     // 회색
      lightColor: '#F9FAFB',
      emoji: '😤',
    },
    { 
      id: 'neutral', 
      name: '평온', 
      color: '#9CA3AF',     // 연한 회색
      lightColor: '#F9FAFB',
      emoji: '😐',
    },
  ],
  
  intensityLevels: [
    { level: 1, label: '아주 약함', color: '#F3F4F6', opacity: 0.2 },
    { level: 2, label: '약함', color: '#E5E7EB', opacity: 0.4 },
    { level: 3, label: '보통', color: '#9CA3AF', opacity: 0.6 },
    { level: 4, label: '강함', color: '#6B7280', opacity: 0.8 },
    { level: 5, label: '아주 강함', color: '#374151', opacity: 1.0 },
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

// 미니멀 UI 프리셋
export const UI_PRESETS = {
  // 미니멀 버튼 스타일
  buttons: {
    primary: {
      backgroundColor: APP_CONFIG.colors.purple,
      borderRadius: APP_CONFIG.borderRadius.lg,
      paddingVertical: APP_CONFIG.spacing['4'],
      paddingHorizontal: APP_CONFIG.spacing['6'],
      ...APP_CONFIG.shadows.base,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: APP_CONFIG.colors.border,
      borderRadius: APP_CONFIG.borderRadius.lg,
      paddingVertical: APP_CONFIG.spacing['4'],
      paddingHorizontal: APP_CONFIG.spacing['6'],
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: APP_CONFIG.borderRadius.lg,
      paddingVertical: APP_CONFIG.spacing['3'],
      paddingHorizontal: APP_CONFIG.spacing['4'],
    }
  },
  
  // 미니멀 카드 스타일
  cards: {
    default: {
      backgroundColor: APP_CONFIG.colors.white,
      borderRadius: APP_CONFIG.borderRadius.xl,
      padding: APP_CONFIG.spacing['6'],
      borderWidth: 1,
      borderColor: APP_CONFIG.colors.borderLight,
      ...APP_CONFIG.shadows.sm,
    },
    elevated: {
      backgroundColor: APP_CONFIG.colors.white,
      borderRadius: APP_CONFIG.borderRadius.xl,
      padding: APP_CONFIG.spacing['6'],
      ...APP_CONFIG.shadows.lg,
    },
    surface: {
      backgroundColor: APP_CONFIG.colors.surfaceGray,
      borderRadius: APP_CONFIG.borderRadius.lg,
      padding: APP_CONFIG.spacing['4'],
      borderWidth: 1,
      borderColor: APP_CONFIG.colors.borderLight,
    }
  }
}
