import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 포맷팅 유틸리티
 */
export const dateUtils = {
  // 상대적 시간 표시 (예: "3분 전", "2시간 전")
  formatRelative: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ko });
  },

  // 절대 시간 표시 (예: "2025년 6월 2일 오후 1:30")
  formatAbsolute: (date, formatString = 'yyyy년 M월 d일 a h:mm') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString, { locale: ko });
  },

  // 날짜만 표시 (예: "6월 2일")
  formatDateOnly: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'M월 d일', { locale: ko });
  },

  // 시간만 표시 (예: "오후 1:30")
  formatTimeOnly: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'a h:mm', { locale: ko });
  },

  // 오늘인지 확인
  isToday: (date) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  },

  // 어제인지 확인
  isYesterday: (date) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateObj.toDateString() === yesterday.toDateString();
  }
};

/**
 * 감정 분석 유틸리티
 */
export const emotionUtils = {
  // 감정 텍스트에서 키워드 추출
  extractEmotionKeywords: (text) => {
    const emotionKeywords = {
      joy: ['기쁘', '행복', '즐거', '신나', '좋아', '만족', '감사', '희망'],
      sadness: ['슬프', '우울', '눈물', '외로', '허전', '아쉬', '그리', '실망'],
      anger: ['화나', '짜증', '분노', '열받', '억울', '불만', '답답', '빡쳐'],
      fear: ['무서', '불안', '걱정', '두려', '긴장', '스트레스', '초조', '떨려'],
      surprise: ['놀라', '신기', '의외', '깜짝', '갑작스', '예상치'],
      disgust: ['싫어', '혐오', '역겨', '불쾌', '짜증나'],
      neutral: ['평범', '그냥', '보통', '괜찮', '무난']
    };

    const results = {};
    const normalizedText = text.toLowerCase();

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => normalizedText.includes(keyword));
      if (matches.length > 0) {
        results[emotion] = matches;
      }
    });

    return results;
  },

  // 감정 강도 계산 (1-5)
  calculateIntensity: (text) => {
    const intensityKeywords = {
      5: ['정말', '너무', '진짜', '완전히', '극도로', '엄청', '최고로'],
      4: ['많이', '상당히', '꽤', '제법', '심하게'],
      3: ['조금', '약간', '다소', '어느 정도'],
      2: ['살짝', '미묘하게', '은근히'],
      1: ['거의', '별로', '그다지']
    };

    const normalizedText = text.toLowerCase();
    
    for (let level = 5; level >= 1; level--) {
      if (intensityKeywords[level].some(keyword => normalizedText.includes(keyword))) {
        return level;
      }
    }
    
    return 3; // 기본값
  },

  // 감정 색상 가져오기
  getEmotionColor: (emotionId) => {
    const emotionColors = {
      joy: '#48BB78',
      sadness: '#4299E1',
      anger: '#F56565',
      fear: '#ED8936',
      surprise: '#A78BFA',
      disgust: '#38B2AC',
      neutral: '#718096',
    };
    return emotionColors[emotionId] || emotionColors.neutral;
  },

  // 감정 이모지 가져오기
  getEmotionEmoji: (emotionId) => {
    const emotionEmojis = {
      joy: '😊',
      sadness: '😢',
      anger: '😠',
      fear: '😰',
      surprise: '😮',
      disgust: '😤',
      neutral: '😐',
    };
    return emotionEmojis[emotionId] || emotionEmojis.neutral;
  }
};

/**
 * 텍스트 유틸리티
 */
export const textUtils = {
  // 텍스트 길이 제한
  truncate: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // 단어 수 계산
  countWords: (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  },

  // 문장 수 계산
  countSentences: (text) => {
    if (!text) return 0;
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  },

  // 텍스트에서 해시태그 추출
  extractHashtags: (text) => {
    if (!text) return [];
    const hashtagRegex = /#[\w가-힣]+/g;
    return text.match(hashtagRegex) || [];
  },

  // 민감한 정보 마스킹
  maskSensitiveInfo: (text) => {
    if (!text) return '';
    
    // 전화번호 마스킹
    text = text.replace(/(\d{3})-?(\d{4})-?(\d{4})/g, '$1-****-$3');
    
    // 이메일 마스킹
    text = text.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, user, domain) => {
      const maskedUser = user.length > 2 ? user.substring(0, 2) + '*'.repeat(user.length - 2) : user;
      return maskedUser + '@' + domain;
    });
    
    return text;
  }
};

/**
 * 검증 유틸리티
 */
export const validationUtils = {
  // 이메일 유효성 검사
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // 비밀번호 강도 검사
  checkPasswordStrength: (password) => {
    if (!password) return { score: 0, message: '비밀번호를 입력해주세요.' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const messages = {
      0: '매우 약함',
      1: '약함',
      2: '보통',
      3: '양호',
      4: '강함',
      5: '매우 강함'
    };
    
    return {
      score,
      message: messages[score],
      checks
    };
  },

  // 텍스트 길이 검사
  isValidTextLength: (text, min = 1, max = 1000) => {
    if (!text) return false;
    return text.length >= min && text.length <= max;
  }
};

/**
 * 저장소 유틸리티
 */
export const storageUtils = {
  // 로컬 데이터 캐싱
  cache: new Map(),

  // 캐시에 데이터 저장
  setCache: (key, data, ttl = 5 * 60 * 1000) => { // 기본 5분
    const expiry = Date.now() + ttl;
    storageUtils.cache.set(key, { data, expiry });
  },

  // 캐시에서 데이터 가져오기
  getCache: (key) => {
    const item = storageUtils.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      storageUtils.cache.delete(key);
      return null;
    }
    
    return item.data;
  },

  // 캐시 클리어
  clearCache: () => {
    storageUtils.cache.clear();
  },

  // 만료된 캐시 정리
  cleanExpiredCache: () => {
    const now = Date.now();
    for (const [key, item] of storageUtils.cache.entries()) {
      if (now > item.expiry) {
        storageUtils.cache.delete(key);
      }
    }
  }
};

/**
 * 네트워크 요청 유틸리티
 */
export const apiUtils = {
  // API 에러 핸들링
  handleApiError: (error) => {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      const message = error.response.data?.message || '서버 오류가 발생했습니다.';
      
      switch (status) {
        case 400:
          return '잘못된 요청입니다.';
        case 401:
          return '인증이 필요합니다.';
        case 403:
          return '접근 권한이 없습니다.';
        case 404:
          return '요청한 리소스를 찾을 수 없습니다.';
        case 429:
          return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        case 500:
          return '서버 내부 오류가 발생했습니다.';
        default:
          return message;
      }
    } else if (error.request) {
      // 네트워크 오류
      return '네트워크 연결을 확인해주세요.';
    } else {
      // 기타 오류
      return error.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  // API 요청 재시도
  retry: async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
};

/**
 * 개발 유틸리티
 */
export const devUtils = {
  // 개발 모드 여부 확인
  isDev: () => __DEV__,

  // 콘솔 로그 (개발 모드에서만)
  log: (...args) => {
    if (__DEV__) {
      console.log('[Innerpal]', ...args);
    }
  },

  // 성능 측정
  performance: {
    start: (label) => {
      if (__DEV__) {
        console.time(`[Innerpal] ${label}`);
      }
    },
    
    end: (label) => {
      if (__DEV__) {
        console.timeEnd(`[Innerpal] ${label}`);
      }
    }
  }
};