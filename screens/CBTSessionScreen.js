import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

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

// CBT 질문 시퀀스 데이터
const CBT_SEQUENCES = {
  thoughts: {
    title: '생각 인식하기',
    description: '그 순간 떠오른 생각들을 살펴봅시다',
    color: '#4299E1',
    emoji: '💭',
    questions: [
      {
        id: 1,
        question: '그 상황에서 가장 먼저 떠오른 생각은 무엇이었나요?',
        placeholder: '예: "나는 실패자야", "모든 게 잘못될 거야" 등',
        type: 'text'
      },
      {
        id: 2,
        question: '그 생각이 얼마나 강하게 느껴졌나요? (1-10)',
        placeholder: '1 (매우 약함) ~ 10 (매우 강함)',
        type: 'scale',
        min: 1,
        max: 10
      },
      {
        id: 3,
        question: '비슷한 생각을 자주 하시나요?',
        placeholder: '언제, 어떤 상황에서 그런 생각이 드는지 적어보세요',
        type: 'text'
      }
    ]
  },
  
  evidence: {
    title: '증거 탐색하기',
    description: '생각을 뒷받침하는 증거와 반박하는 증거를 찾아봅시다',
    color: '#48BB78',
    emoji: '🔍',
    questions: [
      {
        id: 1,
        question: '그 생각을 뒷받침하는 구체적인 증거가 있나요?',
        placeholder: '실제로 일어난 사실들을 객관적으로 적어보세요',
        type: 'text'
      },
      {
        id: 2,
        question: '그 생각과 반대되는 증거는 없을까요?',
        placeholder: '잘 해낸 일들, 긍정적인 피드백 등을 생각해보세요',
        type: 'text'
      },
      {
        id: 3,
        question: '친한 친구가 같은 상황이라면 뭐라고 조언해주시겠어요?',
        placeholder: '타인에게는 어떻게 말해줄지 생각해보세요',
        type: 'text'
      }
    ]
  },
  
  alternatives: {
    title: '대안적 사고',
    description: '다른 관점에서 상황을 바라봅시다',
    color: '#A78BFA',
    emoji: '💡',
    questions: [
      {
        id: 1,
        question: '이 상황을 다르게 해석할 수 있는 방법이 있을까요?',
        placeholder: '더 균형잡힌 시각으로 상황을 보면?',
        type: 'text'
      },
      {
        id: 2,
        question: '최악의 경우와 최고의 경우, 그리고 현실적인 경우는 각각 무엇일까요?',
        placeholder: '세 가지 시나리오를 생각해보세요',
        type: 'text'
      },
      {
        id: 3,
        question: '이 경험에서 배울 수 있는 것이 있다면 무엇일까요?',
        placeholder: '성장의 기회로 볼 수 있는 부분이 있나요?',
        type: 'text'
      }
    ]
  },
  
  action: {
    title: '행동 계획',
    description: '앞으로 어떻게 대처할지 계획해봅시다',
    color: '#ED8936',
    emoji: '🎯',
    questions: [
      {
        id: 1,
        question: '비슷한 상황이 다시 생긴다면 어떻게 대처하고 싶으신가요?',
        placeholder: '구체적인 대처 방법을 생각해보세요',
        type: 'text'
      },
      {
        id: 2,
        question: '지금 기분을 개선하기 위해 당장 할 수 있는 작은 행동이 있을까요?',
        placeholder: '산책, 깊은 호흡, 음악 듣기 등',
        type: 'text'
      },
      {
        id: 3,
        question: '이 과정을 통해 기분이 어떻게 변했나요? (1-10)',
        placeholder: '처음 기분과 지금 기분을 비교해보세요',
        type: 'scale',
        min: 1,
        max: 10
      }
    ]
  }
};

// 진행도 바 컴포넌트
const ProgressBar = ({ current, total, color }) => {
  const progress = current / total;
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{current} / {total}</Text>
    </View>
  );
};

