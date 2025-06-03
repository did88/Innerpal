import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const APP_CONFIG = {
  colors: {
    background: '#FEFCF0',
    primary: '#4A5568',
    secondary: '#A78BFA',
    textLight: '#718096',
    text: '#2D3748',
    border: '#E2E8F0',
    textMuted: '#A0AEC0',
    success: '#48BB78',
    surface: '#FFFFFF',
    accent: '#F6E05E',
    warning: '#ED8936',
  }
};

// 인사이트 카드 컴포넌트
const InsightCard = ({ insight, index }) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return APP_CONFIG.colors.success;
      case 'growth': return APP_CONFIG.colors.secondary;
      case 'awareness': return APP_CONFIG.colors.warning;
      default: return APP_CONFIG.colors.primary;
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return '🌟';
      case 'growth': return '🌱';
      case 'awareness': return '💡';
      default: return '✨';
    }
  };

  return (
    <Animated.View
      style={[
        styles.insightCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          borderLeftColor: getInsightColor(insight.type),
        },
      ]}
    >
      <View style={styles.insightHeader}>
        <Text style={styles.insightIcon}>{getInsightIcon(insight.type)}</Text>
        <Text style={[styles.insightTitle, { color: getInsightColor(insight.type) }]}>
          {insight.title}
        </Text>
      </View>
      <Text style={styles.insightContent}>{insight.content}</Text>
      {insight.suggestion && (
        <View style={styles.suggestionContainer}>
          <Text style={styles.suggestionLabel}>💭 제안:</Text>
          <Text style={styles.suggestionText}>{insight.suggestion}</Text>
        </View>
      )}
    </Animated.View>
  );
};

// 답변 요약 컴포넌트
const AnswerSummary = ({ answers }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    { key: 'thoughts', title: '생각 인식', emoji: '💭', color: '#4299E1' },
    { key: 'evidence', title: '증거 탐색', emoji: '🔍', color: '#48BB78' },
    { key: 'alternatives', title: '대안적 사고', emoji: '💡', color: '#A78BFA' },
    { key: 'action', title: '행동 계획', emoji: '🎯', color: '#ED8936' },
  ];

  const getSectionAnswers = (sectionKey) => {
    return Object.entries(answers)
      .filter(([key]) => key.startsWith(sectionKey))
      .map(([key, value]) => ({
        questionNum: key.split('_')[1],
        answer: value
      }));
  };

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>📝 세션 요약</Text>
      {sections.map((section) => {
        const sectionAnswers = getSectionAnswers(section.key);
        const isExpanded = expandedSection === section.key;
        
        return (
          <View key={section.key} style={styles.summarySection}>
            <TouchableOpacity
              style={[styles.sectionHeader, { backgroundColor: section.color + '10' }]}
              onPress={() => setExpandedSection(isExpanded ? null : section.key)}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionEmoji}>{section.emoji}</Text>
                <Text style={[styles.sectionTitle, { color: section.color }]}>
                  {section.title}
                </Text>
              </View>
              <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.sectionContent}>
                {sectionAnswers.map((item) => (
                  <View key={item.questionNum} style={styles.answerItem}>
                    <Text style={styles.answerLabel}>질문 {item.questionNum}:</Text>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

// 성장 지표 컴포넌트
const GrowthMetrics = ({ beforeMood, afterMood }) => {
  const improvement = afterMood - beforeMood;
  const improvementPercentage = Math.abs(improvement / beforeMood * 100);

  return (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>📈 성장 지표</Text>
      
      <View style={styles.moodComparison}>
        <View style={styles.moodItem}>
          <Text style={styles.moodLabel}>시작 기분</Text>
          <View style={styles.moodScale}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <View
                key={level}
                style={[
                  styles.moodDot,
                  level <= beforeMood && { backgroundColor: APP_CONFIG.colors.warning }
                ]}
              />
            ))}
          </View>
          <Text style={styles.moodValue}>{beforeMood}/10</Text>
        </View>

        <View style={styles.moodArrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>

        <View style={styles.moodItem}>
          <Text style={styles.moodLabel}>현재 기분</Text>
          <View style={styles.moodScale}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <View
                key={level}
                style={[
                  styles.moodDot,
                  level <= afterMood && { backgroundColor: APP_CONFIG.colors.success }
                ]}
              />
            ))}
          </View>
          <Text style={styles.moodValue}>{afterMood}/10</Text>
        </View>
      </View>

      <View style={styles.improvementIndicator}>
        {improvement > 0 ? (
          <Text style={styles.improvementPositive}>
            ✨ {improvementPercentage.toFixed(0)}% 개선되었어요!
          </Text>
        ) : improvement < 0 ? (
          <Text style={styles.improvementNegative}>
            💙 힘든 감정도 괜찮아요. 함께 극복해나가요.
          </Text>
        ) : (
          <Text style={styles.improvementNeutral}>
            🌟 안정적인 마음 상태를 유지하고 계시네요.
          </Text>
        )}
      </View>
    </View>
  );
};

const CBTInsightsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { insights = [], answers = {}, emotionData } = route.params || {};

  // 기본 인사이트 생성 (파라미터로 받지 못한 경우)
  const defaultInsights = [
    {
      title: '자기 인식 향상',
      content: 'CBT 과정을 통해 자신의 생각 패턴을 객관적으로 바라보는 능력이 향상되었습니다.',
      type: 'positive',
      suggestion: '앞으로도 정기적으로 자신의 생각을 점검해보세요.'
    },
    {
      title: '균형잡힌 사고',
      content: '극단적인 생각보다는 다양한 관점에서 상황을 바라보려는 시도가 보입니다.',
      type: 'growth',
      suggestion: '어려운 상황에서도 대안적 관점을 찾는 연습을 계속해보세요.'
    },
    {
      title: '실행 의지',
      content: '문제 해결을 위한 구체적인 행동 계획을 세우려는 의지가 느껴집니다.',
      type: 'awareness',
      suggestion: '작은 행동부터 시작해서 점진적으로 확장해나가세요.'
    }
  ];

  const finalInsights = insights.length > 0 ? insights : defaultInsights;

  // 더미 데이터 (실제로는 세션 데이터에서 가져옴)
  const beforeMood = emotionData?.intensity || 3;
  const afterMood = Math.min(10, beforeMood + Math.floor(Math.random() * 3) + 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CBT 인사이트</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 완료 축하 메시지 */}
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>훌륭해요!</Text>
          <Text style={styles.celebrationMessage}>
            CBT 세션을 완주하셨습니다. 자신을 돌아보고 성장하려는 
            노력이 정말 대단해요.
          </Text>
        </View>

        {/* 성장 지표 */}
        <GrowthMetrics beforeMood={beforeMood} afterMood={afterMood} />

        {/* 개인화된 인사이트 */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>🌟 개인화된 인사이트</Text>
          {finalInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} index={index} />
          ))}
        </View>

        {/* 답변 요약 */}
        <AnswerSummary answers={answers} />

        {/* 추천 활동 */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>💡 추천 활동</Text>
          
          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => navigation.navigate('InnerTalk')}
          >
            <Text style={styles.recommendationEmoji}>💭</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Inner Talk 계속하기</Text>
              <Text style={styles.recommendationDescription}>
                AI와 더 깊은 대화를 나누며 감정을 탐색해보세요
              </Text>
            </View>
            <Text style={styles.recommendationArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => navigation.navigate('EmotionInput')}
          >
            <Text style={styles.recommendationEmoji}>📝</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>새로운 감정 기록</Text>
              <Text style={styles.recommendationDescription}>
                오늘의 다른 감정들도 기록해보세요
              </Text>
            </View>
            <Text style={styles.recommendationArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => navigation.navigate('Insights')}
          >
            <Text style={styles.recommendationEmoji}>📊</Text>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>감정 패턴 분석</Text>
              <Text style={styles.recommendationDescription}>
                지금까지의 감정 데이터를 분석해보세요
              </Text>
            </View>
            <Text style={styles.recommendationArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* 격려 메시지 */}
        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementTitle}>💙 기억하세요</Text>
          <Text style={styles.encouragementText}>
            감정을 이해하고 받아들이는 것은 용기가 필요한 일입니다. 
            오늘 자신을 돌아본 시간이 분명히 의미있는 변화의 시작이 될 거예요.
          </Text>
          <Text style={styles.encouragementSubtext}>
            언제든 다시 찾아와 주세요. Innerpal이 함께 하겠습니다.
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            // 세션 내용을 공유하거나 저장하는 기능
            // 추후 구현
            alert('세션 저장 기능을 준비 중입니다!');
          }}
        >
          <Text style={styles.secondaryButtonText}>📄 세션 저장</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.primaryButtonText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: APP_CONFIG.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_CONFIG.colors.border,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_CONFIG.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: APP_CONFIG.colors.textLight,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },

  // 콘텐츠
  content: {
    flex: 1,
  },

  // 축하 메시지
  celebrationContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: APP_CONFIG.colors.success + '10',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.success,
    marginBottom: 8,
  },
  celebrationMessage: {
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },

  // 성장 지표
  metricsContainer: {
    backgroundColor: APP_CONFIG.colors.surface,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 16,
  },
  moodComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    marginBottom: 8,
  },
  moodScale: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: APP_CONFIG.colors.border,
    marginHorizontal: 1,
  },
  moodValue: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
  },
  moodArrow: {
    paddingHorizontal: 16,
  },
  arrowText: {
    fontSize: 20,
    color: APP_CONFIG.colors.textLight,
  },
  improvementIndicator: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border,
  },
  improvementPositive: {
    fontSize: 16,
    fontWeight: '500',
    color: APP_CONFIG.colors.success,
  },
  improvementNegative: {
    fontSize: 16,
    fontWeight: '500',
    color: APP_CONFIG.colors.primary,
  },
  improvementNeutral: {
    fontSize: 16,
    fontWeight: '500',
    color: APP_CONFIG.colors.textLight,
  },

  // 섹션
  insightsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 16,
  },

  // 인사이트 카드
  insightCard: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  insightContent: {
    fontSize: 14,
    color: APP_CONFIG.colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  suggestionContainer: {
    backgroundColor: APP_CONFIG.colors.accent + '20',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 18,
  },

  // 답변 요약
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 16,
  },
  summarySection: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 12,
    color: APP_CONFIG.colors.textLight,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answerItem: {
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: APP_CONFIG.colors.textMuted,
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: APP_CONFIG.colors.text,
    lineHeight: 18,
  },

  // 추천 활동
  recommendationsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recommendationCard: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
  },
  recommendationArrow: {
    fontSize: 18,
    color: APP_CONFIG.colors.textMuted,
  },

  // 격려 메시지
  encouragementContainer: {
    backgroundColor: APP_CONFIG.colors.primary + '10',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.primary,
    marginBottom: 12,
  },
  encouragementText: {
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  encouragementSubtext: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    fontStyle: 'italic',
  },

  // 하단 버튼
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: APP_CONFIG.colors.surface,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: APP_CONFIG.colors.textLight,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: APP_CONFIG.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default CBTInsightsScreen;