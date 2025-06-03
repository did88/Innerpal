// Innerpal 앱 설정 - 모던 디자인 시스템
export const APP_CONFIG = {
  name: 'Innerpal',
  version: '1.0.0',
  description: 'Your inner friend, always',
  
  // 모던한 컬러 팔레트 (다크 모드 대응)
  colors: {
    // 기본 브랜드 컬러 (그라데이션 기반)
    primary: '#6366F1',        // 인디고 (Indigo-500)
    primaryDark: '#4F46E5',    // 인디고 (Indigo-600)
    primaryLight: '#818CF8',   // 인디고 (Indigo-400)
    
    // 세컨더리 컬러
    secondary: '#EC4899',      // 핑크 (Pink-500)
    secondaryDark: '#DB2777',  // 핑크 (Pink-600)
    secondaryLight: '#F472B6', // 핑크 (Pink-400)
    
    // 액센트 컬러
    accent: '#F59E0B',         // 앰버 (Amber-500)
    accentDark: '#D97706',     // 앰버 (Amber-600)
    accentLight: '#FBBF24',    // 앰버 (Amber-400)
    
    // 배경 및 서페이스
    background: '#FAFAFA',     // 그레이 (Gray-50)
    backgroundDark: '#111827', // 그레이 (Gray-900)
    surface: '#FFFFFF',        // 순백
    surfaceDark: '#1F2937',    // 그레이 (Gray-800)
    
    // 글래스모피즘 배경
    glass: 'rgba(255, 255, 255, 0.25)',
    glassDark: 'rgba(31, 41, 55, 0.25)',
    
    // 텍스트 컬러
    text: '#111827',           // 그레이 (Gray-900)
    textLight: '#6B7280',      // 그레이 (Gray-500)
    textMuted: '#9CA3AF',      // 그레이 (Gray-400)
    textInverse: '#F9FAFB',    // 그레이 (Gray-50)
    
    // 상태 컬러
    success: '#10B981',        // 에메랄드 (Emerald-500)
    warning: '#F59E0B',        // 앰버 (Amber-500)
    error: '#EF4444',          // 레드 (Red-500)
    info: '#3B82F6',           // 블루 (Blue-500)
    
    // 경계선 및 구분선
    border: '#E5E7EB',         // 그레이 (Gray-200)
    borderLight: '#F3F4F6',    // 그레이 (Gray-100)
    
    // 그라데이션 색상
    gradients: {
      primary: ['#6366F1', '#EC4899'],
      warm: ['#F59E0B', '#EF4444'],
      cool: ['#3B82F6', '#6366F1'],
      nature: ['#10B981', '#059669'],
    }
  },
  
  // 모던 타이포그래피
  fonts: {
    // 시스템 폰트 스택
    regular: 'System',
    medium: 'System',
    bold: 'System',
    
    // 폰트 크기 (스케일 기반)
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
      '6xl': 60,
    },
    
    // 라인 높이
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    // 폰트 두께
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },
  
  // 스페이싱 시스템 (8px 기반)
  spacing: {
    '0': 0,
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
    '24': 96,
  },
  
  // 모던 보더 반지름
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  // 향상된 그림자 시스템
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 16,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 24,
    },
    // 글로우 효과
    glow: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
  },
  
  // 애니메이션 듀레이션
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  
  // 레이아웃 브레이크포인트
  breakpoints: {
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
}

// 감정 관련 설정 - 모던 디자인
export const EMOTION_CONFIG = {
  // 기본 감정 카테고리 (더 세련된 컬러)
  categories: [
    { 
      id: 'joy', 
      name: '기쁨', 
      color: '#10B981', 
      lightColor: '#D1FAE5',
      emoji: '😊',
      gradient: ['#10B981', '#059669']
    },
    { 
      id: 'sadness', 
      name: '슬픔', 
      color: '#3B82F6', 
      lightColor: '#DBEAFE',
      emoji: '😢',
      gradient: ['#3B82F6', '#2563EB']
    },
    { 
      id: 'anger', 
      name: '분노', 
      color: '#EF4444', 
      lightColor: '#FEE2E2',
      emoji: '😠',
      gradient: ['#EF4444', '#DC2626']
    },
    { 
      id: 'fear', 
      name: '불안', 
      color: '#F59E0B', 
      lightColor: '#FEF3C7',
      emoji: '😰',
      gradient: ['#F59E0B', '#D97706']
    },
    { 
      id: 'surprise', 
      name: '놀람', 
      color: '#8B5CF6', 
      lightColor: '#EDE9FE',
      emoji: '😮',
      gradient: ['#8B5CF6', '#7C3AED']
    },
    { 
      id: 'disgust', 
      name: '혐오', 
      color: '#06B6D4', 
      lightColor: '#CFFAFE',
      emoji: '😤',
      gradient: ['#06B6D4', '#0891B2']
    },
    { 
      id: 'neutral', 
      name: '평온', 
      color: '#6B7280', 
      lightColor: '#F3F4F6',
      emoji: '😐',
      gradient: ['#6B7280', '#4B5563']
    },
  ],
  
  // 감정 강도 레벨 (모던한 시각화)
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

// UI 컴포넌트 스타일 프리셋
export const UI_PRESETS = {
  // 버튼 스타일들
  buttons: {
    primary: {
      backgroundColor: APP_CONFIG.colors.primary,
      borderRadius: APP_CONFIG.borderRadius.xl,
      paddingVertical: APP_CONFIG.spacing['4'],
      paddingHorizontal: APP_CONFIG.spacing['6'],
      ...APP_CONFIG.shadows.md,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: APP_CONFIG.colors.primary,
      borderRadius: APP_CONFIG.borderRadius.xl,
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
  
  // 카드 스타일들
  cards: {
    default: {
      backgroundColor: APP_CONFIG.colors.surface,
      borderRadius: APP_CONFIG.borderRadius['2xl'],
      padding: APP_CONFIG.spacing['6'],
      marginBottom: APP_CONFIG.spacing['4'],
      ...APP_CONFIG.shadows.md,
    },
    glass: {
      backgroundColor: APP_CONFIG.colors.glass,
      borderRadius: APP_CONFIG.borderRadius['2xl'],
      padding: APP_CONFIG.spacing['6'],
      marginBottom: APP_CONFIG.spacing['4'],
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      ...APP_CONFIG.shadows.lg,
    },
    elevated: {
      backgroundColor: APP_CONFIG.colors.surface,
      borderRadius: APP_CONFIG.borderRadius['3xl'],
      padding: APP_CONFIG.spacing['8'],
      marginBottom: APP_CONFIG.spacing['6'],
      ...APP_CONFIG.shadows.xl,
    }
  }
}