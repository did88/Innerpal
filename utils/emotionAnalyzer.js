import { EMOTION_CONFIG, RECOMMENDATIONS } from './emotionConstants';

// 핵심 감정 분석 클래스
export class EmotionAnalyzer {
  constructor() {
    this.emotionHistory = [];
  }

  // 텍스트 감정 분석
  analyzeText(text) {
    const emotions = {};
    
    // 기본 감정 점수 계산
    for (const [emotion, keywords] of Object.entries(EMOTION_CONFIG.KEYWORDS)) {
      emotions[emotion] = 0;
      keywords.forEach(keyword => {
        const matches = text.toLowerCase().match(new RegExp(keyword, 'g'));
        if (matches) emotions[emotion] += matches.length;
      });
    }

    // 문맥 가중치 적용
    this.applyContextWeights(emotions, text);
    
    // 정규화
    return this.normalizeEmotions(emotions);
  }

  // 문맥 가중치 적용
  applyContextWeights(emotions, text) {
    for (const [context, weight] of Object.entries(EMOTION_CONFIG.CONTEXT_MODIFIERS)) {
      if (text.toLowerCase().includes(context)) {
        Object.keys(emotions).forEach(emotion => {
          emotions[emotion] *= weight;
        });
      }
    }
  }

  // 감정 정규화
  normalizeEmotions(emotions) {
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(emotions).forEach(emotion => {
        emotions[emotion] = emotions[emotion] / total;
      });
    }
    return emotions;
  }

  // 데이터 저장
  saveEmotionData(emotions, context = '') {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = this.emotionHistory.findIndex(item => item.date === today);
    
    const emotionData = {
      date: today,
      emotions: emotions,
      context: context,
      timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.emotionHistory[existingIndex] = emotionData;
    } else {
      this.emotionHistory.push(emotionData);
    }

    // 최근 30일만 유지
    if (this.emotionHistory.length > 30) {
      this.emotionHistory = this.emotionHistory.slice(-30);
    }
  }

  // 리포트 생성
  generateEmotionReport() {
    if (this.emotionHistory.length === 0) return null;

    const recentWeek = this.emotionHistory.slice(-7);
    const avgEmotions = this.calculateAverageEmotions(recentWeek);
    
    const dominantEmotion = Object.keys(avgEmotions).reduce((a, b) => 
      avgEmotions[a] > avgEmotions[b] ? a : b
    );

    const emotionScore = this.calculateEmotionScore(avgEmotions);

    return {
      dominantEmotion,
      emotionScore,
      avgEmotions,
      trends: this.analyzeEmotionPattern(),
      recommendations: this.generateRecommendations(avgEmotions)
    };
  }

  // 평균 감정 계산
  calculateAverageEmotions(data) {
    const avgEmotions = {};
    Object.keys(EMOTION_CONFIG.KEYWORDS).forEach(emotion => {
      const values = data.map(day => day.emotions[emotion] || 0);
      avgEmotions[emotion] = values.reduce((a, b) => a + b, 0) / values.length;
    });
    return avgEmotions;
  }

  // 감정 점수 계산
  calculateEmotionScore(emotions) {
    return Object.keys(emotions).reduce((score, emotion) => {
      return score + (emotions[emotion] * EMOTION_CONFIG.WEIGHTS[emotion]);
    }, 0);
  }

  // 트렌드 분석
  analyzeEmotionPattern() {
    if (this.emotionHistory.length < 5) return null;

    const recent = this.emotionHistory.slice(-7);
    const trends = {};
    
    Object.keys(EMOTION_CONFIG.KEYWORDS).forEach(emotion => {
      const values = recent.map(day => day.emotions[emotion] || 0);
      trends[emotion] = this.calculateTrend(values);
    });

    return trends;
  }

  // 선형 회귀 트렌드 계산
  calculateTrend(values) {
    const n = values.length;
    const x = Array.from({length: n}, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  // 추천사항 생성
  generateRecommendations(emotions) {
    const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
      emotions[a] > emotions[b] ? a : b
    );
    return RECOMMENDATIONS[dominantEmotion] || RECOMMENDATIONS.neutral;
  }
}

// 전역 인스턴스 생성
export const emotionAnalyzer = new EmotionAnalyzer();
