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
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          </View>
        </LinearGradient>
        
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
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
  },
  subtitle: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
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
  },
});

export default HomeScreen;
