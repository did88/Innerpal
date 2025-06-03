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
<<<<<<< Updated upstream
import { useNavigation, useRoute } from '@react-navigation/native';
import { database } from '../lib/supabase';
import openAIService from '../services/openai';
=======
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openAIService } from '../services/openai';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    accent: '#F6E05E',
  }
};

const MessageBubble = ({ message, isUser, timestamp, emotion, showCBTSuggestion, onCBTStart }) => (
  <View style={[
    styles.messageContainer,
    isUser ? styles.userMessageContainer : styles.aiMessageContainer
  ]}>
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
      {timestamp && (
        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.aiTimestamp
        ]}>
          {timestamp}
        </Text>
      )}
      
      {showCBTSuggestion && !isUser && (
        <TouchableOpacity 
          style={styles.cbtSuggestionButton}
          onPress={onCBTStart}
        >
          <Text style={styles.cbtSuggestionText}>
            🧠 CBT 가이드 시작하기
          </Text>
        </TouchableOpacity>
      )}
    </View>
    
    {emotion && isUser && (
      <EmotionTag emotion={emotion.emotion} intensity={emotion.intensity} />
    )}
  </View>
);

const EmotionTag = ({ emotion, intensity }) => {
  const getEmotionColor = (emotion) => {
    const colors = {
      joy: '#48BB78', sadness: '#4299E1', anger: '#F56565',
      fear: '#ED8936', surprise: '#A78BFA', disgust: '#38B2AC',
      neutral: '#718096',
    };
    return colors[emotion] || colors.neutral;
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      joy: '😊', sadness: '😢', anger: '😠', 
      fear: '😰', surprise: '😮', disgust: '😤',
      neutral: '😐',
    };
    return emojis[emotion] || emojis.neutral;
  };
