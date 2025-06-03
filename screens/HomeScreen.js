<<<<<<< Updated upstream
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
=======
import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_CONFIG, UI_PRESETS, EMOTION_CONFIG } from '../config/app';
import { database, auth } from '../lib/supabase';
import { dateUtils, emotionUtils } from '../utils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 미니멀 애니메이션 카드
const AnimatedCard = ({ children, style, onPress, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <Animated.View 
      style={[
        { 
          opacity: fadeAnim, 
          transform: [{ translateY }] 
        },
        style
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// 미니멀 카드 컴포넌트
const MinimalCard = ({ children, style, elevated = false, ...props }) => (
  <View style={[
    elevated ? UI_PRESETS.cards.elevated : UI_PRESETS.cards.default, 
    style
  ]} {...props}>
    {children}
  </View>
);

// 미니멀 퀵 액션 버튼
const QuickActionButton = ({ title, emoji, onPress, isPrimary = false, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style}>
    <View style={[styles.quickActionButton, isPrimary && styles.primaryAction]}>
      <Text style={[styles.quickActionEmoji, isPrimary && styles.primaryEmoji]}>
        {emoji}
      </Text>
      <Text style={[styles.quickActionText, isPrimary && styles.primaryText]}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

// 감정 기록 아이템
const EmotionRecordItem = ({ emotion, onPress }) => {
  const emotionConfig = EMOTION_CONFIG.categories.find(cat => 
    cat.name === emotion.primary_emotion || cat.id === emotion.primary_emotion
  ) || EMOTION_CONFIG.categories[6];

  return (
    <TouchableOpacity 
      style={styles.emotionRecord}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.emotionRecordLeft}>
        <View style={[styles.emotionRecordIcon, { backgroundColor: emotionConfig.lightColor }]}>
          <Text style={styles.emotionRecordEmoji}>{emotionConfig.emoji}</Text>
        </View>
        <View style={styles.emotionRecordInfo}>
          <Text style={styles.emotionRecordEmotion}>
            {emotionConfig.name}
          </Text>
          <Text style={styles.emotionRecordTime}>
            {dateUtils.formatRelative(emotion.created_at)}
          </Text>
        </View>
      </View>
      <View style={styles.emotionRecordRight}>
        <View style={styles.intensityIndicator}>
          {[1, 2, 3, 4, 5].map(level => (
            <View
              key={level}
              style={[
                styles.intensityDot,
                {
                  backgroundColor: level <= emotion.intensity 
                    ? APP_CONFIG.colors.purple 
                    : APP_CONFIG.colors.borderLight
                }
              ]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 통계 아이템
const StatItem = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// 로딩 스켈레톤
const SkeletonItem = () => (
  <View style={styles.skeletonItem}>
    <View style={styles.skeletonCircle} />
    <View style={styles.skeletonContent}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const [emotionStats, setEmotionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  // 데이터 로드
  const loadUserData = async () => {
    try {
      const { user, error: userError } = await auth.getCurrentUser();
      if (userError) {
        setCurrentUser({ id: 'anonymous', isAnonymous: true });
      } else {
        setCurrentUser(user);
      }

      const userId = user?.id || 'anonymous';
      const { data: emotions, error: emotionsError } = await database.getEmotions(userId, 5);
      
      if (emotionsError) {
        setRecentEmotions([]);
      } else {
        setRecentEmotions(emotions || []);
      }

      if (emotions && emotions.length > 0) {
        const stats = calculateEmotionStats(emotions);
        setEmotionStats(stats);
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 감정 통계 계산
  const calculateEmotionStats = (emotions) => {
    if (!emotions || emotions.length === 0) return null;

    const emotionCounts = {};
    let totalIntensity = 0;
    let positiveCount = 0;

    emotions.forEach(emotion => {
      emotionCounts[emotion.primary_emotion] = (emotionCounts[emotion.primary_emotion] || 0) + 1;
      totalIntensity += emotion.intensity || 3;
      
      if (['기쁨', 'joy', '놀람', 'surprise'].includes(emotion.primary_emotion)) {
        positiveCount++;
      }
    });

    const avgIntensity = Math.round(totalIntensity / emotions.length * 10) / 10;
    const positiveRatio = Math.round((positiveCount / emotions.length) * 100);

    return {
      totalRecords: emotions.length,
      avgIntensity,
      positiveRatio,
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'innerTalk':
        navigation.navigate('InnerTalk');
        break;
      case 'insights':
        navigation.navigate('Insights');
        break;
      case 'emergency':
        Alert.alert(
          '응급 위로', 
          '힘든 시간이군요. 깊게 숨을 들이마시고 천천히 내쉬어보세요.\n\n"이 또한 지나갈 것입니다."',
          [
            { text: '괜찮아요', style: 'cancel' },
            { text: 'Inner Talk 하기', onPress: () => navigation.navigate('InnerTalk') }
          ]
        );
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={APP_CONFIG.colors.white} />
      
>>>>>>> Stashed changes
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
<<<<<<< Updated upstream
      >
        {/* 헤더 */}
        <LinearGradient
          colors={['rgba(124, 58, 237, 0.1)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>안녕하세요! 👋</Text>
            <Text style={styles.title}>Innerpal</Text>
            <Text style={styles.subtitle}>오늘 마음은 어떠신가요?</Text>
=======
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[APP_CONFIG.colors.purple]}
            tintColor={APP_CONFIG.colors.purple}
          />
        }
      >
        {/* 미니멀 헤더 */}
        <AnimatedCard style={styles.headerSection} delay={0}>
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandEmoji}>💙</Text>
              </View>
              <View style={styles.brandContent}>
                <Text style={styles.brandText}>Innerpal</Text>
                <Text style={styles.brandTagline}>Your inner friend</Text>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.subtitle}>
                {currentUser?.isAnonymous 
                  ? '익명으로 안전하게 사용 중'
                  : '오늘 마음은 어떠신가요?'
                }
              </Text>
            </View>
>>>>>>> Stashed changes
          </View>
        </LinearGradient>
        
<<<<<<< Updated upstream
        {/* 빠른 액션 */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.primaryAction}
            onPress={() => navigation.navigate('EmotionAnalysis')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.primaryActionGradient}
            >
              <Text style={styles.primaryActionEmoji}>🧠</Text>
              <Text style={styles.primaryActionTitle}>감정 분석</Text>
              <Text style={styles.primaryActionDesc}>AI 기반 감정 분석 및 추천</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('InnerTalk')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionEmoji}>💭</Text>
              <Text style={styles.actionText}>대화하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Insights')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionText}>분석 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 오늘의 인사이트 */}
        <View style={styles.insightCard}>
          <Text style={styles.cardTitle}>💡 오늘의 인사이트</Text>
          <Text style={styles.cardText}>
            감정을 표현하는 것은 정신 건강의 첫 번째 단계입니다. 
            Innerpal과 함께 당신의 내면을 탐험해보세요.
          </Text>
          <TouchableOpacity 
            style={styles.cardButton}
            onPress={() => navigation.navigate('EmotionAnalysis')}
          >
            <Text style={styles.cardButtonText}>지금 시작하기 →</Text>
          </TouchableOpacity>
        </View>

        {/* 기능 소개 */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>🌟 주요 기능</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI 감정 분석</Text>
              <Text style={styles.featureDesc}>7가지 감정을 실시간으로 분석하고 개인화된 추천을 제공합니다</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📈</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>감정 패턴 추적</Text>
              <Text style={styles.featureDesc}>시간에 따른 감정 변화를 추적하고 트렌드를 분석합니다</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💡</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>맞춤형 조언</Text>
              <Text style={styles.featureDesc}>현재 감정 상태에 맞는 구체적인 행동 가이드를 제안합니다</Text>
            </View>
          </View>
        </View>
        
        {/* 통계 카드 */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>나의 감정 여정</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>연속 일수</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>총 분석</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>😊</Text>
              <Text style={styles.statLabel}>최근 기분</Text>
            </View>
          </View>
        </View>
=======
        {/* 퀵 액션 */}
        <AnimatedCard delay={100}>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton
              title="Inner Talk"
              emoji="💭"
              onPress={() => handleQuickAction('innerTalk')}
              isPrimary={true}
              style={styles.primaryQuickAction}
            />
            <View style={styles.secondaryActions}>
              <QuickActionButton
                title="감정 분석"
                emoji="📊"
                onPress={() => handleQuickAction('insights')}
                style={styles.secondaryQuickAction}
              />
              <QuickActionButton
                title="응급 위로"
                emoji="🤗"
                onPress={() => handleQuickAction('emergency')}
                style={styles.secondaryQuickAction}
              />
            </View>
          </View>
        </AnimatedCard>

        {/* 통계 요약 */}
        {emotionStats && (
          <AnimatedCard delay={200}>
            <MinimalCard style={styles.statsCard}>
              <Text style={styles.cardTitle}>이번 주 감정 현황</Text>
              <View style={styles.statsContainer}>
                <StatItem
                  icon="📝"
                  label="기록 수"
                  value={`${emotionStats.totalRecords}`}
                />
                <StatItem
                  icon="😊"
                  label="긍정 비율"
                  value={`${emotionStats.positiveRatio}%`}
                />
                <StatItem
                  icon="📊"
                  label="평균 강도"
                  value={`${emotionStats.avgIntensity}/5`}
                />
              </View>
            </MinimalCard>
          </AnimatedCard>
        )}
        
        {/* 최근 감정 기록 */}
        <AnimatedCard delay={300}>
          <MinimalCard style={styles.recentEmotionsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>최근 기록</Text>
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => navigation.navigate('Insights')}
              >
                <Text style={styles.moreButtonText}>전체보기</Text>
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.skeletonContainer}>
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </View>
            ) : recentEmotions.length > 0 ? (
              <View style={styles.emotionsList}>
                {recentEmotions.slice(0, 3).map((emotion, index) => (
                  <EmotionRecordItem
                    key={emotion.id || index}
                    emotion={emotion}
                    onPress={() => {
                      Alert.alert(
                        '감정 기록',
                        emotion.emotion_text,
                        [
                          { text: '닫기', style: 'cancel' },
                          { text: '자세히 보기', onPress: () => navigation.navigate('Insights') }
                        ]
                      );
                    }}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>✨</Text>
                <Text style={styles.emptyTitle}>첫 번째 감정을 기록해보세요</Text>
                <Text style={styles.emptyText}>
                  Inner Talk에서 AI와 대화하며 감정을 자연스럽게 표현할 수 있어요
                </Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => handleQuickAction('innerTalk')}
                >
                  <Text style={styles.emptyButtonText}>지금 시작하기</Text>
                </TouchableOpacity>
              </View>
            )}
          </MinimalCard>
        </AnimatedCard>
        
        {/* 오늘의 팁 */}
        <AnimatedCard delay={400}>
          <MinimalCard style={[styles.tipCard, { marginBottom: APP_CONFIG.spacing['8'] }]}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>오늘의 마음 팁</Text>
            </View>
            <Text style={styles.tipText}>
              {recentEmotions.length > 0 
                ? '꾸준히 감정을 기록하고 계시는군요! 패턴을 발견하면 더 나은 감정 관리가 가능해져요.'
                : '감정을 글로 표현하는 것만으로도 마음의 정리와 치유 효과를 얻을 수 있어요.'
              }
            </Text>
          </MinimalCard>
        </AnimatedCard>
>>>>>>> Stashed changes
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< Updated upstream
    backgroundColor: '#FEFCF0',
  },
=======
    backgroundColor: APP_CONFIG.colors.white,
  },
  
>>>>>>> Stashed changes
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // 탭바 여백
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
<<<<<<< Updated upstream
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
=======
    marginBottom: APP_CONFIG.spacing['5'],
  },
  
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: APP_CONFIG.borderRadius.lg,
    backgroundColor: APP_CONFIG.colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_CONFIG.spacing['3'],
  },
  
  brandEmoji: {
    fontSize: 20,
    color: APP_CONFIG.colors.white,
  },
  
  brandContent: {
    flex: 1,
  },
  
  brandText: {
    fontSize: APP_CONFIG.fonts.sizes['3xl'],
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
    marginBottom: 2,
  },
  
  brandTagline: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textMuted,
    fontStyle: 'italic',
  },
  
  greetingContainer: {
    paddingLeft: APP_CONFIG.spacing['1'],
  },
  
  greeting: {
    fontSize: APP_CONFIG.fonts.sizes.xl,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['1'],
>>>>>>> Stashed changes
  },
  subtitle: {
<<<<<<< Updated upstream
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryAction: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryActionGradient: {
    padding: 24,
    alignItems: 'center',
  },
  primaryActionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  primaryActionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  primaryActionDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
=======
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
  },
  
  // 퀵 액션 스타일
  quickActionsContainer: {
    marginBottom: APP_CONFIG.spacing['6'],
  },
  
  primaryQuickAction: {
    marginBottom: APP_CONFIG.spacing['3'],
  },
  
  secondaryActions: {
    flexDirection: 'row',
    gap: APP_CONFIG.spacing['3'],
  },
  
  secondaryQuickAction: {
    flex: 1,
  },
  
  quickActionButton: {
    backgroundColor: APP_CONFIG.colors.surfaceGray,
    borderRadius: APP_CONFIG.borderRadius.xl,
    paddingVertical: APP_CONFIG.spacing['5'],
    paddingHorizontal: APP_CONFIG.spacing['4'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.borderLight,
  },
  
  primaryAction: {
    backgroundColor: APP_CONFIG.colors.purple,
    borderColor: APP_CONFIG.colors.purple,
  },
  
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: APP_CONFIG.spacing['2'],
  },
  
  primaryEmoji: {
    color: APP_CONFIG.colors.white,
  },
  
  quickActionText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.text,
  },
  
  primaryText: {
    color: APP_CONFIG.colors.white,
  },
  
  // 통계 카드
  statsCard: {
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: APP_CONFIG.spacing['4'],
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statIcon: {
    fontSize: 20,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  statValue: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.purple,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  statLabel: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
  },
  
  // 카드 공통
  cardTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['3'],
  },
  
  // 최근 감정 기록
  recentEmotionsCard: {
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  moreButton: {
    paddingVertical: APP_CONFIG.spacing['1'],
    paddingHorizontal: APP_CONFIG.spacing['3'],
  },
  
  moreButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.purple,
    fontWeight: APP_CONFIG.fonts.weights.medium,
  },
  
  emotionsList: {
    gap: APP_CONFIG.spacing['3'],
  },
  
  emotionRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: APP_CONFIG.spacing['3'],
    paddingHorizontal: APP_CONFIG.spacing['4'],
    backgroundColor: APP_CONFIG.colors.surfaceGray,
    borderRadius: APP_CONFIG.borderRadius.lg,
  },
  
  emotionRecordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  emotionRecordIcon: {
    width: 40,
    height: 40,
    borderRadius: APP_CONFIG.borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_CONFIG.spacing['3'],
  },
  
  emotionRecordEmoji: {
>>>>>>> Stashed changes
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
<<<<<<< Updated upstream
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardButton: {
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  statsCard: {
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
=======
  
  emotionRecordInfo: {
    flex: 1,
  },
  
  emotionRecordEmotion: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.text,
    marginBottom: 2,
  },
  
  emotionRecordTime: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textMuted,
  },
  
  emotionRecordRight: {
    alignItems: 'flex-end',
  },
  
  intensityIndicator: {
    flexDirection: 'row',
    gap: 2,
  },
  
  intensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  // 빈 상태
  emptyState: {
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['8'],
  },
  
  emptyEmoji: {
    fontSize: 48,
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  emptyTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['2'],
    textAlign: 'center',
  },
  
  emptyText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: APP_CONFIG.spacing['5'],
  },
  
  emptyButton: {
    backgroundColor: APP_CONFIG.colors.purple,
    paddingVertical: APP_CONFIG.spacing['3'],
    paddingHorizontal: APP_CONFIG.spacing['6'],
    borderRadius: APP_CONFIG.borderRadius.lg,
  },
  
  emptyButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.white,
  },
  
  // 로딩 스켈레톤
  skeletonContainer: {
    gap: APP_CONFIG.spacing['3'],
  },
  
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['3'],
  },
  
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_CONFIG.colors.borderLight,
    marginRight: APP_CONFIG.spacing['3'],
  },
  
  skeletonContent: {
    flex: 1,
  },
  
  skeletonLine: {
    height: 12,
    backgroundColor: APP_CONFIG.colors.borderLight,
    borderRadius: 6,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  // 팁 카드
  tipCard: {
    backgroundColor: APP_CONFIG.colors.surfaceGray,
  },
  
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['3'],
  },
  
  tipIcon: {
    fontSize: 20,
    marginRight: APP_CONFIG.spacing['2'],
  },
  
  tipTitle: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
  },
  
  tipText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 22,
>>>>>>> Stashed changes
  },
});

export default HomeScreen;
