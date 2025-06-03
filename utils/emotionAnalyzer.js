// GPT 기반 감정 분석기로 전환된 EmotionAnalyzer.js
import { getEmotionSummary } from '../services/openai';
import { RECOMMENDATIONS } from './emotionConstants';

export class EmotionAnalyzer {
  constructor() {
    this.emotionHistory = [];
  }

  async analyzeText(text) {
    const rawEmotions = await getEmotionSummary(text);
    if (!rawEmotions) return null;

    // 백분율 정규화 (총합 100 기준 → 0~1 스케일)
    const total = Object.values(rawEmotions).reduce((sum, val) => sum + val, 0);
    const normalizedEmotions = {};
    if (total === 0) {
      for (const key of Object.keys(rawEmotions)) {
        normalizedEmotions[key] = 0;
      }
    } else {
      for (const [key, value] of Object.entries(rawEmotions)) {
        normalizedEmotions[key] = value / total;
      }
    }

    const dominantEmotion = Object.keys(normalizedEmotions).reduce((a, b) =>
      normalizedEmotions[a] > normalizedEmotions[b] ? a : b
    );

    return {
      dominantEmotion,
      emotionScore: this.calculateEmotionScore(normalizedEmotions),
      emotions: normalizedEmotions,
      recommendations: this.generateRecommendations(normalizedEmotions)
    };
  }

  calculateEmotionScore(emotions) {
    const WEIGHTS = {
      joy: +1,
      sadness: -1,
      anger: -1,
      fear: -0.8,
      disgust: -0.9,
      surprise: 0,
      neutral: 0
    };
    return Object.entries(emotions).reduce((score, [emotion, value]) => {
      return score + value * (WEIGHTS[emotion] || 0);
    }, 0);
  }

  generateRecommendations(emotions) {
    const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
      emotions[a] > emotions[b] ? a : b
    );
    return RECOMMENDATIONS[dominantEmotion] || RECOMMENDATIONS.neutral;
  }

  saveEmotionData(emotions, context = '') {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = this.emotionHistory.findIndex(item => item.date === today);
    const emotionData = {
      date: today,
      emotions,
      context,
      timestamp: new Date().toISOString()
    };
    if (existingIndex >= 0) {
      this.emotionHistory[existingIndex] = emotionData;
    } else {
      this.emotionHistory.push(emotionData);
    }
    if (this.emotionHistory.length > 30) {
      this.emotionHistory = this.emotionHistory.slice(-30);
    }
  }

  generateEmotionReport() {
    if (this.emotionHistory.length === 0) return null;
    const recentWeek = this.emotionHistory.slice(-7);
    const avgEmotions = this.calculateAverageEmotions(recentWeek);
    const dominantEmotion = Object.keys(avgEmotions).reduce((a, b) =>
      avgEmotions[a] > avgEmotions[b] ? a : b
    );
    return {
      dominantEmotion,
      emotionScore: this.calculateEmotionScore(avgEmotions),
      avgEmotions,
      trends: this.analyzeEmotionPattern(),
      recommendations: this.generateRecommendations(avgEmotions)
    };
  }

  calculateAverageEmotions(data) {
    const avgEmotions = {};
    const keys = Object.keys(data[0]?.emotions || {});
    keys.forEach(emotion => {
      const values = data.map(day => day.emotions[emotion] || 0);
      avgEmotions[emotion] = values.reduce((a, b) => a + b, 0) / values.length;
    });
    return avgEmotions;
  }

  analyzeEmotionPattern() {
    if (this.emotionHistory.length < 5) return null;
    const recent = this.emotionHistory.slice(-7);
    const trends = {};
    const keys = Object.keys(recent[0]?.emotions || {});
    keys.forEach(emotion => {
      const values = recent.map(day => day.emotions[emotion] || 0);
      trends[emotion] = this.calculateTrend(values);
    });
    return trends;
  }

  calculateTrend(values) {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }
}

export const emotionAnalyzer = new EmotionAnalyzer();