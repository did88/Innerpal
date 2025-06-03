import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { emotionAnalyzer } from '../utils/emotionAnalyzer';

const WellbeingScore = ({ emotions, style }) => {
  const score = emotionAnalyzer.calculateWellbeingScore(emotions);
  
  const getScoreCategory = (score) => {
    if (score >= 70) return { label: '매우 좋음', emoji: '🌟', color: '#10B981' };
    if (score >= 30) return { label: '좋음', emoji: '😊', color: '#8B5CF6' };
    if (score >= -29) return { label: '보통', emoji: '😐', color: '#9CA3AF' };
    if (score >= -69) return { label: '주의', emoji: '😔', color: '#F59E0B' };
    return { label: '관리 필요', emoji: '😰', color: '#EF4444' };
  };

  const category = getScoreCategory(score);
  const normalizedScore = Math.max(0, Math.min(100, score + 100)) / 100; // -100~100 → 0~1

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>웰빙 지수</Text>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: category.color }]}>{score}</Text>
        <Text style={styles.category}>{category.label}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={score >= 0 ? ['#10B981', '#8B5CF6'] : ['#EF4444', '#F59E0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.progressBackground}
        >
          <View 
            style={[
              styles.progressIndicator, 
              { left: `${normalizedScore * 100}%` }
            ]} 
          />
        </LinearGradient>
        
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>-100</Text>
          <Text style={styles.scaleLabel}>0</Text>
          <Text style={styles.scaleLabel}>+100</Text>
        </View>
      </View>
      
      <Text style={styles.description}>
        {score >= 0 
          ? '긍정적인 감정 상태를 유지하고 있습니다' 
          : '감정 관리에 신경을 써보세요'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  emoji: {
    fontSize: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
  },
  progressIndicator: {
    position: 'absolute',
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#7C3AED',
    transform: [{ translateX: -6 }],
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WellbeingScore;