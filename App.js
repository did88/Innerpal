import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

// 임시로 import 문제 해결을 위해 직접 정의
const APP_CONFIG = {
  colors: {
    background: '#FEFCF0',
    primary: '#4A5568',
    textLight: '#718096',
    text: '#2D3748',
    border: '#E2E8F0',
    textMuted: '#A0AEC0',
  }
};

// 임시 홈 화면 (HomeScreen import 오류 방지)
const HomeScreen = () => (
  <View style={[styles.container, styles.center]}>
    <Text style={styles.title}>Innerpal 홈 🏠</Text>
    <Text style={styles.subtitle}>안녕하세요! 👋</Text>
    <Text style={styles.text}>오늘 마음은 어떠신가요?</Text>
    
    <View style={styles.quickActions}>
      <View style={styles.actionButton}>
        <Text style={styles.actionEmoji}>💭</Text>
        <Text style={styles.actionText}>Inner Talk</Text>
      </View>
      <View style={styles.actionButton}>
        <Text style={styles.actionEmoji}>📊</Text>
        <Text style={styles.actionText}>감정 분석</Text>
      </View>
      <View style={styles.actionButton}>
        <Text style={styles.actionEmoji}>🧘‍♀️</Text>
        <Text style={styles.actionText}>마음 챙김</Text>
      </View>
      <View style={styles.actionButton}>
        <Text style={styles.actionEmoji}>🤗</Text>
        <Text style={styles.actionText}>응급 위로</Text>
      </View>
    </View>
    
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📈 이번 주 인사이트</Text>
      <Text style={styles.cardText}>전반적으로 안정된 감정 상태를 보이고 있어요.</Text>
    </View>
  </View>
);

// 임시 화면 컴포넌트들
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 개발 모드에서는 로딩을 빠르게 완료
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // 로딩 화면
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.logoText}>Innerpal</Text>
        <Text style={styles.tagline}>Your inner friend, always</Text>
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
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4A5568',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#718096',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  devNote: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  
  // 홈 화면 스타일들
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: '22%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 10,
    color: '#2D3748',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4A5568',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 18,
  },
});