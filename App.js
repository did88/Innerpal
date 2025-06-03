import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
<<<<<<< Updated upstream
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';

// 화면 import
import InnerTalkScreen from './screens/InnerTalkScreen';
import ApiTestScreen from './screens/ApiTestScreen';
import EmotionInputScreen from './screens/EmotionInputScreen';
import CBTSessionScreen from './screens/CBTSessionScreen';
import CBTInsightsScreen from './screens/CBTInsightsScreen';

const APP_CONFIG = {
  colors: {
    background: '#FEFCF0',
    primary: '#4A5568',
    textLight: '#718096',
    text: '#2D3748',
    border: '#E2E8F0',
    textMuted: '#A0AEC0',
=======
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// 설정 파일
import { APP_CONFIG } from './config/app';

// 실제 구현된 화면들
import HomeScreen from './screens/HomeScreen';
import InnerTalkScreen from './screens/InnerTalkScreen';
import ApiTestScreen from './screens/ApiTestScreen';

// SafeArea를 사용하는 화면 래퍼
const SafeScreen = ({ children, gradient = false }) => {
  const insets = useSafeAreaInsets();
  
  const content = (
    <View style={[styles.screenContainer, { 
      paddingBottom: insets.bottom,
      paddingTop: 0,
    }]}>
      {children}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.05)', 'transparent']}
        style={styles.gradientContainer}
      >
        {content}
      </LinearGradient>
    );
>>>>>>> Stashed changes
  }

  return content;
};

<<<<<<< Updated upstream
// 홈 화면
const HomeScreen = ({ navigation }) => (
  <View style={styles.screenContainer}>
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Innerpal 홈 🏠</Text>
        <Text style={styles.subtitle}>안녕하세요! 👋</Text>
        <Text style={styles.text}>오늘 마음은 어떠신가요?</Text>
      </View>
      
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EmotionInput')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>📝</Text>
          <Text style={styles.actionText}>감정 기록</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('InnerTalk')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>💭</Text>
          <Text style={styles.actionText}>Inner Talk</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Insights')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>📊</Text>
          <Text style={styles.actionText}>감정 분석</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => alert('CBT 가이드를 시작하려면 먼저 감정을 기록해주세요!')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>🧠</Text>
          <Text style={styles.actionText}>CBT 가이드</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎉 새로운 기능 출시!</Text>
        <Text style={styles.cardText}>감정 입력 폼과 CBT 가이드 기능이 추가되었습니다!</Text>
        <TouchableOpacity 
          style={styles.cardButton}
          onPress={() => navigation.navigate('EmotionInput')}
        >
          <Text style={styles.cardButtonText}>감정 기록하기 →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧠 CBT 인지행동치료</Text>
        <Text style={styles.cardText}>전문적인 CBT 가이드를 통해 감정을 건강하게 관리해보세요.</Text>
        <TouchableOpacity 
          style={styles.cardButton}
          onPress={() => navigation.navigate('EmotionInput')}
        >
          <Text style={styles.cardButtonText}>시작하기 →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

=======
// 개선된 인사이트 화면
>>>>>>> Stashed changes
const InsightsScreen = ({ navigation }) => (
  <SafeScreen gradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
      <View style={styles.modernHeader}>
        <LinearGradient
          colors={APP_CONFIG.colors.gradients.cool}
          style={styles.iconGradient}
        >
          <Text style={styles.headerEmoji}>📊</Text>
        </LinearGradient>
        <Text style={styles.title}>Pal Insights</Text>
        <Text style={styles.subtitle}>감정 패턴 분석 및 인사이트</Text>
      </View>
      
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>📈</Text>
          <Text style={styles.featureText}>감정 히스토리 차트</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>📅</Text>
          <Text style={styles.featureText}>주간/월간 감정 리포트</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>💡</Text>
          <Text style={styles.featureText}>개인화된 성장 인사이트</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🎯</Text>
          <Text style={styles.featureText}>맞춤형 감정 목표 설정</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.modernButton}
        onPress={() => alert('✨ 감정 분석 기능을 준비 중입니다!\n곧 만나볼 수 있어요!')}
      >
        <LinearGradient
          colors={APP_CONFIG.colors.gradients.cool}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>감정 패턴 분석하기</Text>
          <Text style={styles.buttonEmoji}>🚀</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  </SafeScreen>
);

