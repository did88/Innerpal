import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
  const error = new Error('Supabase not initialized');
  const stubResult = Promise.resolve({ data: null, error });
  const stubQuery = {
    select: () => stubQuery,
    insert: () => stubQuery,
    upsert: () => stubQuery,
    eq: () => stubQuery,
    order: () => stubQuery,
    single: () => stubResult,
    range: () => stubResult,
    then: (res, rej) => stubResult.then(res, rej),
  };

  supabase = {
    auth: {
      getSession: async () => ({ session: null, error }),
      signUp: async () => ({ data: { session: null, user: null }, error }),
      signIn: async () => ({ data: { session: null, user: null }, error }),
      signOut: async () => ({ error }),
      getUser: async () => ({ user: null, error }),
    },
    from: () => stubQuery,
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      disabled: true,
    },
    global: {
      fetch: fetch,
    },
  });
}

export { supabase };

export const auth = {
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      return { session: null, error };
    }
  },

  signUp: async (email, password, metadata = {}) => {
    try {
      const { session, user, data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      const sessionData = session ?? data ?? null;
      const userData = user ?? sessionData?.user ?? null;
      return { data: { session: sessionData, user: userData }, error };
    } catch (error) {
      return { data: { session: null, user: null }, error };
    }
  },

  signIn: async (email, password) => {
    try {
      const { session, user, data, error } = await supabase.auth.signIn({ email, password });
      const sessionData = session ?? data ?? null;
      const userData = user ?? sessionData?.user ?? null;
      return { data: { session: sessionData, user: userData }, error };
    } catch (error) {
      return { data: { session: null, user: null }, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

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
  },

  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
};

export const database = {
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
          .single();
        if (error) throw error;
        await database.saveToLocalStorage('emotions', data);
        return { data, error: null };
      } catch (dbError) {
        const localData = { ...emotionRecord, id: Date.now().toString() };
        await database.saveToLocalStorage('emotions', localData);
        return { data: localData, error: null };
      }
    } catch (error) {
      return { data: null, error };
    }
  },

  createCBTSession: async (sessionData) => {
    try {
      const { userId } = await auth.getCurrentUserId();

      const sessionRecord = {
        user_id: userId,
        emotion_id: sessionData.emotion_id,
        session_answers: sessionData.session_answers || {},
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
          .single();
        if (error) throw error;
        await database.saveToLocalStorage('cbt_sessions', data);
        return { data, error: null };
      } catch (dbError) {
        console.warn('CBT session DB save failed, using local storage:', dbError);
        const localData = { ...sessionRecord, id: Date.now().toString() };
        await database.saveToLocalStorage('cbt_sessions', localData);
        return { data: localData, error: null };
      }
    } catch (error) {
      console.error('Create CBT session error:', error);
      return { data: null, error };
    }
  },

  saveInnerTalk: async (talkData) => {
    try {
      const { userId } = await auth.getCurrentUserId();
      const talkRecord = {
        user_id: userId,
        emotion_id: talkData.emotion_id || null,
        user_input: talkData.user_input,
        ai_reply: talkData.ai_reply,
        created_at: new Date().toISOString(),
        user_emotions: talkData.user_emotions || null,
        ai_emotions: talkData.ai_emotions || null
      };

      try {
        const { data, error } = await supabase
          .from('inner_talks')
          .insert(talkRecord)
          .select()
          .single();
        if (error) throw error;
        await database.saveToLocalStorage('inner_talks', data);
        return { data, error: null };
      } catch (dbError) {
        console.warn('Supabase saveInnerTalk error:', dbError?.message || dbError);
        const localData = { ...talkRecord, id: Date.now().toString() };
        await database.saveToLocalStorage('inner_talks', localData);
        return { data: localData, error: null };
      }
    } catch (error) {
      console.warn('saveInnerTalk error:', error);
      return { data: null, error };
    }
  },

  getEmotions: async (limit = 10, offset = 0) => {
    try {
      const { userId } = await auth.getCurrentUserId();

      try {
        const { data, error } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        if (error) throw error;
        return { data, error: null };
      } catch (dbError) {
        const localData = await database.getFromLocalStorage('emotions');
        const filtered = localData
          .filter(item => item.user_id === userId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(offset, offset + limit);
        return { data: filtered, error: null };
      }
    } catch (error) {
      return { data: [], error };
    }
  },

  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...profileData }, { onConflict: 'id' })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

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

  /**
   * Sync locally stored records to Supabase when online.
   * Currently supports the 'emotions' table only.
   */
  syncLocalData: async (table = 'emotions') => {
    try {
      const local = await database.getFromLocalStorage(table);
      if (!local || local.length === 0) return;

      const remaining = [];
      for (const item of local) {
        try {
          const { error } = await supabase.from(table).insert({ ...item, id: undefined }).select().single();
          if (error) throw error;
        } catch (err) {
          remaining.push(item);
        }
      }

      await AsyncStorage.setItem(`innerpal_${table}`, JSON.stringify(remaining));
    } catch (error) {
      console.error('Local data sync error:', error);
    }
  }
};

export const analytics = {
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

      const emotionCounts = {};
      const dailyMoods = {};

      recentEmotions.forEach(emotion => {
        emotionCounts[emotion.primary_emotion] = 
          (emotionCounts[emotion.primary_emotion] || 0) + 1;
        const date = emotion.created_at.split('T')[0];
        if (!dailyMoods[date]) {
          dailyMoods[date] = [];
        }
        dailyMoods[date].push(emotion.intensity);
      });

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

      analysis.personalityHints = derivePersonalityHints(analysis);

      return { data: analysis, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

const derivePersonalityHints = (analysis) => {
  const dist = analysis.emotionDistribution || {};
  const positive = (dist.joy || 0) + (dist.surprise || 0) + (dist.neutral || 0);
  const negative = (dist.sadness || 0) + (dist.anger || 0) + (dist.fear || 0) + (dist.disgust || 0);
  const ratio = positive / Math.max(1, negative);

  let moodHint = '';
  if (ratio > 1.2) moodHint = '주로 긍정적인 감정을 경험하고 있어요';
  else if (ratio < 0.8) moodHint = '부정적인 감정을 자주 느끼고 있어요';
  else moodHint = '감정 균형이 비교적 안정적이에요';

  let trendHint = '';
  const trends = analysis.moodTrends || [];
  if (trends.length > 1) {
    const diff = trends[trends.length - 1].averageMood - trends[0].averageMood;
    if (diff > 0.05) trendHint = '최근 기분이 점점 좋아지고 있어요';
    else if (diff < -0.05) trendHint = '최근 기분이 하락하는 경향이 있어요';
  }

  const intensity = analysis.averageIntensity || 0;
  let intensityHint = '';
  if (intensity > 0.6) intensityHint = '감정을 강하게 표현하는 편이에요';
  else if (intensity < 0.4) intensityHint = '차분하게 감정을 표현하는 편이에요';

  return [moodHint, trendHint, intensityHint].filter(Boolean).join(' · ');
};

export default supabase;
