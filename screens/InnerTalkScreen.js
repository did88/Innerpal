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
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openAIService } from '../services/openai';
import { database, auth } from '../lib/supabase';
import { APP_CONFIG, EMOTION_CONFIG } from '../config/app';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 타이핑 애니메이션 컴포넌트
const TypingIndicator = () => {
  const [dotOpacity1] = useState(new Animated.Value(0.3));
  const [dotOpacity2] = useState(new Animated.Value(0.3));
  const [dotOpacity3] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animateTyping = () => {
      const sequence = Animated.sequence([
        Animated.timing(dotOpacity1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity1, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity2, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity3, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ]);
      Animated.loop(sequence).start();
    };
    animateTyping();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, { opacity: dotOpacity1 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dotOpacity2 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dotOpacity3 }]} />
      </View>
      <Text style={styles.typingText}>Innerpal이 마음을 읽고 있어요...</Text>
    </View>
  );
};

// 향상된 메시지 컴포넌트
const MessageBubble = ({ message, isUser, timestamp, emotion, fadeAnim }) => {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        { 
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim
        }
      ]}
    >
      {/* AI 메시지에 아바타 추가 */}
      {!isUser && (
        <LinearGradient
          colors={APP_CONFIG.colors.gradients.cool}
          style={styles.aiAvatar}
        >
          <Text style={styles.aiAvatarText}>🤖</Text>
        </LinearGradient>
      )}
      
      <View style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {message}
        </Text>
        
        {/* 감정 정보 표시 (AI 메시지만) */}
        {!isUser && emotion && (
          <View style={styles.emotionInfo}>
            <View style={styles.emotionInfoHeader}>
              <Text style={styles.emotionInfoEmoji}>
                {getEmotionEmoji(emotion.primary_emotion)}
              </Text>
              <Text style={[styles.emotionInfoText, { color: getEmotionColor(emotion.primary_emotion) }]}>
                {getEmotionKorean(emotion.primary_emotion)} · 강도 {emotion.intensity}/5
              </Text>
            </View>
            <View style={styles.intensityBar}>
              {[1, 2, 3, 4, 5].map(level => (
                <View
                  key={level}
                  style={[
                    styles.intensitySegment,
                    {
                      backgroundColor: level <= emotion.intensity 
                        ? getEmotionColor(emotion.primary_emotion)
                        : APP_CONFIG.colors.border
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        
        {timestamp && (
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {timestamp}
          </Text>
        )}
      </View>
      
      {/* 사용자 메시지에 아바타 추가 */}
      {isUser && (
        <LinearGradient
          colors={APP_CONFIG.colors.gradients.primary}
          style={styles.userAvatar}
        >
          <Text style={styles.userAvatarText}>😊</Text>
        </LinearGradient>
      )}
    </Animated.View>
  );
};

// 감정 상태 표시 컴포넌트 (향상된 버전)
const EmotionMood = ({ emotion, intensity }) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (emotion) {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]);
      Animated.loop(pulse, { iterations: 3 }).start();
    }
  }, [emotion]);

  if (!emotion) return null;

  const emotionConfig = EMOTION_CONFIG.categories.find(cat => 
    cat.name === emotion || cat.id === emotion
  ) || EMOTION_CONFIG.categories[6];

  return (
    <Animated.View style={[
      styles.emotionMoodContainer,
      { transform: [{ scale: pulseAnim }] }
    ]}>
      <LinearGradient
        colors={[emotionConfig.color + '20', emotionConfig.color + '10']}
        style={styles.emotionMoodCircle}
      >
        <Text style={styles.emotionMoodEmoji}>
          {emotionConfig.emoji}
        </Text>
      </LinearGradient>
      <View style={styles.emotionMoodInfo}>
        <Text style={styles.emotionMoodLabel}>현재 감정</Text>
        <Text style={[styles.emotionMoodText, { color: emotionConfig.color }]}>
          {emotionConfig.name}
        </Text>
        <View style={styles.intensityBar}>
          {[1, 2, 3, 4, 5].map(level => (
            <View
              key={level}
              style={[
                styles.intensitySegment,
                {
                  backgroundColor: level <= intensity 
                    ? emotionConfig.color 
                    : APP_CONFIG.colors.border
                }
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// 헬퍼 함수들
const getEmotionColor = (emotion) => {
  const emotionConfig = EMOTION_CONFIG.categories.find(cat => 
    cat.name === emotion || cat.id === emotion
  );
  return emotionConfig?.color || APP_CONFIG.colors.textMuted;
};

const getEmotionEmoji = (emotion) => {
  const emotionConfig = EMOTION_CONFIG.categories.find(cat => 
    cat.name === emotion || cat.id === emotion
  );
  return emotionConfig?.emoji || '😐';
};

const getEmotionKorean = (emotion) => {
  const emotionConfig = EMOTION_CONFIG.categories.find(cat => 
    cat.name === emotion || cat.id === emotion
  );
  return emotionConfig?.name || emotion;
};

const InnerTalkScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "안녕하세요! 저는 당신의 내면의 친구 Innerpal이에요. 🌟\n\n오늘 마음은 어떠신가요? 기쁜 일이든 힘든 일이든, 무엇이든 편하게 이야기해주세요. 함께 마음을 들여다보고 이해해봐요.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      emotion: null
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef();

  // 사용자 정보 로드
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const { user, error } = await auth.getCurrentUser();
      if (error) {
        // 익명 사용자로 설정
        setCurrentUser({ id: 'anonymous', isAnonymous: true });
      } else {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('사용자 정보 로드 오류:', error);
      setCurrentUser({ id: 'anonymous', isAnonymous: true });
    }
  };

  // 감정 데이터 저장
  const saveEmotionData = async (emotionText, analysisResult) => {
    if (!currentUser) return;

    try {
      const emotionData = {
        user_id: currentUser.id,
        emotion_text: emotionText,
        primary_emotion: analysisResult.emotion_analysis.primary_emotion,
        intensity: analysisResult.emotion_analysis.intensity,
        emotion_tags: analysisResult.emotion_analysis.keywords || [],
        gpt_response: analysisResult.empathy_response,
        cbt_conversation: {
          follow_up_questions: analysisResult.follow_up_questions,
          care_level: analysisResult.care_level,
          suggested_actions: analysisResult.suggested_actions
        },
        created_at: new Date().toISOString()
      };

      const { data, error } = await database.createEmotion(emotionData);
      
      if (error) {
        console.error('감정 데이터 저장 오류:', error);
        // 저장 실패해도 사용자 경험을 해치지 않음
      } else {
        console.log('감정 데이터 저장 성공:', data);
      }
    } catch (error) {
      console.error('감정 저장 중 오류:', error);
    }
  };

  // 실제 OpenAI API 호출 및 데이터 저장
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    const userMessage = {
      id: Date.now(),
      message: userMessageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    // 사용자 메시지 추가
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // 햅틱 피드백
    Vibration.vibrate(50);

    try {
      // 실제 OpenAI API 호출
      const result = await openAIService.analyzeEmotion(userMessageText);
      
      if (result.success) {
        // 감정 정보 업데이트
        const emotionData = {
          primary_emotion: result.analysis.emotion_analysis.primary_emotion,
          intensity: result.analysis.emotion_analysis.intensity
        };
        
        setCurrentEmotion(emotionData);

        // 감정 데이터를 Supabase에 저장
        await saveEmotionData(userMessageText, result.analysis);

        // AI 응답 메시지 추가
        const aiMessage = {
          id: Date.now() + 1,
          message: result.analysis.empathy_response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          emotion: emotionData
        };

        // 애니메이션과 함께 메시지 추가
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
          
          // 성공 알림 (선택적)
          if (!currentUser?.isAnonymous) {
            setTimeout(() => {
              Alert.alert(
                '💾 기록 완료', 
                '감정이 안전하게 저장되었어요!',
                [{ text: '확인', style: 'default' }]
              );
            }, 1000);
          }
        }, 1500); // 타이핑 효과를 위한 딜레이

      } else {
        throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
      }

    } catch (error) {
      console.error('OpenAI API 오류:', error);
      setIsLoading(false);
      
      // 오류 시 친근한 메시지
      const errorMessage = {
        id: Date.now() + 1,
        message: "죄송해요, 지금 제가 조금 바빠서 응답이 늦어지고 있어요. 😅 잠시 후에 다시 이야기해주실 수 있을까요?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      Alert.alert(
        '연결 오류',
        'AI 서버 연결에 문제가 있어요. 네트워크를 확인하고 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  // 스크롤을 아래로 이동
  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [messages]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* 향상된 헤더 */}
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
          style={styles.headerGradient}
        />
        
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={APP_CONFIG.colors.gradients.primary}
                style={styles.logoContainer}
              >
                <Text style={styles.logoEmoji}>💭</Text>
              </LinearGradient>
              <View>
                <Text style={styles.headerTitle}>Inner Talk</Text>
                <Text style={styles.headerSubtitle}>
                  AI 감정 동반자 {currentUser?.isAnonymous ? '(익명)' : ''}
                </Text>
              </View>
            </View>
            
            {/* 현재 감정 표시 */}
            {currentEmotion && (
              <EmotionMood 
                emotion={currentEmotion.primary_emotion} 
                intensity={currentEmotion.intensity} 
              />
            )}
          </View>
        </View>

        {/* 메시지 리스트 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.message}
              isUser={message.isUser}
              timestamp={message.timestamp}
              emotion={message.emotion}
              fadeAnim={fadeAnim}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
        </ScrollView>

        {/* 향상된 입력 영역 */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
          style={styles.inputGradient}
        />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="마음속 이야기를 들려주세요... 💫"
              placeholderTextColor={APP_CONFIG.colors.textMuted}
              multiline={true}
              maxLength={500}
              editable={!isLoading}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <LinearGradient
                colors={
                  !inputText.trim() || isLoading 
                    ? [APP_CONFIG.colors.border, APP_CONFIG.colors.textMuted]
                    : APP_CONFIG.colors.gradients.primary
                }
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? '💭' : '🚀'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.inputFooter}>
            <Text style={styles.inputHint}>
              {inputText.length}/500 • 솔직한 감정을 표현해보세요
            </Text>
            {currentUser?.isAnonymous && (
              <Text style={styles.anonymousHint}>
                🔒 익명으로 안전하게 보호됩니다
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  
  // 헤더 그라데이션
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: -1,
  },
  
  // 향상된 헤더 스타일
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    ...APP_CONFIG.shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...APP_CONFIG.shadows.md,
  },
  logoEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: APP_CONFIG.fonts.sizes.xl,
    fontWeight: APP_CONFIG.fonts.weights.bold,
    color: APP_CONFIG.colors.text,
  },
  headerSubtitle: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
    marginTop: 2,
  },
  
  // 감정 상태 표시
  emotionMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: APP_CONFIG.borderRadius.xl,
    ...APP_CONFIG.shadows.sm,
  },
  emotionMoodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  emotionMoodEmoji: {
    fontSize: 20,
  },
  emotionMoodInfo: {
    alignItems: 'flex-start',
  },
  emotionMoodLabel: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    color: APP_CONFIG.colors.textMuted,
    marginBottom: 2,
  },
  emotionMoodText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    fontWeight: APP_CONFIG.fonts.weights.semibold,
    marginBottom: 4,
  },
  intensityBar: {
    flexDirection: 'row',
  },
  intensitySegment: {
    width: 12,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
  
  // 메시지 관련 스타일
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  
  // 아바타 스타일
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
    ...APP_CONFIG.shadows.sm,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: 4,
    ...APP_CONFIG.shadows.sm,
  },
  userAvatarText: {
    fontSize: 16,
  },
  
  // 메시지 버블
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: APP_CONFIG.borderRadius.xl,
    ...APP_CONFIG.shadows.sm,
  },
  userMessage: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderBottomRightRadius: 6,
  },
  aiMessage: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    fontSize: APP_CONFIG.fonts.sizes.base,
    lineHeight: 22,
  },
  userMessageText: {
    color: APP_CONFIG.colors.textInverse,
  },
  aiMessageText: {
    color: APP_CONFIG.colors.text,
  },
  
  // 감정 정보
  emotionInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  emotionInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emotionInfoEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  emotionInfoText: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    fontWeight: APP_CONFIG.fonts.weights.medium,
  },
  
  timestamp: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: APP_CONFIG.colors.textMuted,
  },
  
  // 타이핑 인디케이터
  typingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: APP_CONFIG.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: APP_CONFIG.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
    ...APP_CONFIG.shadows.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: APP_CONFIG.colors.textLight,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
    color: APP_CONFIG.colors.textLight,
    fontStyle: 'italic',
  },
  
  // 입력 영역 그라데이션
  inputGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  
  // 향상된 입력 영역
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    ...APP_CONFIG.shadows.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    borderRadius: APP_CONFIG.borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: APP_CONFIG.fonts.sizes.base,
    color: APP_CONFIG.colors.text,
    backgroundColor: APP_CONFIG.colors.background,
    maxHeight: 100,
    ...APP_CONFIG.shadows.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    ...APP_CONFIG.shadows.md,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 18,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHint: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    color: APP_CONFIG.colors.textMuted,
    fontStyle: 'italic',
  },
  anonymousHint: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
    color: APP_CONFIG.colors.success,
    fontWeight: APP_CONFIG.fonts.weights.medium,
  },
});

export default InnerTalkScreen;