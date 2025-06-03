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
  SafeAreaView
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
  }
};

// 메시지 컴포넌트
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

// 감정 태그 컴포넌트
const EmotionTag = ({ emotion, intensity }) => {
  const getEmotionColor = (emotion) => {
    const colors = {
      joy: '#48BB78',
      sadness: '#4299E1', 
      anger: '#F56565',
      fear: '#ED8936',
      surprise: '#A78BFA',
      disgust: '#38B2AC',
      neutral: '#718096',
    };
    return colors[emotion] || colors.neutral;
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      joy: '😊',
      sadness: '😢',
      anger: '😠', 
      fear: '😰',
      surprise: '😮',
      disgust: '😤',
      neutral: '😐',
    };
    return emojis[emotion] || emojis.neutral;
  };

  const getEmotionLabel = (emotion) => {
    const labels = {
      joy: '기쁨',
      sadness: '슬픔',
      anger: '분노',
      fear: '불안',
      surprise: '놀람',
      disgust: '혐오',
      neutral: '평온',
    };
    return labels[emotion] || labels.neutral;
  };

  return (
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
      </View>
    </View>
  );
};

const InnerTalkScreen = ({ navigation }) => {
  const route = useRoute();
  const { initialEmotion } = route.params || {};
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: initialEmotion 
        ? `안녕하세요! 감정을 기록해주셔서 고마워요. ${initialEmotion.emotion_text}라고 하셨는데, 더 자세히 이야기해주실래요?`
        : "안녕하세요! 저는 당신의 내면의 친구 Innerpal이에요. 오늘 마음은 어떠신가요? 무엇이든 편하게 이야기해주세요.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(
    initialEmotion ? {
      emotion: initialEmotion.primary_emotion,
      intensity: initialEmotion.intensity
    } : null
  );
  const [conversationDepth, setConversationDepth] = useState(0);
  const scrollViewRef = useRef();

  // 메시지 전송 함수
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      message: inputText.trim(),
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

    try {
      // 간단한 AI 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = [
        "그런 감정을 느끼는 것이 자연스러워요. 더 자세히 이야기해주실 수 있나요?",
        "이해해요. 그런 상황에서 어떤 생각이 들었나요?",
        "힘든 시간을 보내고 계시는군요. 함께 이야기해봐요.",
        "그 감정에 대해 더 깊이 탐색해볼까요?"
      ];

      const aiMessage = {
        id: Date.now() + 1,
        message: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        showCBTSuggestion: conversationDepth >= 2
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationDepth(prev => prev + 1);

    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      Alert.alert('오류', '응답을 생성하는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // CBT 세션 시작
  const handleCBTStart = () => {
    const emotionData = {
      emotion_text: messages.filter(m => m.isUser).map(m => m.message).join(' '),
      primary_emotion: currentEmotion?.emotion,
      intensity: currentEmotion?.intensity
    };
    navigation.navigate('CBTSession', { emotionData });
  };

  // 스크롤을 아래로 이동
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inner Talk 💭</Text>
          <Text style={styles.headerSubtitle}>AI와 함께하는 감정 대화</Text>
          
          {currentEmotion && (
            <View style={styles.emotionDisplay}>
              <Text style={styles.emotionLabel}>현재 감정:</Text>
              <EmotionTag 
                emotion={currentEmotion.emotion} 
                intensity={currentEmotion.intensity} 
              />
            </View>
          )}
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
              showCBTSuggestion={message.showCBTSuggestion}
              onCBTStart={handleCBTStart}
            />
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={APP_CONFIG.colors.primary} />
              <Text style={styles.loadingText}>Innerpal이 생각 중...</Text>
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
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  header: {
    backgroundColor: APP_CONFIG.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: APP_CONFIG.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.text,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  emotionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  emotionLabel: {
    fontSize: 14,
    color: APP_CONFIG.colors.text,
    marginRight: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderBottomRightRadius: 6,
  },
  aiMessage: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: APP_CONFIG.colors.text,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: APP_CONFIG.colors.textMuted,
  },
  cbtSuggestionButton: {
    backgroundColor: APP_CONFIG.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  cbtSuggestionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    fontStyle: 'italic',
  },
  emotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  emotionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  emotionText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  intensityDots: {
    flexDirection: 'row',
  },
  intensityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_CONFIG.colors.surface,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border,
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    backgroundColor: APP_CONFIG.colors.background,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: APP_CONFIG.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: APP_CONFIG.colors.border,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InnerTalkScreen;