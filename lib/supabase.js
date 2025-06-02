import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_CONFIG } from '../config/app'

// Supabase 클라이언트 생성
export const supabase = createClient(
  API_CONFIG.supabase.url, 
  API_CONFIG.supabase.anonKey, 
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
  // 회원가입
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: metadata.displayName || email.split('@')[0],
            created_at: new Date().toISOString(),
            ...metadata
          }
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // 로그인
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // 현재 사용자 가져오기
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  },

  // 세션 가져오기
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      return { session: null, error }
    }
  }
}

// 데이터베이스 헬퍼 함수들
export const database = {
  // 감정 기록 생성
  createEmotion: async (emotionData) => {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .insert(emotionData)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // 감정 기록 조회
  getEmotions: async (userId, limit = 10, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // 사용자 프로필 업데이트
  updateProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...profileData })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // 사용자 프로필 조회
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// 실시간 구독 헬퍼
export const realtime = {
  // 감정 변화 구독
  subscribeToEmotions: (userId, callback) => {
    return supabase
      .channel('emotions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emotions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  // 구독 해제
  unsubscribe: (subscription) => {
    return supabase.removeChannel(subscription)
  }
}

export default supabase