=======
    gradient: ['#667eea', '#764ba2'],
  }
};

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
>>>>>>> Stashed changes

  const getEmotionLabel = (emotion) => {
    const labels = {
      joy: '기쁨', sadness: '슬픔', anger: '분노',
      fear: '불안', surprise: '놀람', disgust: '혐오',
      neutral: '평온',
    };
    return labels[emotion] || labels.neutral;
  };

  return (
<<<<<<< Updated upstream
    <View style={[
      styles.emotionTag,
      { backgroundColor: getEmotionColor(emotion) + '20' }
    ]}>
      <Text style={styles.emotionEmoji}>{getEmotionEmoji(emotion)}</Text>
      <Text style={[styles.emotionText, { color: getEmotionColor(emotion) }]}>
        {getEmotionLabel(emotion)}
      </Text>
      <View style={styles.intensityDots}>
        {[1, 2, 3, 4, 5].map(level => (
          <View
            key={level}
            style={[
              styles.intensityDot,
              {
                backgroundColor: level <= intensity 
                  ? getEmotionColor(emotion) 
                  : APP_CONFIG.colors.border
              }
            ]}
          />
        ))}
=======
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, { opacity: dotOpacity1 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dotOpacity2 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dotOpacity3 }]} />
>>>>>>> Stashed changes
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
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>🤖</Text>
        </View>
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
            <Text style={styles.emotionInfoText}>
              감지된 감정: {getEmotionKorean(emotion.primary_emotion)} ({emotion.intensity}/5)
            </Text>
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
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>😊</Text>
        </View>
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

  return (
    <Animated.View style={[
      styles.emotionMoodContainer,
      { transform: [{ scale: pulseAnim }] }
    ]}>
      <View style={[
        styles.emotionMoodCircle,
        { backgroundColor: getEmotionColor(emotion) + '20' }
      ]}>
        <Text style={styles.emotionMoodEmoji}>
          {getEmotionEmoji(emotion)}
        </Text>
      </View>
      <View style={styles.emotionMoodInfo}>
        <Text style={styles.emotionMoodLabel}>현재 감정</Text>
        <Text style={[styles.emotionMoodText, { color: getEmotionColor(emotion) }]}>
          {getEmotionKorean(emotion)}
        </Text>
        <View style={styles.intensityBar}>
          {[1, 2, 3, 4, 5].map(level => (
            <View
              key={level}
              style={[
                styles.intensitySegment,
                {
                  backgroundColor: level <= intensity 
                    ? getEmotionColor(emotion) 
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
  const colors = {
    joy: '#48BB78', sadness: '#4299E1', anger: '#F56565',
    fear: '#ED8936', surprise: '#A78BFA', disgust: '#38B2AC',
    neutral: '#718096', 기쁨: '#48BB78', 슬픔: '#4299E1', 분노: '#F56565',
    불안: '#ED8936', 놀람: '#A78BFA', 혐오: '#38B2AC', 평온: '#718096'
  };
  return colors[emotion] || colors.neutral;
};

const getEmotionEmoji = (emotion) => {
  const emojis = {
    joy: '😊', sadness: '😢', anger: '😠', fear: '😰',
    surprise: '😮', disgust: '😤', neutral: '😐',
    기쁨: '😊', 슬픔: '😢', 분노: '😠', 불안: '😰',
    놀람: '😮', 혐오: '😤', 평온: '😐'
  };
  return emojis[emotion] || emojis.neutral;
};

const getEmotionKorean = (emotion) => {
  const korean = {
    joy: '기쁨', sadness: '슬픔', anger: '분노', fear: '불안',
    surprise: '놀람', disgust: '혐오', neutral: '평온'
  };
  return korean[emotion] || emotion;
};

const InnerTalkScreen = ({ navigation }) => {
<<<<<<< Updated upstream
  const route = useRoute();
  const { initialEmotion } = route.params || {};
  
=======
  const insets = useSafeAreaInsets();
>>>>>>> Stashed changes
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
<<<<<<< Updated upstream
      message: initialEmotion 
        ? `안녕하세요! 감정을 기록해주셨서 고마워요. ${initialEmotion.emotion_text}라고 하셨는데, 더 자세히 이야기해주실래요?`
        : "안녕하세요! 저는 당신의 내면의 친구 Innerpal이에요. 오늘 마음은 어떠신가요? 무엇이든 편하게 이야기해주세요.",
=======
      message: "안녕하세요! 저는 당신의 내면의 친구 Innerpal이에요. 🌟\n\n오늘 마음은 어떠신가요? 기쁜 일이든 힘든 일이든, 무엇이든 편하게 이야기해주세요. 함께 마음을 들여다보고 이해해봐요.",
>>>>>>> Stashed changes
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      emotion: null
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< Updated upstream
  const [currentEmotion, setCurrentEmotion] = useState(
    initialEmotion ? {
      emotion: initialEmotion.primary_emotion,
      intensity: initialEmotion.intensity
    } : null
  );
  const [conversationDepth, setConversationDepth] = useState(0);
  const scrollViewRef = useRef();

  const handleSendMessage = async (messageText = inputText.trim()) => {
    if (!messageText) return;
=======
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef();

  // 실제 OpenAI API 호출
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
>>>>>>> Stashed changes

    const userMessage = {
      id: Date.now(),
      message: messageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      emotion: currentEmotion
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

<<<<<<< Updated upstream
    try {
      const conversationHistory = messages.slice(-4);
      
      console.log('OpenAI API 호출 중...');
      const analysis = await openAIService.analyzeEmotion(messageText, {
        conversationHistory: conversationHistory
      });
      
      if (analysis.success) {
        setCurrentEmotion({
          emotion: analysis.analysis.emotion_analysis.primary_emotion,
          intensity: analysis.analysis.emotion_analysis.intensity
        });
      }

      setConversationDepth(prev => prev + 1);

      const aiMessage = {
        id: Date.now() + 1,
        message: analysis.success ? 
          analysis.analysis.empathy_response + 
          (analysis.analysis.follow_up_question ? "\n\n" + analysis.analysis.follow_up_question : "") :
          "죄송해요, 지금은 응답하기 어려워요. 다시 말해주실래요?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        showCBTSuggestion: analysis.success ? analysis.analysis.should_suggest_cbt : false
      };

      setMessages(prev => [...prev, aiMessage]);

      try {
        await database.createConversation({
          messages: [userMessage, aiMessage],
          emotion_context: currentEmotion,
          analysis_result: analysis.success ? analysis.analysis : null
        });
      } catch (saveError) {
        console.warn('대화 저장 실패:', saveError);
      }

    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      
      const fallbackMessage = {
        id: Date.now() + 1,
        message: "지금은 응답하기 어려워요. 하지만 당신의 마음을 이해하려고 노력하고 있어요.",
=======
    // 햅틱 피드백
    Vibration.vibrate(50);

    try {
      // 실제 OpenAI API 호출
      const result = await openAIService.analyzeEmotion(inputText.trim());
      
      if (result.success) {
        // 감정 정보 업데이트
        const emotionData = {
          primary_emotion: result.analysis.emotion_analysis.primary_emotion,
          intensity: result.analysis.emotion_analysis.intensity
        };
        
        setCurrentEmotion(emotionData);

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
>>>>>>> Stashed changes
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
<<<<<<< Updated upstream
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
=======
      setMessages(prev => [...prev, errorMessage]);
>>>>>>> Stashed changes
    }
  };

  const handleCBTStart = () => {
    const emotionData = {
      emotion_text: messages.filter(m => m.isUser).map(m => m.message).join(' '),
      primary_emotion: currentEmotion?.emotion,
      intensity: currentEmotion?.intensity
    };
    navigation.navigate('CBTSession', { emotionData });
  };

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
<<<<<<< Updated upstream
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inner Talk 💭</Text>
          <Text style={styles.headerSubtitle}>AI와 함께하는 감정 대화</Text>
          
          {currentEmotion && (
            <View style={styles.emotionDisplay}>
              <Text style={styles.emotionLabel}>현재 감정:</Text>
              <EmotionTag 
                emotion={currentEmotion.emotion} 
=======
        {/* 향상된 헤더 */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>💭</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Inner Talk</Text>
                <Text style={styles.headerSubtitle}>AI 감정 동반자</Text>
              </View>
            </View>
            
            {/* 현재 감정 표시 */}
            {currentEmotion && (
              <EmotionMood 
                emotion={currentEmotion.primary_emotion} 
>>>>>>> Stashed changes
                intensity={currentEmotion.intensity} 
              />
            )}
          </View>
        </View>

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
<<<<<<< Updated upstream
              showCBTSuggestion={message.showCBTSuggestion}
              onCBTStart={handleCBTStart}
            />
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={APP_CONFIG.colors.primary} />
              <Text style={styles.loadingText}>AI가 생각 중...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="감정이나 생각을 자유롭게 이야기해주세요..."
            placeholderTextColor={APP_CONFIG.colors.textMuted}
            multiline={true}
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
=======
              fadeAnim={fadeAnim}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
        </ScrollView>

        {/* 향상된 입력 영역 */}
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
              <Text style={styles.sendButtonText}>
                {isLoading ? '💭' : '🚀'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            {inputText.length}/500 • 솔직한 감정을 표현해보세요
          </Text>
>>>>>>> Stashed changes
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: { flex: 1, backgroundColor: APP_CONFIG.colors.background },
  header: {
    backgroundColor: APP_CONFIG.colors.surface,
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: APP_CONFIG.colors.border,
  },
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', color: APP_CONFIG.colors.text, textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14, color: APP_CONFIG.colors.textLight, textAlign: 'center', marginTop: 4,
  },
  emotionDisplay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12,
=======
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  
  // 향상된 헤더 스타일
  header: {
    backgroundColor: APP_CONFIG.colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: APP_CONFIG.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: APP_CONFIG.colors.primary + '20',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    marginTop: 2,
  },
  
  // 감정 상태 표시
  emotionMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_CONFIG.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
    fontSize: 10,
    color: APP_CONFIG.colors.textMuted,
    marginBottom: 2,
  },
  emotionMoodText: {
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: APP_CONFIG.colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_CONFIG.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  userAvatarText: {
    fontSize: 16,
  },
  
  // 메시지 버블
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderBottomRightRadius: 6,
>>>>>>> Stashed changes
  },
  emotionLabel: { fontSize: 14, color: APP_CONFIG.colors.text, marginRight: 8 },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messagesContent: { paddingVertical: 16 },
  messageContainer: { marginVertical: 4 },
  userMessageContainer: { alignItems: 'flex-end' },
  aiMessageContainer: { alignItems: 'flex-start' },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  userMessage: { backgroundColor: APP_CONFIG.colors.primary, borderBottomRightRadius: 6 },
  aiMessage: {
    backgroundColor: APP_CONFIG.colors.surface, borderBottomLeftRadius: 6,
    borderWidth: 1, borderColor: APP_CONFIG.colors.border,
  },
<<<<<<< Updated upstream
  messageText: { fontSize: 16, lineHeight: 20 },
  userMessageText: { color: 'white' },
  aiMessageText: { color: APP_CONFIG.colors.text },
  timestamp: { fontSize: 12, marginTop: 4 },
  userTimestamp: { color: 'rgba(255, 255, 255, 0.7)' },
  aiTimestamp: { color: APP_CONFIG.colors.textMuted },
  cbtSuggestionButton: {
    backgroundColor: APP_CONFIG.colors.secondary, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 16, marginTop: 8, alignSelf: 'flex-start',
  },
  cbtSuggestionText: { color: 'white', fontSize: 14, fontWeight: '500' },
  loadingContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16,
  },
  loadingText: { marginLeft: 8, fontSize: 14, color: APP_CONFIG.colors.textLight, fontStyle: 'italic' },
  emotionTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emotionEmoji: { fontSize: 16, marginRight: 6 },
  emotionText: { fontSize: 14, fontWeight: '500', marginRight: 8 },
  intensityDots: { flexDirection: 'row' },
  intensityDot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 1 },
  inputContainer: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: APP_CONFIG.colors.surface, borderTopWidth: 1, borderTopColor: APP_CONFIG.colors.border,
    alignItems: 'flex-end', paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  textInput: {
    flex: 1, borderWidth: 1, borderColor: APP_CONFIG.colors.border, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, fontSize: 16,
    color: APP_CONFIG.colors.text, backgroundColor: APP_CONFIG.colors.background, maxHeight: 100,
  },
  sendButton: {
    backgroundColor: APP_CONFIG.colors.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
=======
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: APP_CONFIG.colors.text,
  },
  
  // 감정 정보
  emotionInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border + '50',
  },
  emotionInfoText: {
    fontSize: 12,
    color: APP_CONFIG.colors.textLight,
    fontStyle: 'italic',
  },
  
  timestamp: {
    fontSize: 11,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    marginBottom: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: APP_CONFIG.colors.textLight,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    fontStyle: 'italic',
  },
  
  // 향상된 입력 영역
  inputContainer: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
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
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    backgroundColor: APP_CONFIG.colors.background,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: APP_CONFIG.colors.primary,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: APP_CONFIG.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: APP_CONFIG.colors.border,
    shadowOpacity: 0,
  },
  sendButtonText: {
    fontSize: 18,
  },
  inputHint: {
    fontSize: 12,
    color: APP_CONFIG.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
>>>>>>> Stashed changes
  },
  sendButtonDisabled: { backgroundColor: APP_CONFIG.colors.border },
  sendButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default InnerTalkScreen;