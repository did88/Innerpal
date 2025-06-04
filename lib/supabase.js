import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

      return { data: analysis, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export default supabase;
