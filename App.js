import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 설정 파일
import { APP_CONFIG } from './config/app';

// 화면 컴포넌트들
import HomeScreen from './screens/HomeScreen';
import InnerTalkScreen from './screens/InnerTalkScreen';
import ApiTestScreen from './screens/ApiTestScreen';
import EmotionAnalysisScreen from './screens/EmotionAnalysisScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 모던 탭 아이콘 컴포넌트
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

// 인사이트 화면
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

// 프로필 화면
const ProfileScreen = ({ navigation }) => (
  <View style={styles.screenContainer}>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
      <View style={styles.modernHeader}>
        <LinearGradient
          colors={['#F59E0B', '#EF4444']}
          style={styles.iconGradient}
        >
          <Text style={styles.headerEmoji}>⚙️</Text>
        </LinearGradient>
        <Text style={styles.title}>프로필 설정</Text>
        <Text style={styles.subtitle}>사용자 설정 및 계정 관리</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.modernButton}
        onPress={() => navigation.navigate('ApiTest')}
      >
        <LinearGradient
          colors={['#6B7280', '#4B5563']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>개발자 도구</Text>
          <Text style={styles.buttonEmoji}>🔧</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// 메인 탭 네비게이터
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
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
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🏡" activeEmoji="🏠" />
          ),
        }}
      />
      <Tab.Screen 
        name="InnerTalk" 
        component={InnerTalkScreen}
        options={{ 
          title: '대화',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="💬" activeEmoji="💭" />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ 
          title: '분석',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📈" activeEmoji="📊" />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: '프로필',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="👥" activeEmoji="👤" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  // 모던 로딩 화면
  if (loading) {
    return (
      <View style={styles.fullScreen}>
        <StatusBar style="dark" />
        <LinearGradient
          colors={[
            'rgba(99, 102, 241, 0.1)',
            'rgba(236, 72, 153, 0.1)',
            'transparent'
          ]}
          style={styles.loadingGradient}
        />
        <View style={styles.loadingContainer}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.loadingLogo}
            >
              <Text style={styles.loadingEmoji}>💙</Text>
            </LinearGradient>
            <Text style={styles.logoText}>Innerpal</Text>
            <Text style={styles.tagline}>Your inner friend, always</Text>
          </View>
          
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>
              내면의 친구를 깨우는 중...
            </Text>
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
          <Stack.Screen 
            name="EmotionAnalysis" 
            component={EmotionAnalysisScreen}
            options={{
              headerShown: true,
              title: '감정 분석',
              headerStyle: {
                backgroundColor: '#FEFCF0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              },
              headerTitleStyle: {
                color: '#1F2937',
                fontWeight: '600',
                fontSize: 18,
              },
              headerTintColor: '#7C3AED',
            }}
          />
          <Stack.Screen 
            name="ApiTest" 
            component={ApiTestScreen}
            options={{
              headerShown: true,
              title: 'API 연결 테스트',
              headerStyle: {
                backgroundColor: '#FEFCF0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              },
              headerTitleStyle: {
                color: '#1F2937',
                fontWeight: '600',
                fontSize: 18,
              },
              headerTintColor: '#7C3AED',
            }}
          />
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
  
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  scrollView: {
    flex: 1,
  },
  
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  
  // 로딩 화면 스타일
  loadingGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  
  loadingEmoji: {
    fontSize: 36,
  },
  
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  loadingIndicatorContainer: {
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  
  // 모던 헤더 스타일
  modernHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  headerEmoji: {
    fontSize: 32,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // 모던 버튼
  modernButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 8,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  
  buttonEmoji: {
    fontSize: 16,
  },
  
  // 탭 아이콘 스타일
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  tabIconActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  tabIconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  
  tabEmoji: {
    fontSize: 22,
    zIndex: 1,
  },
  
  tabEmojiActive: {
    fontSize: 24,
  },
});
