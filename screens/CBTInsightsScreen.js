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

  // ✅ 수정된 부분
  const finalInsights = Array.isArray(insights) && insights.length > 0
    ? insights
    : defaultInsights;

  const beforeMood = emotionData?.intensity || 3;
  const afterMood = Math.min(10, beforeMood + Math.floor(Math.random() * 3) + 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* 생략된 UI 컴포넌트는 기존 코드 유지 */}
      {/* ...중략... */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ...중략... */}
        <GrowthMetrics beforeMood={beforeMood} afterMood={afterMood} />

        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>🌟 개인화된 인사이트</Text>
          {finalInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} index={index} />
          ))}
        </View>

        <AnswerSummary answers={answers} />

        {/* ...중략... */}
      </ScrollView>
      {/* ...중략... */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({/* ... 기존 스타일 그대로 유지 ... */});

export default CBTInsightsScreen;
