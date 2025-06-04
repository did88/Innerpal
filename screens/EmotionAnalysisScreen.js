import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { emotionAnalyzer } from '../utils/emotionAnalyzer';
import { EMOTION_CONFIG, QUICK_PROMPTS } from '../utils/emotionConstants';
import { database } from '../lib/supabase';

const { width } = Dimensions.get('window');

const EmotionAnalysisScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const analyzeEmotion = () => {
    if (!inputText.trim()) {
      Alert.alert('알림', '감정을 표현하는 텍스트를 입력해주세요.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const result = await emotionAnalyzer.analyzeText(inputText);
      if (!result) {
        setLoading(false);
        Alert.alert('오류', '감정 분석에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      try {
        await database.createEmotion({
          emotion_text: inputText,
          primary_emotion: result.dominantEmotion,
          intensity: result.emotionScore,
          ai_analysis: result.emotions,
        });
      } catch (err) {
        console.warn('Emotion save error:', err);
      }

      emotionAnalyzer.saveEmotionData(result.emotions, inputText);

      setAnalysisResult(result);

      setLoading(false);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);
  };

  const useQuickPrompt = () => {
    const randomPrompt = QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)];
    Alert.prompt(
      '빠른 감정 체크',
      randomPrompt,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '분석하기',
          onPress: (text) => {
            if (text) {
              setInputText(text);
              setTimeout(analyzeEmotion, 100);
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const getEmotionColor = (score) => {
    if (score > 0.5) return '#10B981';
    if (score < -0.5) return '#EF4444';
    return '#6B7280';
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      joy: '😊', sadness: '😢', anger: '😠',
      fear: '😰', surprise: '😲', disgust: '😖', neutral: '😐'
    };
    return emojis[emotion] || '😐';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.1)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🧠 감정 분석</Text>
          <Text style={styles.subtitle}>당신의 마음을 이해해보세요</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>오늘 기분이 어떠신가요? 자유롭게 표현해주세요</Text>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="예: 오늘 정말 행복한 일이 있었어요..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{inputText.length}/500</Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.quickButton} onPress={useQuickPrompt}>
            <Text style={styles.quickButtonText}>🎲 빠른 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.analyzeButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={analyzeEmotion}
            disabled={loading}
          >
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.buttonGradient}
            >
              <Text style={styles.analyzeButtonText}>
                {loading ? '분석 중...' : '💡 감정 분석하기'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {analysisResult && (
          <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>📊 분석 결과</Text>
              <Text style={[styles.emotionScore, { color: getEmotionColor(analysisResult.emotionScore) }]}>
                점수: {(analysisResult.emotionScore * 100).toFixed(1)}
              </Text>
            </View>

            <View style={styles.dominantEmotion}>
              <Text style={styles.dominantEmoji}>
                {getEmotionEmoji(analysisResult.dominantEmotion)}
              </Text>
              <Text style={styles.dominantText}>
                주요 감정: {EMOTION_CONFIG.NAMES[analysisResult.dominantEmotion]}
              </Text>
            </View>

            <View style={styles.emotionDistribution}>
              <Text style={styles.distributionTitle}>감정 분포</Text>
              {Object.entries(analysisResult.emotions)
                .filter(([_, value]) => value > 0.1)
                .sort(([, a], [, b]) => b - a)
                .map(([emotion, value]) => (
                  <View key={emotion} style={styles.emotionBar}>
                    <Text style={styles.emotionLabel}>
                      {getEmotionEmoji(emotion)} {EMOTION_CONFIG.NAMES[emotion]}
                    </Text>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { width: `${value * 100}%` }]} />
                    </View>
                    <Text style={styles.emotionValue}>{(value * 100).toFixed(0)}%</Text>
                  </View>
                ))}
            </View>

            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>💡 추천사항</Text>
              {Array.isArray(analysisResult.recommendations) &&
                analysisResult.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationNumber}>{index + 1}</Text>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
            </View>

            <TouchableOpacity
              style={styles.viewResultButton}
              onPress={() => navigation.navigate('EmotionResultScreen', { result: analysisResult })}
            >
              <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                style={styles.buttonGradient}
              >
                <Text style={styles.viewResultText}>📈 시각화 보기</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFCF0' },
  headerGradient: { paddingTop: 60, paddingBottom: 20 },
  header: { alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  inputSection: { marginBottom: 24 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  textInput: {
    backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 16,
    minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E5E7EB'
  },
  charCount: { textAlign: 'right', fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  buttonSection: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, alignItems: 'center' },
  quickButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  analyzeButton: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  buttonGradient: { padding: 16, alignItems: 'center' },
  analyzeButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
  resultSection: {
    backgroundColor: 'white', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  emotionScore: { fontSize: 16, fontWeight: '600' },
  dominantEmotion: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12
  },
  dominantEmoji: { fontSize: 32, marginRight: 12 },
  dominantText: { fontSize: 18, fontWeight: '600', color: '#374151' },
  emotionDistribution: { marginBottom: 24 },
  distributionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  emotionBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  emotionLabel: { width: 80, fontSize: 14, color: '#6B7280' },
  barContainer: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginHorizontal: 8 },
  bar: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 4 },
  emotionValue: { width: 40, textAlign: 'right', fontSize: 12, color: '#6B7280' },
  recommendations: { marginTop: 8 },
  recommendationsTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  recommendationItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  recommendationNumber: {
    width: 20, height: 20, backgroundColor: '#7C3AED', color: 'white',
    textAlign: 'center', borderRadius: 10, fontSize: 12, fontWeight: '600',
    marginRight: 12, lineHeight: 20
  },
  recommendationText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 20 },
  viewResultButton: { marginTop: 16, borderRadius: 12, overflow: 'hidden' },
  viewResultText: { fontSize: 16, fontWeight: '600', color: 'white' }
});

export default EmotionAnalysisScreen;