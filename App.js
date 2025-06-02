import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { supabase, auth } from './lib/supabase';
import { APP_CONFIG } from './config/app';

// 화면 컴포넌트들 (아직 생성하지 않았으므로 임시 컴포넌트)
const AuthScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Innerpal</Text>
    <Text style={styles.subtitle}>Your inner friend, always</Text>
    <Text style={styles.text}>인증 화면 구현 예정</Text>
  </View>
);

const HomeScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>안녕하세요! 👋</Text>
    <Text style={styles.subtitle}>오늘 마음은 어떠신가요?</Text>
  </View>
);

const InnerTalkScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Inner Talk</Text>
    <Text style={styles.text}>감정 대화 화면 구현 예정</Text>
  </View>
);

const InsightsScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Pal Insights</Text>
    <Text style={styles.text}>감정 분석 화면 구현 예정</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>프로필</Text>
    <Text style={styles.text}>프로필 화면 구현 예정</Text>
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
        }}
      />
      <Tab.Screen 
        name="InnerTalk" 
        component={InnerTalkScreen}
        options={{ 
          title: 'Inner Talk',
          tabBarLabel: '대화',
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ 
          title: 'Pal Insights',
          tabBarLabel: '분석',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: '프로필',
          tabBarLabel: '프로필',
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
        <ActivityIndicator size="large" color={APP_CONFIG.colors.primary} />
        <Text style={[styles.text, { marginTop: 16 }]}>Innerpal 시작 중...</Text>
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
        {session ? (
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
  },
});