import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../lib/supabase';
import openAIService from '../services/openai';

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
  },
  emotions: [
    { key: 'joy', label: '기쁨', emoji: '😊', color: '#48BB78' },
    { key: 'sadness', label: '슬픔', emoji: '😢', color: '#4299E1' },
    { key: 'anger', label: '분노', emoji: '😠', color: '#F56565' },
    { key: 'fear', label: '불안', emoji: '😰', color: '#ED8936' },
    { key: 'surprise', label: '놀람', emoji: '😮', color: '#A78BFA' },
    { key: 'disgust', label: '혐오', emoji: '😤', color: '#38B2AC' },
    { key: 'neutral', label: '평온', emoji: '😐', color: '#718096' },
  ]
};

const EmotionCard = ({ emotion, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.emotionCard,
      isSelected && { backgroundColor: emotion.color + '20', borderColor: emotion.color }
    ]}
    onPress={() => onPress(emotion)}
    activeOpacity={0.7}
  >
    <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
    <Text style={[
      styles.emotionLabel,
      isSelected && { color: emotion.color, fontWeight: '600' }
    ]}>
      {emotion.label}
    </Text>
  </TouchableOpacity>
);

const IntensitySelector = ({ intensity, onIntensityChange, emotionColor }) => (
  <View style={styles.intensityContainer}>
    <Text style={styles.sectionTitle}>감정 강도</Text>
    <View style={styles.intensityScale}>
      {[1, 2, 3, 4, 5].map(level => (
        <TouchableOpacity
          key={level}
          style={[
            styles.intensityButton,
            level <= intensity && {
              backgroundColor: emotionColor || APP_CONFIG.colors.primary
            }
          ]}
          onPress={() => onIntensityChange(level)}
        >
          <Text style={[
            styles.intensityText,
            level <= intensity && { color: 'white' }
          ]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.intensityLabels}>
      <Text style={styles.intensityLabel}>약함</Text>
      <Text style={styles.intensityLabel}>강함</Text>
    </View>
  </View>
);

const SituationTags = ({ selectedTags, onTagToggle }) => {
  const commonSituations = [
    '직장', '가족', '친구', '연인', '건강', '돈', '취업',
    '학교', '집', '여행', '운동', '음식', '날씨', '뉴스',
    '미래', '과거', '꿈', '기타'
  ];

  return (
    <View style={styles.tagsContainer}>
      <Text style={styles.sectionTitle}>관련 상황 (선택사항)</Text>
      <View style={styles.tagsGrid}>
        {Array.isArray(commonSituations) && commonSituations.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.situationTag,
              selectedTags.includes(tag) && styles.selectedTag
            ]}
            onPress={() => onTagToggle(tag)}
          >
            <Text style={[
              styles.tagText,
              selectedTags.includes(tag) && styles.selectedTagText
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// 나머지 EmotionInputScreen 컴포넌트 정의는 그대로 유지됩니다

export default EmotionInputScreen;
