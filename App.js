import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView, Platform, Dimensions } from 'react-native';

// 실제 구현된 화면들
import InnerTalkScreen from './screens/InnerTalkScreen';

const { height: screenHeight } = Dimensions.get('window');

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
          onPress={() => alert('마음 챙김 기능 개발 중입니다!')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>🧘‍♀️</Text>
          <Text style={styles.actionText}>마음 챙김</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => alert('응급 위로 기능 개발 중입니다!')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>🤗</Text>
          <Text style={styles.actionText}>응급 위로</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 새로운 기능 출시!</Text>
        <Text style={styles.cardText}>Inner Talk 기능이 추가되었습니다! AI와 실제 대화를 나눠보세요.</Text>
        <TouchableOpacity 
          style={styles.cardButton}
          onPress={() => navigation.navigate('InnerTalk')}
        >
          <Text style={styles.cardButtonText}>지금 체험하기 →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 이번 주 인사이트</Text>
        <Text style={styles.cardText}>전반적으로 안정된 감정 상태를 보이고 있어요.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔍 최근 기록</Text>
        <Text style={styles.cardText}>아직 감정 기록이 없어요. 첫 번째 마음을 기록해보세요!</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 오늘의 팁</Text>
        <Text style={styles.cardText}>감정을 기록하는 것만으로도 마음이 정리되는 효과가 있어요.</Text>
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
    </ScrollView>
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
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: '홈',
          tabBarLabel: '홈',
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
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
  
  // 화면 컨테이너 (탭바 공간 확보)
  screenContainer: {
    flex: 1,
    backgroundColor: '#FEFCF0',
    paddingBottom: Platform.OS === 'ios' ? 80 : 60, // 탭바 높이만큼 하단 패딩
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
  
  // 헤더 스타일
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
  
  // 홈 화면 스타일들
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
  
  // 카드 스타일
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
  
  // 데모 버튼
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