import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { openAIService } from '../services/openai';
import { supabase, auth, database } from '../lib/supabase';
import { APP_CONFIG } from '../config/app';

const ApiTestScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [testEmotion, setTestEmotion] = useState('오늘 하루가 너무 힘들어요. 직장에서 스트레스 받는 일이 계속 생기네요.');

  // 결과 표시 컴포넌트
  const ResultCard = ({ title, result, type = 'info' }) => (
    <View style={[styles.resultCard, type === 'error' && styles.errorCard]}>
      <Text style={styles.resultTitle}>{title}</Text>
      <Text style={[styles.resultText, type === 'error' && styles.errorText]}>
        {typeof result === 'object' ? JSON.stringify(result, null, 2) : result || '테스트 대기 중...'}
      </Text>
    </View>
  );

  // 1. Supabase 연결 테스트
  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      // 기본 연결 테스트
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        setResults(prev => ({
          ...prev,
          supabase: `❌ 연결 실패: ${error.message}`
        }));
      } else {
        setResults(prev => ({
          ...prev,
          supabase: `✅ Supabase 연결 성공! 데이터베이스에 접근 가능합니다.`
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        supabase: `❌ 연결 오류: ${error.message}`
      }));
    }
    setLoading(false);
  };

  // 2. OpenAI API 테스트
  const testOpenAIConnection = async () => {
    setLoading(true);
    try {
      const result = await openAIService.analyzeEmotion(testEmotion);
      
      if (result.success) {
        setResults(prev => ({
          ...prev,
          openai: `✅ OpenAI API 연결 성공!\n\n분석 결과:\n주요 감정: ${result.analysis.emotion_analysis.primary_emotion}\n강도: ${result.analysis.emotion_analysis.intensity}/5\n공감 응답: ${result.analysis.empathy_response}`
        }));
      } else {
        setResults(prev => ({
          ...prev,
          openai: `❌ OpenAI API 오류: ${result.error}`
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        openai: `❌ OpenAI API 연결 실패: ${error.message}`
      }));
    }
    setLoading(false);
  };

  // 3. 사용자 인증 테스트
  const testAuthentication = async () => {
    setLoading(true);
    try {
      // 현재 세션 확인
      const { session, error } = await auth.getSession();
      
      if (error) {
        setResults(prev => ({
          ...prev,
          auth: `❌ 인증 오류: ${error.message}`
        }));
      } else if (session) {
        setResults(prev => ({
          ...prev,
          auth: `✅ 사용자 로그인 상태\n이메일: ${session.user.email}\nID: ${session.user.id}`
        }));
      } else {
        setResults(prev => ({
          ...prev,
          auth: `ℹ️ 로그인되지 않은 상태 (정상)`
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        auth: `❌ 인증 테스트 실패: ${error.message}`
      }));
    }
    setLoading(false);
  };

  // 4. 환경변수 테스트
  const testEnvironmentVariables = () => {
    const envVars = {
      'SUPABASE_URL': process.env.EXPO_PUBLIC_SUPABASE_URL,
      'SUPABASE_ANON_KEY': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      'OPENAI_API_KEY': process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    };

    let result = '환경변수 상태:\n\n';
    for (const [key, value] of Object.entries(envVars)) {
      if (value) {
        result += `✅ ${key}: ${key.includes('KEY') ? '***설정됨***' : value}\n`;
      } else {
        result += `❌ ${key}: 설정되지 않음\n`;
      }
    }

    setResults(prev => ({
      ...prev,
      env: result
    }));
  };

  // 5. CBT 질문 생성 테스트
  const testCBTQuestions = async () => {
    setLoading(true);
    try {
      // 먼저 감정 분석
      const emotionResult = await openAIService.analyzeEmotion(testEmotion);
      
      if (emotionResult.success) {
        // CBT 질문 생성
        const cbtResult = await openAIService.generateCBTQuestions(emotionResult.analysis.emotion_analysis);
        
        if (cbtResult.success) {
          const questions = cbtResult.questions.cbt_questions.map((q, index) => 
            `${index + 1}. [${q.step}] ${q.question}`
          ).join('\n\n');
          
          setResults(prev => ({
            ...prev,
            cbt: `✅ CBT 질문 생성 성공!\n\n${questions}\n\n성찰 질문: ${cbtResult.questions.reflection_prompt}`
          }));
        } else {
          setResults(prev => ({
            ...prev,
            cbt: `❌ CBT 질문 생성 실패: ${cbtResult.error}`
          }));
        }
      } else {
        setResults(prev => ({
          ...prev,
          cbt: `❌ 감정 분석 실패로 CBT 테스트 불가: ${emotionResult.error}`
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        cbt: `❌ CBT 테스트 오류: ${error.message}`
      }));
    }
    setLoading(false);
  };

  // 모든 테스트 실행
  const runAllTests = async () => {
    setResults({});
    await testEnvironmentVariables();
    await testSupabaseConnection();
    await testAuthentication();
    await testOpenAIConnection();
    await testCBTQuestions();
    Alert.alert('완료', '모든 API 테스트가 완료되었습니다!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 API 연결 테스트</Text>
        <Text style={styles.subtitle}>Innerpal API 연결 상태를 확인해보세요</Text>
      </View>

      {/* 테스트할 감정 텍스트 입력 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>테스트할 감정 텍스트:</Text>
        <TextInput
          style={styles.textInput}
          value={testEmotion}
          onChangeText={setTestEmotion}
          placeholder="감정을 입력해주세요..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* 테스트 버튼들 */}
      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={runAllTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '테스트 중...' : '🚀 전체 테스트 실행'}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={testEnvironmentVariables}
          >
            <Text style={styles.secondaryButtonText}>환경변수</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={testSupabaseConnection}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Supabase</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={testAuthentication}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>인증</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={testOpenAIConnection}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>OpenAI</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testCBTQuestions}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>CBT 질문 생성</Text>
        </TouchableOpacity>
      </View>

      {/* 로딩 표시 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_CONFIG.colors.primary} />
          <Text style={styles.loadingText}>테스트 진행 중...</Text>
        </View>
      )}

      {/* 테스트 결과 */}
      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle}>📋 테스트 결과</Text>
        
        <ResultCard 
          title="🔐 환경변수" 
          result={results.env} 
        />
        
        <ResultCard 
          title="🗃️ Supabase 연결" 
          result={results.supabase}
          type={results.supabase?.includes('❌') ? 'error' : 'info'}
        />
        
        <ResultCard 
          title="👤 사용자 인증" 
          result={results.auth}
          type={results.auth?.includes('❌') ? 'error' : 'info'}
        />
        
        <ResultCard 
          title="🤖 OpenAI API" 
          result={results.openai}
          type={results.openai?.includes('❌') ? 'error' : 'info'}
        />
        
        <ResultCard 
          title="💭 CBT 질문 생성" 
          result={results.cbt}
          type={results.cbt?.includes('❌') ? 'error' : 'info'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // 탭바를 위한 여백
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: APP_CONFIG.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: APP_CONFIG.colors.textLight,
    textAlign: 'center',
  },
  
  // 입력 섹션
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    fontSize: 14,
    color: APP_CONFIG.colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // 버튼 섹션
  buttonSection: {
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: APP_CONFIG.colors.primary,
    paddingVertical: 16,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: APP_CONFIG.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // 로딩
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: APP_CONFIG.colors.textLight,
    fontSize: 14,
  },
  
  // 결과 섹션
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: APP_CONFIG.colors.primary,
  },
  errorCard: {
    borderLeftColor: APP_CONFIG.colors.error,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.colors.text,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 13,
    color: APP_CONFIG.colors.textLight,
    lineHeight: 18,
    fontFamily: 'monospace', // 코드/결과 표시용
  },
  errorText: {
    color: APP_CONFIG.colors.error,
  },
});

export default ApiTestScreen;