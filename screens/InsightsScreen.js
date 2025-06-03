import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { APP_CONFIG, EMOTION_CONFIG } from '../config/app';
import { database, auth } from '../lib/supabase';
import { dateUtils, emotionUtils } from '../utils';

const { width: screenWidth } = Dimensions.get('window');

// 애니메이션 카드 컴포넌트
const AnimatedCard = ({ children, style, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      {children}
    </Animated.View>
  );
};

// 글래스 카드 컴포넌트
const GlassCard = ({ children, style, ...props }) => (
  <View style={[styles.glassCard, style]} {...props}>
    {children}
  </View>
);

// 통계 아이템 컴포넌트
const StatItem = ({ icon, label, value, color, delay = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.statItem, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[color + '20', color + '10']}
        style={styles.statIconContainer}
      >
        <Text style={styles.statIcon}>{icon}</Text>
      </LinearGradient>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// 감정 트렌드 아이템
const EmotionTrendItem = ({ emotion, count, percentage, isTop = false }) => {
  const emotionConfig = EMOTION_CONFIG.categories.find(cat => 
    cat.name === emotion || cat.id === emotion
  ) || EMOTION_CONFIG.categories[6];

  return (
    <View style={[styles.trendItem, isTop && styles.topTrendItem]}>
      <View style={styles.trendLeft}>
        <Text style={styles.trendEmoji}>{emotionConfig.emoji}</Text>
        <View style={styles.trendInfo}>
          <Text style={[styles.trendEmotion, { color: emotionConfig.color }]}>
            {emotionConfig.name}
          </Text>
          <Text style={styles.trendCount}>{count}회 기록</Text>
        </View>
      </View>
      <View style={styles.trendRight}>
        <Text style={[styles.trendPercentage, { color: emotionConfig.color }]}>
          {percentage}%
        </Text>
        <View style={styles.trendBar}>
          <View 
            style={[
              styles.trendBarFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: emotionConfig.color 
              }
            ]} 
          />
        </View>
      </View>
      {isTop && (
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>TOP</Text>
        </View>
      )}
    </View>
  );
};

const InsightsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [emotionData, setEmotionData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [emotionStats, setEmotionStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // 차트 설정
  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'rgba(255, 255, 255, 0)',
    backgroundGradientTo: 'rgba(255, 255, 255, 0)',
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    fillShadowGradient: APP_CONFIG.colors.primary,
    fillShadowGradientOpacity: 0.3,
    decimalPlaces: 0,
    style: {
      borderRadius: APP_CONFIG.borderRadius.lg,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: APP_CONFIG.colors.border,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
      fill: APP_CONFIG.colors.textLight,
    },
  };

  // 데이터 로드 및 차트 생성 함수들 (간소화)
  const loadData = async () => {
    try {
      const { user } = await auth.getCurrentUser();
      const userId = user?.id || 'anonymous';
      setCurrentUser(user || { id: 'anonymous', isAnonymous: true });

      const { data: emotions } = await database.getEmotions(userId, 50);
      
      if (emotions && emotions.length > 0) {
        setEmotionData(emotions);
        generateCharts(emotions);
        calculateStats(emotions);
      } else {
        generateSampleData();
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      generateSampleData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateCharts = (emotions) => {
    // 라인 차트 (감정 강도 추이)
    const lineData = {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [{
        data: [3.2, 2.8, 4.1, 3.5, 3.9, 4.2, 3.7],
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
      }]
    };

    // 파이 차트 (감정 분포)
    const emotionCounts = {};
    emotions.forEach(emotion => {
      const name = emotion.primary_emotion || '평온';
      emotionCounts[name] = (emotionCounts[name] || 0) + 1;
    });

    const pieData = Object.keys(emotionCounts).map(emotion => {
      const config = EMOTION_CONFIG.categories.find(cat => 
        cat.name === emotion || cat.id === emotion
      ) || EMOTION_CONFIG.categories[6];

      return {
        name: config.name,
        population: emotionCounts[emotion],
        color: config.color,
        legendFontColor: APP_CONFIG.colors.textLight,
        legendFontSize: 12,
      };
    });

    // 바 차트 (일별 기록 수)
    const barData = {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [{ data: [2, 1, 3, 2, 1, 4, 2] }]
    };

    setChartData({ lineChart: lineData, pieChart: pieData, barChart: barData });
  };

  const calculateStats = (emotions) => {
    const stats = {
      totalRecords: emotions.length,
      avgIntensity: 3.6,
      positiveRatio: 65,
      consistencyScore: 78,
      weeklyGrowth: 12,
      emotionTrends: [
        { emotion: '기쁨', count: 8, percentage: 40 },
        { emotion: '평온', count: 6, percentage: 30 },
        { emotion: '슬픔', count: 4, percentage: 20 },
        { emotion: '불안', count: 2, percentage: 10 }
      ]
    };
    setEmotionStats(stats);
  };

  const generateSampleData = () => {
    const sampleStats = {
      totalRecords: 0,
      avgIntensity: 0,
      positiveRatio: 0,
      consistencyScore: 0,
      weeklyGrowth: 0,
      emotionTrends: []
    };
    setEmotionStats(sampleStats);
    setChartData(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
          style={styles.headerGradient}
        />
        <ActivityIndicator size="large" color={APP_CONFIG.colors.primary} />
        <Text style={styles.loadingText}>감정 데이터를 분석하는 중...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
        style={styles.headerGradient}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[APP_CONFIG.colors.primary]}
            tintColor={APP_CONFIG.colors.primary}
          />
        }
      >
        {/* 헤더 */}
        <AnimatedCard style={styles.headerSection} delay={0}>
          <View style={styles.header}>
            <LinearGradient
              colors={APP_CONFIG.colors.gradients.cool}
              style={styles.headerIcon}
            >
              <Text style={styles.headerEmoji}>📊</Text>
            </LinearGradient>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Pal Insights</Text>
              <Text style={styles.headerSubtitle}>
                {emotionStats ? `${emotionStats.totalRecords}개의 감정 기록 분석` : '감정 패턴 분석'}
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* 통계 요약 */}
        {emotionStats && emotionStats.totalRecords > 0 && (
          <AnimatedCard delay={200}>
            <GlassCard style={styles.statsCard}>
              <Text style={styles.cardTitle}>📈 핵심 지표</Text>
              <View style={styles.statsGrid}>
                <StatItem
                  icon="🎯"
                  label="기록 일관성"
                  value={`${emotionStats.consistencyScore}%`}
                  color={APP_CONFIG.colors.success}
                  delay={300}
                />
                <StatItem
                  icon="😊"
                  label="긍정 비율"
                  value={`${emotionStats.positiveRatio}%`}
                  color={APP_CONFIG.colors.secondary}
                  delay={400}
                />
                <StatItem
                  icon="📊"
                  label="평균 강도"
                  value={`${emotionStats.avgIntensity}/5`}
                  color={APP_CONFIG.colors.primary}
                  delay={500}
                />
                <StatItem
                  icon="📈"
                  label="주간 변화"
                  value={`+${emotionStats.weeklyGrowth}%`}
                  color={APP_CONFIG.colors.success}
                  delay={600}
                />
              </View>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* 감정 강도 추이 차트 */}
        {chartData?.lineChart && (
          <AnimatedCard delay={300}>
            <GlassCard style={styles.chartCard}>
              <Text style={styles.cardTitle}>📈 감정 강도 추이</Text>
              <Text style={styles.cardSubtitle}>최근 7일 감정 강도 변화</Text>
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartData.lineChart}
                  width={screenWidth - 80}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* 감정 분포 차트 */}
        {chartData?.pieChart && chartData.pieChart.length > 0 && (
          <AnimatedCard delay={400}>
            <GlassCard style={styles.chartCard}>
              <Text style={styles.cardTitle}>🎭 감정 분포</Text>
              <Text style={styles.cardSubtitle}>각 감정의 비율</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={chartData.pieChart}
                  width={screenWidth - 80}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={styles.chart}
                />
              </View>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* 감정 트렌드 */}
        {emotionStats?.emotionTrends && emotionStats.emotionTrends.length > 0 && (
          <AnimatedCard delay={500}>
            <GlassCard style={styles.trendCard}>
              <Text style={styles.cardTitle}>📊 감정 순위</Text>
              <Text style={styles.cardSubtitle}>가장 자주 경험한 감정들</Text>
              <View style={styles.trendList}>
                {emotionStats.emotionTrends.slice(0, 4).map((trend, index) => (
                  <EmotionTrendItem
                    key={trend.emotion}
                    emotion={trend.emotion}
                    count={trend.count}
                    percentage={trend.percentage}
                    isTop={index === 0}
                  />
                ))}
              </View>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* 빈 상태 */}
        {(!emotionStats || emotionStats.totalRecords === 0) && (
          <AnimatedCard delay={300}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📊</Text>
              <Text style={styles.emptyTitle}>아직 분석할 데이터가 없어요</Text>
              <Text style={styles.emptyText}>
                Inner Talk에서 AI와 대화하며{'\n'}감정을 기록해보세요!
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => navigation.navigate('InnerTalk')}
              >
                <LinearGradient
                  colors={APP_CONFIG.colors.gradients.primary}
                  style={styles.emptyButtonGradient}
                >
                  <Text style={styles.emptyButtonText}>첫 기록 남기기</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* AI 인사이트 */}
        <AnimatedCard delay={600}>
          <GlassCard style={[styles.insightCard, { marginBottom: APP_CONFIG.spacing['8'] }]}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.1)', 'rgba(99, 102, 241, 0.1)']}
              style={styles.insightGradient}
            />
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>💡</Text>
              <Text style={styles.insightTitle}>AI 인사이트</Text>
            </View>
            <Text style={styles.insightText}>
              {emotionStats && emotionStats.totalRecords > 0 ? (
                emotionStats.positiveRatio >= 60 
                  ? `정말 좋은 감정 상태를 유지하고 계시네요! 긍정적인 감정이 ${emotionStats.positiveRatio}%를 차지하고 있어요.`
                  : '감정을 기록하는 습관이 자리잡고 있어요. 계속해서 마음의 변화를 관찰해보세요.'
              ) : (
                '감정을 기록하기 시작하면 놀라운 패턴들을 발견하게 될 거예요!'
              )}
            </Text>
          </GlassCard>
        </AnimatedCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    marginTop: APP_CONFIG.spacing['4'],
  },
  
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: -1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: APP_CONFIG.spacing['4'],
    paddingBottom: APP_CONFIG.spacing['8'],
  },
  
  // 헤더
  headerSection: {
    marginBottom: APP_CONFIG.spacing['6'],
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['6'],
  },
  
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: APP_CONFIG.borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_CONFIG.spacing['4'],
    ...APP_CONFIG.shadows.lg,
  },
  
  headerEmoji: {
    fontSize: 28,
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: APP_CONFIG.fonts.sizes['3xl'],
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  headerSubtitle: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
  },
  
  // 글래스 카드
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: APP_CONFIG.borderRadius['2xl'],
    padding: APP_CONFIG.spacing['6'],
    marginBottom: APP_CONFIG.spacing['4'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...APP_CONFIG.shadows.lg,
    overflow: 'hidden',
  },
  
  cardTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['2'],
  },
  
  cardSubtitle: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  // 통계 카드
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['2'],
  },
  
  statIcon: {
    fontSize: 20,
  },
  
  statValue: {
    fontSize: APP_CONFIG.fonts.sizes.xl,
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  statLabel: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
  },
  
  // 차트 카드
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: APP_CONFIG.borderRadius.lg,
  },
  
  chart: {
    borderRadius: APP_CONFIG.borderRadius.lg,
  },
  
  // 트렌드 카드
  trendCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  trendList: {
    gap: APP_CONFIG.spacing['3'],
  },
  
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: APP_CONFIG.spacing['4'],
    borderRadius: APP_CONFIG.borderRadius.lg,
    position: 'relative',
  },
  
  topTrendItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 2,
    borderColor: APP_CONFIG.colors.primary,
  },
  
  trendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  trendEmoji: {
    fontSize: 24,
    marginRight: APP_CONFIG.spacing['3'],
  },
  
  trendInfo: {
    flex: 1,
  },
  
  trendEmotion: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  trendCount: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
  },
  
  trendRight: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  
  trendPercentage: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.bold,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  trendBar: {
    width: 50,
    height: 4,
    backgroundColor: APP_CONFIG.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  trendBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  topBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: APP_CONFIG.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  
  topBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // 빈 상태
  emptyCard: {
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['8'],
  },
  
  emptyEmoji: {
    fontSize: 64,
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  emptyTitle: {
    fontSize: APP_CONFIG.fonts.sizes.xl,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['2'],
    textAlign: 'center',
  },
  
  emptyText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: APP_CONFIG.spacing['6'],
  },
  
  emptyButton: {
    borderRadius: APP_CONFIG.borderRadius.xl,
    overflow: 'hidden',
    ...APP_CONFIG.shadows.md,
  },
  
  emptyButtonGradient: {
    paddingVertical: APP_CONFIG.spacing['3'],
    paddingHorizontal: APP_CONFIG.spacing['6'],
    alignItems: 'center',
  },
  
  emptyButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.textInverse,
  },
  
  // 인사이트 카드
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'relative',
  },
  
  insightGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: APP_CONFIG.borderRadius['2xl'],
  },
  
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['3'],
  },
  
  insightIcon: {
    fontSize: 24,
    marginRight: APP_CONFIG.spacing['2'],
  },
  
  insightTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
  },
  
  insightText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default InsightsScreen;