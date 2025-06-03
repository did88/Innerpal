import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

// Supabase 클라이언트 생성 (React Native 최적화)
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      // React Native에서 WebSocket 문제 방지
      params: {
        eventsPerSecond: 2,
      },
    },
    global: {
      // React Native 환경에서 fetch 사용
      fetch: fetch,
    },
  }
)

// 인증 관련 헬퍼 함수들
export const auth = {
  // 현재 세션 가져오기
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      return { session: null, error };
    }
  },

  // 익명 세션 생성 (로그인 없이 사용)
  createAnonymousSession: async () => {
    try {
      let anonymousId = await AsyncStorage.getItem('anonymous_user_id');
      
      if (!anonymousId) {
        anonymousId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await AsyncStorage.setItem('anonymous_user_id', anonymousId);
      }
      
      return { userId: anonymousId, error: null };
    } catch (error) {
      return { userId: null, error };
    }
  },

  // 현재 사용자 ID 가져오기 (익명 포함)
  getCurrentUserId: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return { userId: user.id, error: null };
      } else {
        return await auth.createAnonymousSession();
      }
    } catch (error) {
      return await auth.createAnonymousSession();
    }
  }
}

// 데이터베이스 헬퍼 함수들
export const database = {
  // 감정 기록 생성
  createEmotion: async (emotionData) => {
    try {
      const { userId } = await auth.getCurrentUserId();
      
      const emotionRecord = {
        user_id: userId,
        emotion_text: emotionData.emotion_text,
        primary_emotion: emotionData.primary_emotion,
        intensity: emotionData.intensity,
        emotion_tags: emotionData.emotion_tags || [],
        ai_analysis: emotionData.ai_analysis || null,
        created_at: new Date().toISOString(),
        ...emotionData
      };

      try {
        const { data, error } = await supabase
          .from('emotions')
          .insert(emotionRecord)
          .select()
          .single()
        
        if (error) throw error;
        await database.saveToLocalStorage('emotions', data);
        return { data, error: null }
      } catch (dbError) {
        console.warn('Database save failed, using local storage:', dbError);
        const localData = { ...emotionRecord, id: Date.now().toString() };
        await database.saveToLocalStorage('emotions', localData);
        return { data: localData, error: null };
      }
    } catch (error) {
      console.error('Create emotion error:', error);
      return { data: null, error }
    }
  },

  // 감정 기록 조회
  getEmotions: async (limit = 10, offset = 0) => {
    try {
      const { userId } = await auth.getCurrentUserId();
      
      try {
        const { data, error } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)
        
        if (error) throw error;
        return { data, error: null }
      } catch (dbError) {
        console.warn('Database read failed, using local storage:', dbError);
        const localData = await database.getFromLocalStorage('emotions');
        const filtered = localData
          .filter(item => item.user_id === userId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(offset, offset + limit);
        return { data: filtered, error: null };
      }
    } catch (error) {
      console.error('Get emotions error:', error);
      return { data: [], error }
    }
  },

  // 로컬 저장소 헬퍼
  saveToLocalStorage: async (table, data) => {
    try {
      const existingData = await database.getFromLocalStorage(table);
      const updatedData = Array.isArray(data) ? [...existingData, ...data] : [...existingData, data];
      await AsyncStorage.setItem(`innerpal_${table}`, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Local storage save error:', error);
    }
  },

  getFromLocalStorage: async (table) => {
    try {
      const data = await AsyncStorage.getItem(`innerpal_${table}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Local storage read error:', error);
      return [];
    }
  },

  clearLocalStorage: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const innerpalKeys = keys.filter(key => key.startsWith('innerpal_'));
      await AsyncStorage.multiRemove(innerpalKeys);
    } catch (error) {
      console.error('Local storage clear error:', error);
    }
  }
}

// 통계 및 분석 헬퍼
export const analytics = {
  // 감정 패턴 분석
  getEmotionPatterns: async (days = 30) => {
    try {
      const { data: emotions } = await database.getEmotions(100);
      
      if (!emotions || emotions.length === 0) {
        return { data: null, error: 'No emotion data available' };
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentEmotions = emotions.filter(
        emotion => new Date(emotion.created_at) >= cutoffDate
      );

      // 감정별 빈도 계산
      const emotionCounts = {};
      const dailyMoods = {};
      
      recentEmotions.forEach(emotion => {
        // 감정 카운트
        emotionCounts[emotion.primary_emotion] = 
          (emotionCounts[emotion.primary_emotion] || 0) + 1;
        
        // 일별 평균 기분
        const date = emotion.created_at.split('T')[0];
        if (!dailyMoods[date]) {
          dailyMoods[date] = [];
        }
        dailyMoods[date].push(emotion.intensity);
      });

      // 일별 평균 계산
      const moodTrends = Object.entries(dailyMoods).map(([date, intensities]) => ({
        date,
        averageMood: intensities.reduce((sum, val) => sum + val, 0) / intensities.length,
        entryCount: intensities.length
      }));

      const analysis = {
        totalEntries: recentEmotions.length,
        emotionDistribution: emotionCounts,
        moodTrends: moodTrends.sort((a, b) => new Date(a.date) - new Date(b.date)),
        averageIntensity: recentEmotions.reduce((sum, e) => sum + e.intensity, 0) / recentEmotions.length,
        mostCommonEmotion: Object.entries(emotionCounts).sort(([,a], [,b]) => b - a)[0]?.[0],
        period: `${days} days`
      };

      return { data: analysis, error: null };
    } catch (error) {
      console.error('Emotion patterns analysis error:', error);
      return { data: null, error };
    }
  }
}

export default supabase
