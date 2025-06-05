import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../lib/supabase';
import openAIService from '../services/openai';

const InsightsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { initialEmotion } = route.params || {};

  const [thought, setThought] = useState('');
  const [aiReply, setAiReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSend = async () => {
    if (!thought.trim()) return;
    const userThought = thought.trim();
    setThought('');
    setLoading(true);

    const userMessage = { role: 'user', content: userThought };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);

    try {
      const [response, userEmotions] = await Promise.all([
        openAIService.innerTalk(newHistory),
        openAIService.getEmotionSummary(userThought)
      ]);

      const aiMessage = {
        role: 'assistant',
        content: response.success && response.data
          ? response.data
          : '답변을 생성할 수 없습니다. 나중에 다시 시도해주세요.'
      };

      const aiEmotions = await openAIService.getEmotionSummary(aiMessage.content);

      setHistory([...newHistory, aiMessage]);
      setAiReply(aiMessage.content);

      await database.saveInnerTalk({
        emotion_id: initialEmotion?.id || null,
        user_input: userThought,
        ai_reply: aiMessage.content,
        user_emotions: userEmotions || null,
        ai_emotions: aiEmotions || null
      });

    } catch (error) {
      console.warn('InnerTalk 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message, index) => (
    <View
      key={index}
      style={[
        styles.messageContainer,
        message.role === 'user' ? styles.userMessage : styles.aiMessage
      ]}
    >
      <Text style={styles.messageText}>{message.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>내면 대화</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {(Array.isArray(history) ? history : []).map(renderMessage)}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A5568" />
            <Text style={styles.loadingText}>AI 응답 생성 중...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={thought}
          onChangeText={setThought}
          placeholder="당신의 생각을 적어보세요..."
          placeholderTextColor="#A0AEC0"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading || !thought.trim()}
        >
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#2D3748',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#A0AEC0',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
  },
  messageText: {
    color: '#2D3748',
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    minHeight: 60,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  sendButton: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#718096',
  },
});

export default InsightsScreen;
