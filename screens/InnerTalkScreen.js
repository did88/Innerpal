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
  }
};

// 메시지 컴포넌트
const MessageBubble = ({ message, isUser, timestamp }) => (
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
    </View>
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

  return (
    <View style={[
      styles.emotionTag,
      { backgroundColor: getEmotionColor(emotion) + '20' }
    ]}>
      <Text style={styles.emotionEmoji}>{getEmotionEmoji(emotion)}</Text>
      <Text style={[styles.emotionText, { color: getEmotionColor(emotion) }]}>
        {emotion === 'joy' ? '기쁨' :
         emotion === 'sadness' ? '슬픔' :
         emotion === 'anger' ? '분노' :
         emotion === 'fear' ? '불안' :
         emotion === 'surprise' ? '놀람' :
         emotion === 'disgust' ? '혐오' : '평온'}
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
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "안녕하세요! 저는 당신의 내면의 친구 Innerpal이에요. 오늘 마음은 어떠신가요? 무엇이든 편하게 이야기해주세요.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const scrollViewRef = useRef();

  // GPT API 호출 함수 (임시 시뮬레이션)
  const analyzeEmotionWithGPT = async (emotionText) => {
    // 임시로 시뮬레이션 (실제 GPT 연동은 다음 단계)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
    
    // 간단한 키워드 기반 감정 분석
    const emotions = {
      joy: ['기쁘', '행복', '좋아', '신나', '즐거', '만족'],
      sadness: ['슬프', '우울', '힘들', '외로', '허전', '눈물'],
      anger: ['화나', '짜증', '분노', '열받', '답답', '억울'],
      fear: ['무서', '불안', '걱정', '두려', '긴장', '스트레스'],
      surprise: ['놀라', '신기', '의외', '깜짝'],
      disgust: ['싫어', '혐오', '역겨', '불쾌']
    };

    let detectedEmotion = 'neutral';
    let maxMatches = 0;
    
    Object.entries(emotions).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => 
        emotionText.toLowerCase().includes(keyword)
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    });

    // 감정 강도 계산
    const intensity = emotionText.length > 50 ? 
      Math.min(5, Math.floor(emotionText.length / 20) + 2) : 3;

    // 감정별 응답 생성
    const responses = {
      joy: [
        "정말 기쁜 일이 있으셨군요! 그 기쁨이 느껴져요. 어떤 일이 이렇게 행복하게 만들어주었나요?",
        "와! 정말 좋은 일이네요. 그 기쁨을 만끽하시길 바라요. 더 자세히 들려주세요!"
      ],
      sadness: [
        "마음이 많이 힘드시겠어요. 슬픈 감정도 소중한 감정이에요. 혼자가 아니라는 걸 기억해주세요.",
        "힘든 시간을 보내고 계시는군요. 괜찮아요, 이런 감정을 느끼는 것도 자연스러운 일이에요."
      ],
      anger: [
        "화가 많이 나셨나봐요. 그 분노의 감정을 표현해주셔서 고마워요. 무엇이 이렇게 화나게 했을까요?",
        "억울하고 화나는 마음이 느껴져요. 그런 감정을 갖는 것도 당연해요. 더 이야기해주세요."
      ],
      fear: [
        "불안하고 걱정이 많으시군요. 그런 감정이 드는 게 이해돼요. 천천히 깊게 숨을 쉬어보세요.",
        "두려운 마음이 드시는군요. 괜찮아요, 그런 감정도 충분히 이해할 수 있어요."
      ],
      surprise: [
        "놀라운 일이 있으셨나봐요! 어떤 일이 이렇게 놀랍게 만들었는지 궁금해요.",
        "의외의 일이 있었나보네요. 그 놀라움이 전해져요!"
      ],
      disgust: [
        "불쾌한 일이 있으셨군요. 그런 감정을 느끼시는 것도 자연스러워요. 어떤 일이었나요?",
        "싫은 일이 있었나봐요. 그런 감정도 충분히 타당해요."
      ],
      neutral: [
        "차분한 마음 상태시군요. 더 자세히 이야기해주시면 더 잘 이해할 수 있을 것 같아요.",
        "지금 느끼고 계신 감정에 대해 더 들려주세요. 어떤 것이든 괜찮아요."
      ]
    };

    const emotionResponses = responses[detectedEmotion];
    const response = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

    return {
      emotion_analysis: {
        primary_emotion: detectedEmotion,
        intensity: intensity,
        keywords: emotions[detectedEmotion] || []
      },
      empathy_response: response
    };
  };

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
      })
    };

    // 사용자 메시지 추가
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // AI 응답 생성
      const analysis = await analyzeEmotionWithGPT(inputText.trim());
      
      // 감정 정보 업데이트
      setCurrentEmotion({
        emotion: analysis.emotion_analysis.primary_emotion,
        intensity: analysis.emotion_analysis.intensity
      });

      // AI 응답 메시지 추가
      const aiMessage = {
        id: Date.now() + 1,
        message: analysis.empathy_response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      Alert.alert('오류', '응답을 생성하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
        {/* 헤더 */}
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
            />
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={APP_CONFIG.colors.primary} />
              <Text style={styles.loadingText}>Innerpal이 생각 중...</Text>
            </View>
          )}
        </ScrollView>

        {/* 입력 영역 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="오늘 마음은 어떠신가요? 무엇이든 편하게 이야기해주세요..."
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
  
  // 헤더 스타일
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
  
  // 감정 표시
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
  
  // 메시지 관련 스타일
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
  
  // 로딩 스타일
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
  
  // 감정 태그 스타일
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
  
  // 입력 영역 스타일
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_CONFIG.colors.surface,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.colors.border,
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 34 : 12, // iOS 홈 인디케이터 고려
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