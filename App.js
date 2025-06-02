import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { supabase, auth } from './lib/supabase';
import { APP_CONFIG } from './config/app';

// 실제 화면 컴포넌트들
import HomeScreen from './screens/HomeScreen';

// 임시 화면 컴포넌트들 (추후 구현 예정)
const AuthScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Innerpal</Text>
    <Text style={styles.subtitle}>Your inner friend, always</Text>
    <Text style={styles.text}>인증 화면 구현 예정</Text>
    <Text style={styles.devNote}>
      개발 중: Supabase 인증 설정 후 실제 로그인 화면으로 교체됩니다
    </Text>
  </View>
);

const InnerTalkScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Inner Talk 💭</Text>
    <Text style={styles.text}>AI와의 감정 대화 화면</Text>
    <Text style={styles.devNote}>
      • GPT 기반 감정 분석 및 공감 대화{'\n'}
      • CBT 인지재구성 질문 시퀀스{'\n'}
      • 실시간 감정 강도 측정
    </Text>
  </View>
);

const InsightsScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Pal Insights 📊</Text>
    <Text style={styles.text}>감정 패턴 분석 및 인사이트</Text>
    <Text style={styles.devNote}>
      • 감정 히스토리 차트{'\n'}
      • 주간/월간 감정 리포트{'\n'}
      • 개인화된 성장 인사이트
    </Text>
  </View>
);

const ProfileScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>프로필 ⚙️</Text>
    <Text style={styles.text}>사용자 설정 및 계정 관리</Text>
    <Text style={styles.devNote}>
      • 개인화 설정{'\n'}
      • 알림 및 보안 설정{'\n'}
      • 데이터 내보내기
    </Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 메인 탭 네비게이터
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: APP_CONFIG.colors.background,
          borderTopColor: APP_CONFIG.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: APP_CONFIG.colors.primary,
        tabBarInactiveTintColor: APP_CONFIG.colors.textLight,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: APP_CONFIG.colors.background,
          borderBottomColor: APP_CONFIG.colors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: APP_CONFIG.colors.text,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: '홈',
          tabBarLabel: '홈',
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>
              {focused ? '🏠' : '🏡'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="InnerTalk" 
        component={InnerTalkScreen}
        options={{ 
          title: 'Inner Talk',
          tabBarLabel: '대화',
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>
              {focused ? '💭' : '💬'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ 
          title: 'Pal Insights',
          tabBarLabel: '분석',
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>
              {focused ? '📊' : '📈'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: '프로필',
          tabBarLabel: '프로필',
          tabBarIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>
              {focused ? '👤' : '👥'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 상태 확인
    auth.getSession().then(({ session, error }) => {
      if (!error) {
        setSession(session);
      }
      setLoading(false);
    });

    // 인증 상태 변화 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로딩 화면
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.logoText}>Innerpal</Text>
        <ActivityIndicator 
          size="large" 
          color={APP_CONFIG.colors.primary} 
          style={{ marginTop: 20 }}
        />
        <Text style={[styles.text, { marginTop: 16 }]}>
          내면의 친구를 깨우는 중...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar 
        style="dark" 
        backgroundColor={APP_CONFIG.colors.background} 
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 개발 중에는 항상 MainTabs를 보여줌 */}
        {/* 추후 session 체크로 변경: {session ? ( */}
        {true ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_CONFIG.spacing.lg,
  },
  logoText: {
    fontSize: APP_CONFIG.fonts.sizes.xxxl + 8,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.primary,
    textAlign: 'center',
  },
  title: {
    fontSize: APP_CONFIG.fonts.sizes.xxxl,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.primary,
    marginBottom: APP_CONFIG.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    color: APP_CONFIG.colors.textLight,
    marginBottom: APP_CONFIG.spacing.md,
    textAlign: 'center',
  },
  text: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.text,
    textAlign: 'center',
    marginBottom: APP_CONFIG.spacing.sm,
  },
  devNote: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: APP_CONFIG.spacing.md,
    paddingHorizontal: APP_CONFIG.spacing.lg,
    lineHeight: 20,
  },
});