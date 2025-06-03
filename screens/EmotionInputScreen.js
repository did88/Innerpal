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

// 감정 선택 카드 컴포넌트
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

// 강도 선택 컴포넌트
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

// 상황 태그 컴포넌트
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
        {commonSituations.map(tag => (
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

const EmotionInputScreen = () => {
  const navigation = useNavigation();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [emotionText, setEmotionText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textInputRef = useRef();

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  // 태그 토글 핸들러
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 감정 기록 저장
  const handleSubmit = async () => {
    if (!selectedEmotion) {
      Alert.alert('알림', '감정을 선택해주세요.');
      return;
    }

    if (!emotionText.trim()) {
      Alert.alert('알림', '감정에 대해 간단히 적어주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 여기서 Supabase에 감정 데이터 저장
      const emotionData = {
        emotion_text: emotionText.trim(),
        primary_emotion: selectedEmotion.key,
        intensity: intensity,
        emotion_tags: selectedTags,
        created_at: new Date().toISOString(),
      };

      console.log('감정 데이터 저장:', emotionData);
      
      // 성공 알림
      Alert.alert(
        '감정 기록 완료! 🎉',
        'Inner Talk에서 AI와 더 깊은 대화를 나눠보세요.',
        [
          { text: '홈으로', onPress: () => navigation.navigate('Home') },
          { 
            text: 'Inner Talk 시작', 
            onPress: () => navigation.navigate('InnerTalk', { 
              initialEmotion: emotionData 
            })
          }
        ]
      );

      // 폼 리셋
      setSelectedEmotion(null);
      setIntensity(3);
      setEmotionText('');
      setSelectedTags([]);

    } catch (error) {
      console.error('감정 저장 오류:', error);
      Alert.alert('오류', '감정을 저장하는 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>오늘의 감정 기록</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 감정 선택 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 느끼는 감정을 선택해주세요</Text>
          <View style={styles.emotionsGrid}>
            {APP_CONFIG.emotions.map(emotion => (
              <EmotionCard
                key={emotion.key}
                emotion={emotion}
                isSelected={selectedEmotion?.key === emotion.key}
                onPress={handleEmotionSelect}
              />
            ))}
          </View>
        </View>

        {/* 감정 강도 선택 */}
        {selectedEmotion && (
          <View style={styles.section}>
            <IntensitySelector
              intensity={intensity}
              onIntensityChange={setIntensity}
              emotionColor={selectedEmotion.color}
            />
          </View>
        )}

        {/* 감정 설명 입력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            어떤 일이 있었나요? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            value={emotionText}
            onChangeText={setEmotionText}
            placeholder="오늘 있었던 일이나 지금 느끼는 감정을 자유롭게 적어주세요. 
예: 오늘 회사에서 프레젠테이션을 성공적으로 마쳤어요. 정말 뿌듯하고 기뻐요!"
            placeholderTextColor={APP_CONFIG.colors.textMuted}
            multiline={true}
            numberOfLines={6}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {emotionText.length} / 1000
          </Text>
        </View>

        {/* 상황 태그 선택 */}
        <View style={styles.section}>
          <SituationTags
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </View>

        {/* 제출 버튼 */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedEmotion || !emotionText.trim() || isSubmitting) && 
              styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedEmotion || !emotionText.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>감정 기록하기</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.privacyNote}>
            🔒 당신의 감정은 안전하게 보호됩니다
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: APP_CONFIG.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_CONFIG.colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: APP_CONFIG.colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
  },
  placeholder: {
    width: 60,
  },

  // 스크롤 뷰
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // 섹션
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 16,
  },
  required: {
    color: '#F56565',
  },

  // 감정 카드
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emotionCard: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: APP_CONFIG.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_CONFIG.colors.text,
  },

  // 강도 선택
  intensityContainer: {
    alignItems: 'center',
  },
  intensityScale: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  intensityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: APP_CONFIG.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  intensityText: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.textLight,
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  intensityLabel: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
  },

  // 텍스트 입력
  textInput: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    minHeight: 120,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: APP_CONFIG.colors.textMuted,
    marginTop: 8,
  },

  // 태그
  tagsContainer: {
    marginTop: 8,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  situationTag: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
  },
  selectedTag: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderColor: APP_CONFIG.colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: APP_CONFIG.colors.text,
  },
  selectedTagText: {
    color: 'white',
    fontWeight: '500',
  },

  // 제출 버튼
  submitContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  submitButton: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: APP_CONFIG.colors.border,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  privacyNote: {
    textAlign: 'center',
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    marginTop: 16,
  },
});

export default EmotionInputScreen;