// 개선된 프로필 화면
const ProfileScreen = ({ navigation }) => (
  <SafeScreen gradient>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
      <View style={styles.modernHeader}>
        <LinearGradient
          colors={APP_CONFIG.colors.gradients.warm}
          style={styles.iconGradient}
        >
          <Text style={styles.headerEmoji}>⚙️</Text>
        </LinearGradient>
        <Text style={styles.title}>프로필 설정</Text>
        <Text style={styles.subtitle}>사용자 설정 및 계정 관리</Text>
      </View>
      
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🎨</Text>
          <Text style={styles.featureText}>개인화 설정</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🔔</Text>
          <Text style={styles.featureText}>알림 및 보안 설정</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>📥</Text>
          <Text style={styles.featureText}>데이터 내보내기</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🌙</Text>
          <Text style={styles.featureText}>다크 모드 지원</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.modernButton}
        onPress={() => alert('🛠️ 프로필 설정 기능을 개발 중입니다!\n개인화된 경험을 준비하고 있어요!')}
      >
        <LinearGradient
          colors={APP_CONFIG.colors.gradients.warm}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>설정 열기</Text>
          <Text style={styles.buttonEmoji}>✨</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.modernButton, { marginTop: APP_CONFIG.spacing['3'] }]}
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

      <TouchableOpacity 
        style={[styles.demoButton, { backgroundColor: '#ED8936', marginTop: 12 }]}
        onPress={() => navigation.navigate('ApiTest')}
      >
        <Text style={styles.demoButtonText}>🔧 API 테스트</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeScreen>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

<<<<<<< Updated upstream
=======
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

