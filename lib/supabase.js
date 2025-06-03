import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

// Supabase 클라이언트 생성
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
  }
)

// 인증 관련 헬퍼 함수들
export const auth = {
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

  // CBT 세션 저장
  createCBTSession: async (sessionData) => {
    try {
      const { userId } = await auth.getCurrentUserId();
      
      const sessionRecord = {
        user_id: userId,
        emotion_id: sessionData.emotion_id,
        session_answers: sessionData.answers || {},
        insights: sessionData.insights || {},
        before_mood: sessionData.before_mood,
        after_mood: sessionData.after_mood,
        session_duration: sessionData.duration || 0,
        completed_at: new Date().toISOString(),
        ...sessionData
      };

      try {
        const { data, error } = await supabase
          .from('cbt_sessions')
          .insert(sessionRecord)
          .select()
          .single()
        
        if (error) throw error;
        await database.saveToLocalStorage('cbt_sessions', data);
        return { data, error: null }
      } catch (dbError) {
        console.warn('CBT session DB save failed, using local storage:', dbError);
        const localData = { ...sessionRecord, id: Date.now().toString() };
        await database.saveToLocalStorage('cbt_sessions', localData);
        return { data: localData, error: null };
      }
    } catch (error) {
      console.error('Create CBT session error:', error);
      return { data: null, error }
    }
  },

  // AI 대화 세션 저장
  createConversation: async (conversationData) => {
    try {
      const { userId } = await auth.getCurrentUserId();
      
      const conversationRecord = {
        user_id: userId,
        messages: conversationData.messages || [],
        emotion_context: conversationData.emotion_context || null,
        session_summary: conversationData.summary || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...conversationData
      };

      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert(conversationRecord)
          .select()
          .single()
        
        if (error) throw error;
        await database.saveToLocalStorage('conversations', data);
        return { data, error: null }
      } catch (dbError) {
        console.warn('Conversation DB save failed, using local storage:', dbError);
        const localData = { ...conversationRecord, id: Date.now().toString() };
        await database.saveToLocalStorage('conversations', localData);
        return { data: localData, error: null };
      }
    } catch (error) {
      console.error('Create conversation error:', error);
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
  },

  // 데이터 동기화 (온라인 상태일 때)
  syncData: async () => {
    try {
      const tables = ['emotions', 'cbt_sessions', 'conversations'];
      
      for (const table of tables) {
        const localData = await database.getFromLocalStorage(table);
        const unsynced = localData.filter(item => !item.synced);
        
        for (const item of unsynced) {
          try {
            const { id, synced, ...dataToSync } = item;
            await supabase.from(table).insert(dataToSync);
            
            // 동기화 완료 표시
            item.synced = true;
            await database.saveToLocalStorage(table, []);
            await AsyncStorage.setItem(`innerpal_${table}`, JSON.stringify(localData));
          } catch (syncError) {
            console.warn(`Failed to sync ${table} item:`, syncError);
          }
        }
      }
    } catch (error) {
      console.error('Data sync error:', error);
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
  },

  // CBT 세션 효과 분석
  getCBTEffectiveness: async () => {
    try {
      const localSessions = await database.getFromLocalStorage('cbt_sessions');
      
      if (localSessions.length === 0) {
        return { data: null, error: 'No CBT session data available' };
      }

      const completedSessions = localSessions.filter(
        session => session.before_mood && session.after_mood
      );

      if (completedSessions.length === 0) {
        return { data: null, error: 'No completed CBT sessions with mood data' };
      }

      const improvements = completedSessions.map(session => 
        session.after_mood - session.before_mood
      );

      const analysis = {
        totalSessions: completedSessions.length,
        averageImprovement: improvements.reduce((sum, val) => sum + val, 0) / improvements.length,
        positiveImprovements: improvements.filter(val => val > 0).length,
        noChange: improvements.filter(val => val === 0).length,
        negativeChanges: improvements.filter(val => val < 0).length,
        improvementRate: (improvements.filter(val => val > 0).length / improvements.length) * 100,
        lastSessionDate: completedSessions[0]?.completed_at
      };

      return { data: analysis, error: null };
    } catch (error) {
      console.error('CBT effectiveness analysis error:', error);
      return { data: null, error };
    }
  }
}

export default supabase