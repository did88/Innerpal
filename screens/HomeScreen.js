import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_CONFIG, UI_PRESETS, EMOTION_CONFIG } from '../config/app';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 애니메이션 카드 컴포넌트
const AnimatedCard = ({ children, style, onPress, delay = 0 }) => {
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

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (onPress) onPress();
  };

  return (
    <Animated.View 
      style={[
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// 그라데이션 버튼 컴포넌트
const GradientButton = ({ title, emoji, colors, onPress, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientButton}
    >
      <Text style={styles.gradientButtonEmoji}>{emoji}</Text>
      <Text style={styles.gradientButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// 글래스 카드 컴포넌트
const GlassCard = ({ children, style, ...props }) => (
  <View style={[styles.glassCard, style]} {...props}>
    {children}
  </View>
);

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentTime] = useState(new Date());
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '좋은 아침이에요 🌅';
    if (hour < 18) return '좋은 오후에요 ☀️';
    return '좋은 저녁이에요 🌙';
  };

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'innerTalk':
        navigation.navigate('InnerTalk');
        break;
      case 'insights':
        navigation.navigate('Insights');
        break;
      case 'apiTest':
        navigation.navigate('ApiTest');
        break;
      case 'emergency':
        alert('🤗 응급 위로 기능을 준비 중입니다!');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* 헤더 그라데이션 배경 */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
        style={styles.headerGradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 모던 헤더 */}
        <AnimatedCard style={styles.headerSection} delay={0}>
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <LinearGradient
                colors={APP_CONFIG.colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.brandIcon}
              >
                <Text style={styles.brandEmoji}>💙</Text>
              </LinearGradient>
              <Text style={styles.brandText}>Innerpal</Text>
            </View>
            
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.subtitle}>오늘 마음은 어떠신가요?</Text>
            </View>
          </View>
        </AnimatedCard>
        
        {/* 퀵 액션 그리드 */}
        <View style={styles.quickActionsGrid}>
          <AnimatedCard delay={100}>
            <GradientButton
              title="Inner Talk"
              emoji="💭"
              colors={APP_CONFIG.colors.gradients.primary}
              onPress={() => handleQuickAction('innerTalk')}
              style={styles.quickActionLarge}
            />
          </AnimatedCard>
          
          <View style={styles.quickActionColumn}>
            <AnimatedCard delay={200}>
              <GradientButton
                title="감정 분석"
                emoji="📊"
                colors={APP_CONFIG.colors.gradients.cool}
                onPress={() => handleQuickAction('insights')}
                style={styles.quickActionSmall}
              />
            </AnimatedCard>
            
            <AnimatedCard delay={300}>
              <GradientButton
                title="응급 위로"
                emoji="🤗"
                colors={APP_CONFIG.colors.gradients.warm}
                onPress={() => handleQuickAction('emergency')}
                style={styles.quickActionSmall}
              />
            </AnimatedCard>
          </View>
        </View>
        
        {/* 피처드 카드 */}
        <AnimatedCard delay={400}>
          <GlassCard style={styles.featuredCard}>
            <View style={styles.featuredHeader}>
              <LinearGradient
                colors={['#F59E0B', '#EF4444']}
                style={styles.featuredIcon}
              >
                <Text style={styles.featuredEmoji}>🚀</Text>
              </LinearGradient>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>AI와 실시간 대화</Text>
                <Text style={styles.featuredSubtitle}>Inner Talk로 마음을 나눠보세요</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.featuredButton}
              onPress={() => handleQuickAction('innerTalk')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={APP_CONFIG.colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.featuredButtonGradient}
              >
                <Text style={styles.featuredButtonText}>지금 시작하기</Text>
                <Text style={styles.featuredButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </AnimatedCard>
        
        {/* 감정 상태 카드 */}
        <AnimatedCard delay={500}>
          <GlassCard style={styles.emotionCard}>
            <View style={styles.emotionHeader}>
              <Text style={styles.cardTitle}>💭 오늘의 감정</Text>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>전체보기</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.emotionGrid}>
              {EMOTION_CONFIG.categories.slice(0, 4).map((emotion, index) => (
                <TouchableOpacity 
                  key={emotion.id}
                  style={[styles.emotionItem, { backgroundColor: emotion.lightColor }]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                  <Text style={[styles.emotionName, { color: emotion.color }]}>
                    {emotion.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </AnimatedCard>
        
        {/* 인사이트 미니 카드 */}
        <View style={styles.miniCardsRow}>
          <AnimatedCard delay={600} style={styles.miniCardContainer}>
            <GlassCard style={styles.miniCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.miniCardIcon}
              >
                <Text style={styles.miniCardEmoji}>📈</Text>
              </LinearGradient>
              <Text style={styles.miniCardTitle}>성장 지수</Text>
              <Text style={styles.miniCardValue}>+12%</Text>
            </GlassCard>
          </AnimatedCard>
          
          <AnimatedCard delay={700} style={styles.miniCardContainer}>
            <GlassCard style={styles.miniCard}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.miniCardIcon}
              >
                <Text style={styles.miniCardEmoji}>🎯</Text>
              </LinearGradient>
              <Text style={styles.miniCardTitle}>목표 달성</Text>
              <Text style={styles.miniCardValue}>3/5</Text>
            </GlassCard>
          </AnimatedCard>
        </View>
        
        {/* 최근 활동 카드 */}
        <AnimatedCard delay={800}>
          <GlassCard style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.cardTitle}>📝 최근 활동</Text>
              <View style={styles.activityBadge}>
                <Text style={styles.activityBadgeText}>새로운</Text>
              </View>
            </View>
            
            <Text style={styles.activityText}>
              아직 감정 기록이 없어요.{'\n'}첫 번째 마음을 기록해보세요! ✨
            </Text>
            
            <TouchableOpacity 
              style={styles.activityButton}
              onPress={() => handleQuickAction('innerTalk')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={APP_CONFIG.colors.gradients.primary}
                style={styles.activityButtonGradient}
              >
                <Text style={styles.activityButtonText}>첫 기록 남기기</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </AnimatedCard>
        
        {/* 오늘의 팁 카드 */}
        <AnimatedCard delay={900}>
          <GlassCard style={[styles.tipCard, { marginBottom: APP_CONFIG.spacing['8'] }]}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(99, 102, 241, 0.1)']}
              style={styles.tipGradient}
            />
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>오늘의 마음 팁</Text>
            </View>
            <Text style={styles.tipText}>
              감정을 글로 표현하는 것만으로도{'\n'}마음의 정리와 치유 효과를 얻을 수 있어요.
            </Text>
          </GlassCard>
        </AnimatedCard>
        
        {/* 개발자 도구 (임시) */}
        <AnimatedCard delay={1000}>
          <TouchableOpacity 
            style={styles.devButton}
            onPress={() => handleQuickAction('apiTest')}
            activeOpacity={0.7}
          >
            <Text style={styles.devButtonText}>🔧 개발자 도구</Text>
          </TouchableOpacity>
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
  
  // 헤더 스타일
  headerSection: {
    marginBottom: APP_CONFIG.spacing['6'],
  },
  
  header: {
    paddingVertical: APP_CONFIG.spacing['6'],
  },
  
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: APP_CONFIG.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_CONFIG.spacing['3'],
    ...APP_CONFIG.shadows.md,
  },
  
  brandEmoji: {
    fontSize: 24,
  },
  
  brandText: {
    fontSize: APP_CONFIG.fonts.sizes['3xl'],
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
  },
  
  greetingContainer: {
    marginLeft: APP_CONFIG.spacing['1'],
  },
  
  greeting: {
    fontSize: APP_CONFIG.fonts.sizes.xl,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.textLight,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  subtitle: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textMuted,
  },
  
  // 퀵 액션 스타일
  quickActionsGrid: {
    flexDirection: 'row',
    marginBottom: APP_CONFIG.spacing['6'],
    gap: APP_CONFIG.spacing['3'],
  },
  
  quickActionLarge: {
    flex: 2,
  },
  
  quickActionColumn: {
    flex: 1,
    gap: APP_CONFIG.spacing['3'],
  },
  
  quickActionSmall: {
    flex: 1,
  },
  
  gradientButton: {
    borderRadius: APP_CONFIG.borderRadius['2xl'],
    padding: APP_CONFIG.spacing['4'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    ...APP_CONFIG.shadows.lg,
  },
  
  gradientButtonEmoji: {
    fontSize: 28,
    marginBottom: APP_CONFIG.spacing['2'],
  },
  
  gradientButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.textInverse,
    textAlign: 'center',
  },
  
  // 글래스 카드 스타일
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
  
  // 피처드 카드
  featuredCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: APP_CONFIG.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_CONFIG.spacing['4'],
    ...APP_CONFIG.shadows.md,
  },
  
  featuredEmoji: {
    fontSize: 24,
  },
  
  featuredContent: {
    flex: 1,
  },
  
  featuredTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  featuredSubtitle: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
  },
  
  featuredButton: {
    borderRadius: APP_CONFIG.borderRadius.xl,
    overflow: 'hidden',
    ...APP_CONFIG.shadows.md,
  },
  
  featuredButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: APP_CONFIG.spacing['3'],
    paddingHorizontal: APP_CONFIG.spacing['4'],
  },
  
  featuredButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.textInverse,
  },
  
  featuredButtonArrow: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    color: APP_CONFIG.colors.textInverse,
    fontWeight: APP_CONFIG.fonts.weights.bold,
  },
  
  // 감정 카드
  emotionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  
  emotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  cardTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
  },
  
  moreButton: {
    paddingVertical: APP_CONFIG.spacing['1'],
    paddingHorizontal: APP_CONFIG.spacing['3'],
    backgroundColor: APP_CONFIG.colors.primaryLight,
    borderRadius: APP_CONFIG.borderRadius.lg,
  },
  
  moreButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.primary,
  },
  
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_CONFIG.spacing['3'],
  },
  
  emotionItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['3'],
    paddingHorizontal: APP_CONFIG.spacing['2'],
    borderRadius: APP_CONFIG.borderRadius.lg,
    ...APP_CONFIG.shadows.sm,
  },
  
  emotionEmoji: {
    fontSize: 24,
    marginBottom: APP_CONFIG.spacing['1'],
  },
  
  emotionName: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    fontWeight: APP_CONFIG.fonts.weights.medium,
  },
  
  // 미니 카드 행
  miniCardsRow: {
    flexDirection: 'row',
    gap: APP_CONFIG.spacing['3'],
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  miniCardContainer: {
    flex: 1,
  },
  
  miniCard: {
    alignItems: 'center',
    paddingVertical: APP_CONFIG.spacing['4'],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 0,
  },
  
  miniCardIcon: {
    width: 40,
    height: 40,
    borderRadius: APP_CONFIG.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['2'],
    ...APP_CONFIG.shadows.sm,
  },
  
  miniCardEmoji: {
    fontSize: 18,
  },
  
  miniCardTitle: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.textLight,
    marginBottom: APP_CONFIG.spacing['1'],
    textAlign: 'center',
  },
  
  miniCardValue: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
  },
  
  // 활동 카드
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['3'],
  },
  
  activityBadge: {
    marginLeft: APP_CONFIG.spacing['2'],
    paddingVertical: APP_CONFIG.spacing['1'],
    paddingHorizontal: APP_CONFIG.spacing['2'],
    backgroundColor: APP_CONFIG.colors.accent,
    borderRadius: APP_CONFIG.borderRadius.base,
  },
  
  activityBadgeText: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.textInverse,
  },
  
  activityText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 24,
    marginBottom: APP_CONFIG.spacing['4'],
    textAlign: 'center',
  },
  
  activityButton: {
    borderRadius: APP_CONFIG.borderRadius.xl,
    overflow: 'hidden',
    alignSelf: 'center',
    ...APP_CONFIG.shadows.md,
  },
  
  activityButtonGradient: {
    paddingVertical: APP_CONFIG.spacing['3'],
    paddingHorizontal: APP_CONFIG.spacing['6'],
    alignItems: 'center',
  },
  
  activityButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    fontWeight: APP_CONFIG.fonts.weights.medium,
    color: APP_CONFIG.colors.textInverse,
  },
  
  // 팁 카드
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'relative',
  },
  
  tipGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: APP_CONFIG.borderRadius['2xl'],
  },
  
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_CONFIG.spacing['3'],
  },
  
  tipIcon: {
    fontSize: 24,
    marginRight: APP_CONFIG.spacing['2'],
  },
  
  tipTitle: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    color: APP_CONFIG.colors.text,
  },
  
  tipText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 24,
    textAlign: 'center',
  },
  
  // 개발자 버튼 (임시)
  devButton: {
    backgroundColor: APP_CONFIG.colors.textMuted,
    borderRadius: APP_CONFIG.borderRadius.lg,
    paddingVertical: APP_CONFIG.spacing['2'],
    paddingHorizontal: APP_CONFIG.spacing['4'],
    alignSelf: 'center',
    marginBottom: APP_CONFIG.spacing['4'],
  },
  
  devButtonText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textInverse,
    fontWeight: APP_CONFIG.fonts.weights.medium,
  },
});

export default HomeScreen;