// 척도 선택 컴포넌트
const ScaleSelector = ({ value, onChange, min = 1, max = 10, color }) => (
  <View style={styles.scaleContainer}>
    <View style={styles.scaleButtons}>
      {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(num => (
        <TouchableOpacity
          key={num}
          style={[
            styles.scaleButton,
            value === num && { backgroundColor: color }
          ]}
          onPress={() => onChange(num)}
        >
          <Text style={[
            styles.scaleButtonText,
            value === num && { color: 'white' }
          ]}>
            {num}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.scaleLabels}>
      <Text style={styles.scaleLabel}>낮음</Text>
      <Text style={styles.scaleLabel}>높음</Text>
    </View>
  </View>
);

const CBTSessionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { emotionData } = route.params || {};
  
  const [currentSequence, setCurrentSequence] = useState('thoughts');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const sequences = Object.keys(CBT_SEQUENCES);
  const currentSequenceData = CBT_SEQUENCES[currentSequence];
  const currentQuestion = currentSequenceData.questions[currentQuestionIndex];
  const totalProgress = sequences.indexOf(currentSequence) * currentSequenceData.questions.length + currentQuestionIndex + 1;
  const totalQuestions = Object.values(CBT_SEQUENCES).reduce((sum, seq) => sum + seq.questions.length, 0);

  // 답변 저장
  const saveAnswer = () => {
    const key = `${currentSequence}_${currentQuestion.id}`;
    setAnswers(prev => ({
      ...prev,
      [key]: currentAnswer
    }));
  };

  // 다음 질문으로 이동
  const handleNext = () => {
    if (!currentAnswer.trim() && currentQuestion.type === 'text') {
      Alert.alert('알림', '답변을 입력해주세요.');
      return;
    }

    if (currentQuestion.type === 'scale' && !currentAnswer) {
      Alert.alert('알림', '척도를 선택해주세요.');
      return;
    }

    saveAnswer();

    if (currentQuestionIndex < currentSequenceData.questions.length - 1) {
      // 같은 시퀀스 내 다음 질문
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 다음 시퀀스로
      const currentSeqIndex = sequences.indexOf(currentSequence);
      if (currentSeqIndex < sequences.length - 1) {
        setCurrentSequence(sequences[currentSeqIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        // 모든 질문 완료
        handleCompletion();
      }
    }
    
    setCurrentAnswer('');
  };

  // 이전 질문으로 이동
  const handlePrevious = () => {
    saveAnswer();

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      const currentSeqIndex = sequences.indexOf(currentSequence);
      if (currentSeqIndex > 0) {
        const prevSequence = sequences[currentSeqIndex - 1];
        setCurrentSequence(prevSequence);
        setCurrentQuestionIndex(CBT_SEQUENCES[prevSequence].questions.length - 1);
      }
    }
    
    // 이전 답변 불러오기
    const prevKey = `${currentSequence}_${currentQuestion.id}`;
    setCurrentAnswer(answers[prevKey] || '');
  };

  // CBT 세션 완료
  const handleCompletion = async () => {
    setIsCompleting(true);
    saveAnswer();

    try {
      // CBT 세션 데이터 저장
      const cbtData = {
        emotion_id: emotionData?.id,
        answers: answers,
        completed_at: new Date().toISOString(),
        session_type: 'full_cbt'
      };

      console.log('CBT 세션 데이터 저장:', cbtData);

      // 완료 인사이트 생성
      const insights = generateInsights(answers);

      Alert.alert(
        'CBT 세션 완료! 🎉',
        '인지행동치료 과정을 완주하셨습니다. 인사이트를 확인해보세요.',
        [
          { text: '홈으로', onPress: () => navigation.navigate('Home') },
          {
            text: '인사이트 보기',
            onPress: () => navigation.navigate('CBTInsights', { 
              insights, 
              answers,
              emotionData 
            })
          }
        ]
      );

    } catch (error) {
      console.error('CBT 세션 저장 오류:', error);
      Alert.alert('오류', 'CBT 세션을 저장하는 중 문제가 발생했습니다.');
    } finally {
      setIsCompleting(false);
    }
  };

  // 인사이트 생성 함수
  const generateInsights = (answers) => {
    const insights = [];
    
    // 생각 패턴 분석
    const thoughtAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith('thoughts_'))
      .map(([, value]) => value);
    
    if (thoughtAnswers.length > 0) {
      insights.push({
        title: '생각 패턴 인식',
        content: '부정적 자동사고를 인식하는 것이 치유의 첫 걸음입니다.',
        type: 'positive'
      });
    }

    // 증거 평가 분석
    const evidenceAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith('evidence_'))
      .map(([, value]) => value);
    
    if (evidenceAnswers.length > 0) {
      insights.push({
        title: '균형잡힌 사고',
        content: '객관적 증거를 통해 더 균형잡힌 관점을 갖게 되었습니다.',
        type: 'growth'
      });
    }

    return insights;
  };

  // 현재 답변에 따라 UI 업데이트
  useEffect(() => {
    const key = `${currentSequence}_${currentQuestion.id}`;
    const savedAnswer = answers[key];
    if (savedAnswer) {
      setCurrentAnswer(savedAnswer);
    }
  }, [currentSequence, currentQuestionIndex]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={() => {
            Alert.alert(
              '세션 종료',
              'CBT 세션을 중단하시겠습니까? 진행상황이 저장되지 않습니다.',
              [
                { text: '계속하기', style: 'cancel' },
                { text: '종료', style: 'destructive', onPress: () => navigation.goBack() }
              ]
            );
          }}
        >
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>CBT 가이드</Text>
          <Text style={styles.headerSubtitle}>인지행동치료</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* 진행도 */}
      <ProgressBar
        current={totalProgress}
        total={totalQuestions}
        color={currentSequenceData.color}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 현재 시퀀스 정보 */}
        <View style={[styles.sequenceHeader, { backgroundColor: currentSequenceData.color + '10' }]}>
          <Text style={styles.sequenceEmoji}>{currentSequenceData.emoji}</Text>
          <Text style={[styles.sequenceTitle, { color: currentSequenceData.color }]}>
            {currentSequenceData.title}
          </Text>
          <Text style={styles.sequenceDescription}>
            {currentSequenceData.description}
          </Text>
        </View>

        {/* 질문 */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            질문 {currentQuestionIndex + 1} / {currentSequenceData.questions.length}
          </Text>
          <Text style={styles.questionText}>
            {currentQuestion.question}
          </Text>

          {/* 답변 입력 */}
          {currentQuestion.type === 'text' ? (
            <TextInput
              style={styles.textInput}
              value={currentAnswer}
              onChangeText={setCurrentAnswer}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor={APP_CONFIG.colors.textMuted}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <ScaleSelector
              value={currentAnswer}
              onChange={setCurrentAnswer}
              min={currentQuestion.min}
              max={currentQuestion.max}
              color={currentSequenceData.color}
            />
          )}
        </View>

        {/* 도움말 */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>💡 팁</Text>
          <Text style={styles.helpText}>
            {currentSequence === 'thoughts' && '떠오른 생각을 그대로 적어보세요. 옳고 그름을 판단하지 마세요.'}
            {currentSequence === 'evidence' && '객관적인 사실과 주관적인 해석을 구분해보세요.'}
            {currentSequence === 'alternatives' && '다양한 관점에서 상황을 바라보는 연습을 해보세요.'}
            {currentSequence === 'action' && '실현 가능한 구체적인 행동 계획을 세워보세요.'}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            styles.previousButton,
            (currentSequence === 'thoughts' && currentQuestionIndex === 0) && styles.disabledButton
          ]}
          onPress={handlePrevious}
          disabled={currentSequence === 'thoughts' && currentQuestionIndex === 0}
        >
          <Text style={[
            styles.buttonText,
            (currentSequence === 'thoughts' && currentQuestionIndex === 0) && styles.disabledButtonText
          ]}>
            이전
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navigationButton,
            styles.nextButton,
            { backgroundColor: currentSequenceData.color },
            (!currentAnswer.trim() || isCompleting) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!currentAnswer.trim() || isCompleting}
        >
          {isCompleting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>
              {(currentSequence === 'action' && currentQuestionIndex === currentSequenceData.questions.length - 1) 
                ? '완료' : '다음'}
            </Text>
          )}
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
  exitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_CONFIG.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    color: APP_CONFIG.colors.textLight,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: APP_CONFIG.colors.textLight,
    marginTop: 2,
  },
  placeholder: {
    width: 32,
  },

  // 진행도
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: APP_CONFIG.colors.surface,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: APP_CONFIG.colors.border,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_CONFIG.colors.text,
  },

  // 콘텐츠
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // 시퀀스 헤더
  sequenceHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    marginVertical: 16,
    borderRadius: 16,
  },
  sequenceEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  sequenceTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sequenceDescription: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
  },

  // 질문
  questionContainer: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 12,
    color: APP_CONFIG.colors.textMuted,
    fontWeight: '500',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: APP_CONFIG.colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },

  // 텍스트 입력
  textInput: {
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    backgroundColor: APP_CONFIG.colors.background,
    minHeight: 100,
  },

  // 척도 선택
  scaleContainer: {
    alignItems: 'center',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  scaleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_CONFIG.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_CONFIG.colors.textLight,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  scaleLabel: {
    fontSize: 12,
    color: APP_CONFIG.colors.textMuted,
  },

  // 도움말
  helpContainer: {
    backgroundColor: APP_CONFIG.colors.accent + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 18,
  },

  // 버튼
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: APP_CONFIG.colors.surface,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  navigationButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    backgroundColor: APP_CONFIG.colors.border,
    marginRight: 12,
  },
  nextButton: {
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: APP_CONFIG.colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.colors.textLight,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabledButtonText: {
    color: APP_CONFIG.colors.textMuted,
  },
});

export default CBTSessionScreen;