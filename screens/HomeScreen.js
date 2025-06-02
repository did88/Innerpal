import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions 
} from 'react-native';
import { APP_CONFIG, EMOTION_CONFIG } from '../config/app';
import { Button, Card, EmotionBadge } from '../components/common';
import { dateUtils, emotionUtils } from '../utils';
import { database, auth } from '../lib/supabase';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const [weeklyInsight, setWeeklyInsight] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // 현재 사용자 정보 가져오기
      const { user } = await auth.getCurrentUser();
      setCurrentUser(user);

      if (user) {
        // 최근 감정 기록 가져오기 (최근 5개)
        const { data: emotions } = await database.getEmotions(user.id, 5);
        setRecentEmotions(emotions || []);

        // 오늘의 감정 상태 확인
        const today = new Date().toISOString().split('T')[0];
        const todayEmotion = emotions?.find(emotion => 
          emotion.created_at.startsWith(today)
        );
        setTodayMood(todayEmotion);

        // 주간 인사이트 (임시 데이터)
        setWeeklyInsight({
          trend: '긍정적',
          message: '이번 주 전반적으로 안정된 감정 상태를 보이고 있어요.',
          improvement: 15
        });
      }
    } catch (error) {
      console.error('Home data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = currentUser?.user_metadata?.display_name || '친구';
    
    if (hour < 12) return `좋은 아침이에요, ${name}님! ☀️`;
    if (hour < 18) return `안녕하세요, ${name}님! 🌤️`;
    return `좋은 저녁이에요, ${name}님! 🌙`;
  };

  const getMoodStatusMessage = () => {
    if (!todayMood) {
      return {
        title: "오늘의 마음은 어떠신가요?",
        subtitle: "첫 번째 감정을 기록해보세요",
        action: "감정 기록하기",
        actionType: "primary"
      };
    }

    const emotion = EMOTION_CONFIG.categories.find(e => e.id === todayMood.primary_emotion);
    return {
      title: `오늘은 ${emotion?.name || '복잡한'} 하루였군요`,
      subtitle: `${dateUtils.formatTimeOnly(todayMood.created_at)}에 기록됨`,
      action: "더 이야기하기",
      actionType: "secondary"
    };
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('InnerTalk')}
      >
        <Text style={styles.quickActionEmoji}>💭</Text>
        <Text style={styles.quickActionText}>Inner Talk</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('Insights')}
      >
        <Text style={styles.quickActionEmoji}>📊</Text>
        <Text style={styles.quickActionText}>감정 분석</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => {/* 명상 기능 추후 구현 */}}
      >
        <Text style={styles.quickActionEmoji}>🧘‍♀️</Text>
        <Text style={styles.quickActionText}>마음 챙김</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => {/* 응급 위로 기능 추후 구현 */}}
      >
        <Text style={styles.quickActionEmoji}>🤗</Text>
        <Text style={styles.quickActionText}>응급 위로</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecentEmotions = () => {
    if (!recentEmotions.length) {
      return (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>아직 감정 기록이 없어요</Text>
          <Text style={styles.emptySubtext}>첫 번째 마음을 기록해보세요</Text>
        </Card>
      );
    }

    return (
      <View>
        {recentEmotions.slice(0, 3).map((emotion, index) => (
          <Card key={emotion.id} style={[styles.emotionCard, index > 0 && { marginTop: 12 }]}>
            <View style={styles.emotionHeader}>
              <EmotionBadge 
                emotion={emotion.primary_emotion} 
                intensity={emotion.intensity}
                size="sm"
              />
              <Text style={styles.emotionTime}>
                {dateUtils.formatRelative(emotion.created_at)}
              </Text>
            </View>
            <Text style={styles.emotionText} numberOfLines={2}>
              {emotion.emotion_text}
            </Text>
            {emotion.gpt_response && (
              <Text style={styles.responseText} numberOfLines={1}>
                💙 {emotion.gpt_response}
              </Text>
            )}
          </Card>
        ))}
        
        {recentEmotions.length > 3 && (
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate('Insights')}
          >
            <Text style={styles.viewMoreText}>더 보기 →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderWeeklyInsight = () => {
    if (!weeklyInsight) return null;

    return (
      <Card style={[styles.insightCard, { backgroundColor: APP_CONFIG.colors.primary + '10' }]}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightTitle}>📈 이번 주 인사이트</Text>
          <View style={styles.insightBadge}>
            <Text style={styles.insightBadgeText}>{weeklyInsight.trend}</Text>
          </View>
        </View>
        <Text style={styles.insightMessage}>{weeklyInsight.message}</Text>
        <View style={styles.insightProgress}>
          <Text style={styles.insightProgressText}>감정 안정도</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${weeklyInsight.improvement}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercent}>{weeklyInsight.improvement}%</Text>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Innerpal 준비 중...</Text>
      </View>
    );
  }

  const moodStatus = getMoodStatusMessage();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[APP_CONFIG.colors.primary]}
          tintColor={APP_CONFIG.colors.primary}
        />
      }
    >
      {/* 인사말 섹션 */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.dateText}>{dateUtils.formatAbsolute(new Date(), 'M월 d일 EEEE')}</Text>
      </View>

      {/* 오늘의 감정 상태 */}
      <Card style={styles.moodCard}>
        <Text style={styles.moodTitle}>{moodStatus.title}</Text>
        <Text style={styles.moodSubtitle}>{moodStatus.subtitle}</Text>
        
        {todayMood && (
          <View style={styles.moodDisplay}>
            <EmotionBadge 
              emotion={todayMood.primary_emotion}
              intensity={todayMood.intensity}
              size="lg"
            />
          </View>
        )}
        
        <Button
          title={moodStatus.action}
          variant={moodStatus.actionType}
          onPress={() => navigation.navigate('InnerTalk')}
          style={styles.moodButton}
        />
      </Card>

      {/* 빠른 액션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>빠른 실행</Text>
        {renderQuickActions()}
      </View>

      {/* 주간 인사이트 */}
      {weeklyInsight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>나의 감정 여행</Text>
          {renderWeeklyInsight()}
        </View>
      )}

      {/* 최근 감정 기록 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 기록</Text>
        {renderRecentEmotions()}
      </View>

      {/* 하단 여백 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  contentContainer: {
    padding: APP_CONFIG.spacing.lg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    color: APP_CONFIG.colors.textLight,
  },

  // 인사말 섹션
  greetingSection: {
    marginBottom: APP_CONFIG.spacing.xl,
  },
  greetingText: {
    fontSize: APP_CONFIG.fonts.sizes.xl,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing.xs,
  },
  dateText: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.textLight,
  },

  // 감정 상태 카드
  moodCard: {
    marginBottom: APP_CONFIG.spacing.xl,
    alignItems: 'center',
  },
  moodTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    textAlign: 'center',
    marginBottom: APP_CONFIG.spacing.xs,
  },
  moodSubtitle: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
    marginBottom: APP_CONFIG.spacing.lg,
  },
  moodDisplay: {
    marginBottom: APP_CONFIG.spacing.lg,
  },
  moodButton: {
    minWidth: 200,
  },

  // 빠른 액션
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickActionButton: {
    width: (width - APP_CONFIG.spacing.lg * 2 - APP_CONFIG.spacing.md * 3) / 4,
    alignItems: 'center',
    padding: APP_CONFIG.spacing.md,
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: APP_CONFIG.borderRadius.lg,
    marginBottom: APP_CONFIG.spacing.sm,
    ...APP_CONFIG.shadows.sm,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: APP_CONFIG.spacing.xs,
  },
  quickActionText: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    color: APP_CONFIG.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },

  // 섹션
  section: {
    marginBottom: APP_CONFIG.spacing.xl,
  },
  sectionTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing.md,
  },

  // 감정 기록 카드
  emotionCard: {
    backgroundColor: APP_CONFIG.colors.surface,
  },
  emotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing.sm,
  },
  emotionTime: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textMuted,
  },
  emotionText: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.text,
    lineHeight: 20,
    marginBottom: APP_CONFIG.spacing.sm,
  },
  responseText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.primary,
    fontStyle: 'italic',
  },

  // 빈 상태
  emptyCard: {
    alignItems: 'center',
    padding: APP_CONFIG.spacing.xl,
  },
  emptyText: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    color: APP_CONFIG.colors.textLight,
    marginBottom: APP_CONFIG.spacing.xs,
  },
  emptySubtext: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.textMuted,
  },

  // 더보기 버튼
  viewMoreButton: {
    alignItems: 'center',
    padding: APP_CONFIG.spacing.md,
    marginTop: APP_CONFIG.spacing.sm,
  },
  viewMoreText: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.primary,
    fontWeight: '500',
  },

  // 인사이트 카드
  insightCard: {
    borderLeftWidth: 4,
    borderLeftColor: APP_CONFIG.colors.primary,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing.sm,
  },
  insightTitle: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
  },
  insightBadge: {
    backgroundColor: APP_CONFIG.colors.success,
    paddingHorizontal: APP_CONFIG.spacing.sm,
    paddingVertical: APP_CONFIG.spacing.xs,
    borderRadius: APP_CONFIG.borderRadius.sm,
  },
  insightBadgeText: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    color: 'white',
    fontWeight: '500',
  },
  insightMessage: {
    fontSize: APP_CONFIG.fonts.sizes.md,
    color: APP_CONFIG.colors.text,
    lineHeight: 20,
    marginBottom: APP_CONFIG.spacing.md,
  },
  insightProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightProgressText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
    marginRight: APP_CONFIG.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: APP_CONFIG.colors.border,
    borderRadius: 3,
    marginRight: APP_CONFIG.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: APP_CONFIG.colors.success,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.success,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: APP_CONFIG.spacing.xl,
  },
});

export default HomeScreen;