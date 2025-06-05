import { useState, useEffect, useCallback } from 'react';
import { auth, database, analytics } from '../lib/supabase';
import { devUtils } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = 'innerpal_credentials';

/**
 * 인증 관련 훅
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 확인 및 자동 로그인
    const getInitialSession = async () => {
      try {
        const { session, error } = await auth.getSession();
        if (!error && session) {
          setSession(session);
          setUser(session.user);
        } else {
          const saved = await AsyncStorage.getItem(CREDENTIALS_KEY);
          if (saved) {
            const { email, password } = JSON.parse(saved);
            await signIn(email, password);
          }
        }
      } catch (error) {
        devUtils.log('Initial session error:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;

      await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ email, password }));

      setSession(data.session);
      setUser(data.user ?? data.session?.user ?? null);
      return { success: true, error: null };
    } catch (error) {
      devUtils.log('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, metadata);
      if (error) throw error;

      await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ email, password }));

      return { success: true, error: null, data };
    } catch (error) {
      devUtils.log('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await auth.signOut();
      if (error) throw error;

      await AsyncStorage.removeItem(CREDENTIALS_KEY);

      setSession(null);
      setUser(null);
      return { success: true, error: null };
    } catch (error) {
      devUtils.log('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
    isAdmin: user?.user_metadata?.role === 'admin'
  };
};

/**
 * 감정 관련 훅
 */
export const useEmotions = (userId) => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEmotions = useCallback(async (limit = 10, offset = 0) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await database.getEmotions(userId, limit, offset);
      if (error) throw error;
      
      if (offset === 0) {
        setEmotions(data || []);
      } else {
        setEmotions(prev => [...prev, ...(data || [])]);
      }
    } catch (err) {
      devUtils.log('Load emotions error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addEmotion = useCallback(async (emotionData) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    try {
      const newEmotion = {
        user_id: userId,
        created_at: new Date().toISOString(),
        ...emotionData
      };
      
      const { data, error } = await database.createEmotion(newEmotion);
      if (error) throw error;
      
      // 최신 감정을 리스트 맨 앞에 추가
      setEmotions(prev => [data, ...prev]);
      return { success: true, data, error: null };
    } catch (err) {
      devUtils.log('Add emotion error:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  const refreshEmotions = useCallback(() => {
    loadEmotions();
  }, [loadEmotions]);

  useEffect(() => {
    if (userId) {
      loadEmotions();
    }
  }, [userId, loadEmotions]);

  return {
    emotions,
    loading,
    error,
    loadEmotions,
    addEmotion,
    refreshEmotions
  };
};

/**
 * 사용자 프로필 훅
 */
export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await database.getProfile(userId);
      if (error && error.code !== 'PGRST116') { // 데이터가 없는 경우가 아닌 실제 에러
        throw error;
      }
      
      setProfile(data || {
        id: userId,
        display_name: '',
        personality: null,
        comfort_style: null,
        interests: [],
        recent_patterns: null
      });
    } catch (err) {
      devUtils.log('Load profile error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (profileData) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    setLoading(true);

    try {
      const { data: pattern } = await analytics.getEmotionPatterns();

      const { data, error } = await database.updateProfile(userId, {
        ...profile,
        ...profileData,
        insights: pattern?.personalityHints || null,
        recent_patterns: pattern || null,
        updated_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      setProfile(data);
      return { success: true, data, error: null };
    } catch (err) {
      devUtils.log('Update profile error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, profile]);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId, loadProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: loadProfile
  };
};

/**
 * 로컬 상태 관리 훅
 */
export const useLocalState = (key, initialValue) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(`innerpal_state_${key}`);
        if (saved !== null) {
          setState(JSON.parse(saved));
        }
      } catch (error) {
        devUtils.log('Local state load error:', error);
      }
    };
    load();
  }, [key]);

  const setValue = useCallback(async (value) => {
    try {
      setState(value);
      await AsyncStorage.setItem(`innerpal_state_${key}`, JSON.stringify(value));
    } catch (error) {
      devUtils.log('Set local state error:', error);
    }
  }, [key]);

  return [state, setValue];
};

/**
 * 디바운스 훅
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 이전 값 추적 훅
 */
export const usePrevious = (value) => {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState();

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
};

/**
 * 네트워크 상태 훅
 */
export const useNetworkState = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 실제 네트워크 상태 확인 로직은 추후 구현
  // NetInfo 라이브러리 사용 예정

  return {
    isConnected,
    isLoading
  };
};

/**
 * 폼 상태 관리 훅
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 실시간 검증
    if (validationRules[name] && touched[name]) {
      const error = validationRules[name](value, values);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validationRules, touched, values]);

  const markTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validationRules[name](values[name], values);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    markTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * 감정 통계 훅
 */
export const useEmotionStats = (emotions) => {
  const [stats, setStats] = useState({
    totalCount: 0,
    averageIntensity: 0,
    mostCommonEmotion: null,
    emotionDistribution: {},
    weeklyTrend: []
  });

  useEffect(() => {
    if (!emotions || emotions.length === 0) {
      setStats({
        totalCount: 0,
        averageIntensity: 0,
        mostCommonEmotion: null,
        emotionDistribution: {},
        weeklyTrend: []
      });
      return;
    }

    // 통계 계산
    const totalCount = emotions.length;
    const totalIntensity = emotions.reduce((sum, emotion) => sum + (emotion.intensity || 0), 0);
    const averageIntensity = totalIntensity / totalCount;

    // 감정 분포 계산
    const emotionDistribution = emotions.reduce((acc, emotion) => {
      const emotionType = emotion.primary_emotion || 'unknown';
      acc[emotionType] = (acc[emotionType] || 0) + 1;
      return acc;
    }, {});

    // 가장 많은 감정 찾기
    const mostCommonEmotion = Object.entries(emotionDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

    // 주간 트렌드 (최근 7일)
    const now = new Date();
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEmotions = emotions.filter(emotion => 
        emotion.created_at.startsWith(dateStr)
      );
      
      return {
        date: dateStr,
        count: dayEmotions.length,
        averageIntensity: dayEmotions.length > 0 
          ? dayEmotions.reduce((sum, e) => sum + (e.intensity || 0), 0) / dayEmotions.length 
          : 0
      };
    }).reverse();

    setStats({
      totalCount,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      mostCommonEmotion,
      emotionDistribution,
      weeklyTrend
    });

  }, [emotions]);

  return stats;
};