import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { database } from './lib/supabase';
import { requestPermissionsAsync } from './services/notifications';

import { APP_CONFIG } from './config/app';
import { useAuth } from './hooks';
import { analytics } from './lib/supabase';
import { useForm, Controller } from 'react-hook-form';

import HomeScreen from './screens/HomeScreen';
import InnerTalkScreen from './screens/InnerTalkScreen';
import EmotionAnalysisScreen from './screens/EmotionAnalysisScreen';
import EmotionResultScreen from './screens/EmotionResultScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, emoji, activeEmoji }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
    {focused && (
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'rgba(236, 72, 153, 0.1)']}
        style={styles.tabIconGradient}
      />
    )}
    <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
      {focused ? activeEmoji : emoji}
    </Text>
  </View>
);

const InsightsScreen = ({ navigation }) => (
  <View style={styles.screenContainer}>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
      <View style={styles.modernHeader}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.iconGradient}
        >
          <Text style={styles.headerEmoji}>📊</Text>
        </LinearGradient>
        <Text style={styles.title}>감정 인사이트</Text>
        <Text style={styles.subtitle}>감정 패턴 분석 및 리포트</Text>
      </View>

      <TouchableOpacity
        style={styles.modernButton}
        onPress={() => navigation.navigate('EmotionAnalysis')}
      >
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>감정 분석하기</Text>
          <Text style={styles.buttonEmoji}>🚀</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const ProfileScreen = () => {
  const { user, isAuthenticated, signIn, signUp, signOut, loading } = useAuth();
  const { control, handleSubmit, reset } = useForm();
  const [mode, setMode] = useState('signin');
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      analytics.getEmotionPatterns().then(({ data }) => {
        if (data) setInsights(data);
      });
    } else {
      setInsights(null);
    }
  }, [isAuthenticated]);

  const onSubmit = async ({ email, password }) => {
    const fn = mode === 'signup' ? signUp : signIn;
    const { success, error } = await fn(email, password);
    if (!success) {
      Alert.alert('오류', error || '문제가 발생했습니다');
    } else {
      reset();
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
        <View style={styles.modernHeader}>
          <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.iconGradient}>
            <Text style={styles.headerEmoji}>👤</Text>
          </LinearGradient>
          <Text style={styles.title}>내 프로필</Text>
          <Text style={styles.subtitle}>개인 설정 및 데이터 관리</Text>
        </View>

        {isAuthenticated ? (
          <View style={styles.profileContent}>
            <Text style={styles.profileEmail}>{user.email}</Text>
            {insights && (
              <View style={styles.insightsBox}>
                <Text style={styles.insightsHeader}>최근 감정 패턴</Text>
                <Text style={styles.insightText}>총 기록: {insights.totalEntries}</Text>
                <Text style={styles.insightText}>주요 감정: {insights.mostCommonEmotion}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.modernButton} onPress={signOut} disabled={loading}>
              <LinearGradient colors={['#EF4444', '#F59E0B']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>로그아웃</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileContent}>
            <View style={styles.authToggle}>
              <TouchableOpacity onPress={() => setMode('signin')} disabled={mode === 'signin'}>
                <Text style={[styles.authToggleText, mode === 'signin' && styles.authToggleActive]}>로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('signup')} disabled={mode === 'signup'}>
                <Text style={[styles.authToggleText, mode === 'signup' && styles.authToggleActive]}>회원가입</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.authForm}>
              <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="이메일"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="비밀번호"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <TouchableOpacity style={styles.modernButton} onPress={handleSubmit(onSubmit)} disabled={loading}>
                <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>{mode === 'signup' ? '회원가입' : '로그인'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 0,
        height: 88,
        paddingBottom: 20,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      },
      tabBarActiveTintColor: '#7C3AED',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginTop: 4 },
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈', tabBarIcon: ({ focused }) => (<TabIcon focused={focused} emoji="🏡" activeEmoji="🏠" />) }} />
      <Tab.Screen name="InnerTalk" component={InnerTalkScreen} options={{ title: '대화', tabBarIcon: ({ focused }) => (<TabIcon focused={focused} emoji="💬" activeEmoji="💭" />) }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ title: '분석', tabBarIcon: ({ focused }) => (<TabIcon focused={focused} emoji="📈" activeEmoji="📊" />) }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필', tabBarIcon: ({ focused }) => (<TabIcon focused={focused} emoji="👥" activeEmoji="👤" />) }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => { setLoading(false); }, 2500); }, []);
  useEffect(() => {
    requestPermissionsAsync();
    database.syncLocalData().catch(() => {});
  }, []);
  if (loading) {
    return (
      <View style={styles.fullScreen}>
        <StatusBar style="dark" />
        <LinearGradient colors={[ 'rgba(99, 102, 241, 0.1)', 'rgba(236, 72, 153, 0.1)', 'transparent' ]} style={styles.loadingGradient} />
        <View style={styles.loadingContainer}>
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.loadingLogo}>
              <Text style={styles.loadingEmoji}>💙</Text>
            </LinearGradient>
            <Text style={styles.logoText}>Innerpal</Text>
            <Text style={styles.tagline}>Your inner friend, always</Text>
          </View>
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>내면의 친구를 깨우는 중...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EmotionAnalysis" component={EmotionAnalysisScreen} options={{ headerShown: true, title: '감정 분석', headerStyle: { backgroundColor: '#FEFCF0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 }, headerTitleStyle: { color: '#1F2937', fontWeight: '600', fontSize: 18 }, headerTintColor: '#7C3AED' }} />
          <Stack.Screen name="EmotionResultScreen" component={EmotionResultScreen} options={{ headerShown: true, title: '감정 결과', headerStyle: { backgroundColor: '#FEFCF0' }, headerTintColor: '#7C3AED', headerTitleStyle: { fontWeight: '600', fontSize: 18 } }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  loadingGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingEmoji: {
    fontSize: 36,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingIndicatorContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  modernHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  modernButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
    marginTop: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  buttonEmoji: {
    fontSize: 18,
  },
  profileContent: {
    marginTop: 24,
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1F2937',
  },
  insightsBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  insightsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#374151',
  },
  insightText: {
    fontSize: 14,
    color: '#4B5563',
  },
  authToggle: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  authToggleText: {
    fontSize: 16,
    color: '#6B7280',
  },
  authToggleActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  authForm: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  tabIcon: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  tabIconGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabEmojiActive: {
    fontSize: 24,
  },
});
