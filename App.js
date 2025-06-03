import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
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
  }
};

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

const InsightsScreen = ({ navigation }) => (
  <View style={styles.screenContainer}>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
      <Text style={styles.title}>Pal Insights 📊</Text>
      <Text style={styles.text}>감정 패턴 분석 및 인사이트</Text>
      <Text style={styles.devNote}>
        • 감정 히스토리 차트{'\n'}
        • 주간/월간 감정 리포트{'\n'}
        • 개인화된 성장 인사이트
      </Text>
      
      <TouchableOpacity 
        style={styles.demoButton}
        onPress={() => alert('감정 분석 기능을 준비 중입니다!')}
      >
        <Text style={styles.demoButtonText}>감정 패턴 보기</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const ProfileScreen = ({ navigation }) => (
  <View style={styles.screenContainer}>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
      <Text style={styles.title}>프로필 ⚙️</Text>
      <Text style={styles.text}>사용자 설정 및 계정 관리</Text>
      <Text style={styles.devNote}>
        • 개인화 설정{'\n'}
        • 알림 및 보안 설정{'\n'}
        • 데이터 내보내기
      </Text>
      
      <TouchableOpacity 
        style={styles.demoButton}
        onPress={() => alert('프로필 설정 기능을 개발 중입니다!')}
      >
        <Text style={styles.demoButtonText}>설정 열기</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.demoButton, { backgroundColor: '#ED8936', marginTop: 12 }]}
        onPress={() => navigation.navigate('ApiTest')}
      >
        <Text style={styles.demoButtonText}>🔧 API 테스트</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: APP_CONFIG.colors.background,
          borderTopColor: APP_CONFIG.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarActiveTintColor: APP_CONFIG.colors.primary,
        tabBarInactiveTintColor: APP_CONFIG.colors.textLight,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
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
            <Text style={{ fontSize: 20 }}>
              {focused ? '🏠' : '🏡'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="InnerTalk" 
        component={InnerTalkScreen}
        options={{ 
          title: '대화',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
              {focused ? '💭' : '💬'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ 
          title: '분석',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
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
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>
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
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <StatusBar 
          style="dark" 
          backgroundColor={APP_CONFIG.colors.background} 
        />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
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
            name="ApiTest" 
            component={ApiTestScreen}
            options={{
              headerShown: true,
              title: 'API 연결 테스트',
              headerStyle: {
                backgroundColor: APP_CONFIG.colors.background,
              },
              headerTitleStyle: {
                color: APP_CONFIG.colors.text,
                fontWeight: '600',
              },
              headerTintColor: APP_CONFIG.colors.primary,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  
  screenContainer: {
    flex: 1,
    backgroundColor: '#FEFCF0',
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 8,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '22%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
});