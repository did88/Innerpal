import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { emotionAnalyzer } from '../utils/emotionAnalyzer';

const EmotionCard = ({ emotion, score, onPress, style }) => {
  const percentage = Math.round(score * 100);
  const emoji = emotionAnalyzer.getEmotionEmoji(emotion);
  const color = emotionAnalyzer.getEmotionColor(emotion);
  
  const emotionNames = {
    joy: '기쁨',
    sadness: '슬픔',
    anger: '분노',
    fear: '불안',
    surprise: '놀람',
    disgust: '혐오',
    neutral: '평온'
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
        
        <Text style={styles.emotionName}>{emotionNames[emotion]}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${percentage}%`, backgroundColor: color }
              ]} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    width: '100%',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  emotionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default EmotionCard;