// 메인 탭 네비게이터
>>>>>>> Stashed changes
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
          ...APP_CONFIG.shadows.lg,
        },
        tabBarActiveTintColor: APP_CONFIG.colors.primary,
        tabBarInactiveTintColor: APP_CONFIG.colors.textMuted,
        tabBarLabelStyle: {
<<<<<<< Updated upstream
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
=======
          fontSize: APP_CONFIG.fonts.sizes.xs,
          fontWeight: APP_CONFIG.fonts.weights.medium,
          marginTop: 4,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            <Text style={{ fontSize: 20 }}>
              {focused ? '🏠' : '🏡'}
            </Text>
=======
            <TabIcon focused={focused} emoji="🏡" activeEmoji="🏠" />
>>>>>>> Stashed changes
          ),
        }}
      />
      <Tab.Screen 
        name="InnerTalk" 
        component={InnerTalkScreen}
        options={{ 
          title: '대화',
          tabBarIcon: ({ focused }) => (
<<<<<<< Updated upstream
            <Text style={{ fontSize: 20 }}>
              {focused ? '💭' : '💬'}
            </Text>
=======
            <TabIcon focused={focused} emoji="💬" activeEmoji="💭" />
>>>>>>> Stashed changes
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ 
          title: '분석',
          tabBarIcon: ({ focused }) => (
<<<<<<< Updated upstream
            <Text style={{ fontSize: 20 }}>
              {focused ? '📊' : '📈'}
            </Text>
=======
            <TabIcon focused={focused} emoji="📈" activeEmoji="📊" />
>>>>>>> Stashed changes
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: '프로필',
          tabBarIcon: ({ focused }) => (
<<<<<<< Updated upstream
            <Text style={{ fontSize: 20 }}>
              {focused ? '👤' : '👥'}
            </Text>
=======
            <TabIcon focused={focused} emoji="👥" activeEmoji="👤" />
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  // 모던 로딩 화면
>>>>>>> Stashed changes
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
              colors={APP_CONFIG.colors.gradients.primary}
              style={styles.loadingLogo}
            >
              <Text style={styles.loadingEmoji}>💙</Text>
            </LinearGradient>
            <Text style={styles.logoText}>Innerpal</Text>
            <Text style={styles.tagline}>Your inner friend, always</Text>
          </View>
          
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator 
              size="large" 
              color={APP_CONFIG.colors.primary} 
            />
            <Text style={styles.loadingText}>
              내면의 친구를 깨우는 중...
            </Text>
            <View style={styles.loadingDots}>
              <Text style={styles.loadingDot}>✨</Text>
              <Text style={styles.loadingDot}>💭</Text>
              <Text style={styles.loadingDot}>🌟</Text>
            </View>
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
<<<<<<< Updated upstream
            name="EmotionInput" 
            component={EmotionInputScreen}
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
          />
          <Stack.Screen 
            name="CBTSession" 
            component={CBTSessionScreen}
            options={{
              headerShown: false,
              presentation: 'fullScreenModal'
            }}
          />
          <Stack.Screen 
            name="CBTInsights" 
            component={CBTInsightsScreen}
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
          />
          <Stack.Screen 
=======
>>>>>>> Stashed changes
            name="ApiTest" 
            component={ApiTestScreen}
            options={{
              headerShown: true,
              title: 'API 연결 테스트',
              headerStyle: {
                backgroundColor: APP_CONFIG.colors.background,
<<<<<<< Updated upstream
              },
              headerTitleStyle: {
                color: APP_CONFIG.colors.text,
                fontWeight: '600',
=======
                ...APP_CONFIG.shadows.sm,
              },
              headerTitleStyle: {
                color: APP_CONFIG.colors.text,
                fontWeight: APP_CONFIG.fonts.weights.semibold,
                fontSize: APP_CONFIG.fonts.sizes.lg,
>>>>>>> Stashed changes
              },
              headerTintColor: APP_CONFIG.colors.primary,
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
    backgroundColor: APP_CONFIG.colors.background,
  },
  
  gradientContainer: {
    flex: 1,
  },
  
  screenContainer: {
    flex: 1,
<<<<<<< Updated upstream
    backgroundColor: '#FEFCF0',
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
=======
    backgroundColor: 'transparent',
>>>>>>> Stashed changes
  },
  
  scrollView: {
    flex: 1,
  },
  
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: APP_CONFIG.spacing['6'],
    paddingVertical: APP_CONFIG.spacing['8'],
  },
  
<<<<<<< Updated upstream
  header: {
    alignItems: 'center',
    marginBottom: 24,
=======
  // 로딩 화면 스타일
  loadingGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
>>>>>>> Stashed changes
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: APP_CONFIG.spacing['6'],
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['12'],
  },
  
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: APP_CONFIG.borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['4'],
    ...APP_CONFIG.shadows.xl,
  },
  
  loadingEmoji: {
    fontSize: 36,
  },
  
  logoText: {
    fontSize: APP_CONFIG.fonts.sizes['5xl'],
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['2'],
  },
  
  tagline: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    color: APP_CONFIG.colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
<<<<<<< Updated upstream
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '22%',
=======
  loadingIndicatorContainer: {
>>>>>>> Stashed changes
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    marginTop: APP_CONFIG.spacing['4'],
    textAlign: 'center',
  },
  
  loadingDots: {
    flexDirection: 'row',
    marginTop: APP_CONFIG.spacing['2'],
    gap: APP_CONFIG.spacing['2'],
  },
  
  loadingDot: {
    fontSize: 16,
    opacity: 0.7,
  },
  
  // 모던 헤더 스타일
  modernHeader: {
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['8'],
  },
  
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: APP_CONFIG.borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['4'],
    ...APP_CONFIG.shadows.lg,
  },
  
  headerEmoji: {
    fontSize: 32,
  },
  
  title: {
    fontSize: APP_CONFIG.fonts.sizes['3xl'],
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['2'],
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // 기능 리스트
  featureList: {
    width: '100%',
    marginBottom: APP_CONFIG.spacing['8'],
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['4'],
    paddingHorizontal: APP_CONFIG.spacing['5'],
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: APP_CONFIG.borderRadius.xl,
    marginBottom: APP_CONFIG.spacing['3'],
    ...APP_CONFIG.shadows.sm,
  },
  
  featureEmoji: {
    fontSize: 20,
    marginRight: APP_CONFIG.spacing['4'],
    width: 28,
    textAlign: 'center',
  },
  
  featureText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.text,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    flex: 1,
  },
  
  // 모던 버튼
  modernButton: {
    borderRadius: APP_CONFIG.borderRadius.xl,
    overflow: 'hidden',
    ...APP_CONFIG.shadows.lg,
    marginBottom: APP_CONFIG.spacing['2'],
  },
  
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: APP_CONFIG.spacing['4'],
    paddingHorizontal: APP_CONFIG.spacing['8'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_CONFIG.spacing['2'],
  },
  
  buttonText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.textInverse,
  },
  
  buttonEmoji: {
    fontSize: 16,
  },
  
  // 탭 아이콘 스타일
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: APP_CONFIG.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  tabIconActive: {
    ...APP_CONFIG.shadows.sm,
  },
  
  tabIconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: APP_CONFIG.borderRadius.lg,
  },
  
  tabEmoji: {
    fontSize: 22,
    zIndex: 1,
  },
  
  tabEmojiActive: {
    fontSize: 24,
<<<<<<< Updated upstream
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
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A5568',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 8,
  },
  cardButton: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  
  demoButton: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
=======
>>>>>>> Stashed changes
  },
});