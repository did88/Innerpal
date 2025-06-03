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
<<<<<<< Updated upstream
import { openAIService } from '../services/openai';
import { supabase, auth, database } from '../lib/supabase';
import { APP_CONFIG } from '../config/app';
=======
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
  // 1. 환경변수 테스트
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  // 2. 네트워크 연결 테스트 (여러 서비스 시도)
  const testNetworkConnection = async () => {
    setLoading(true);
    try {
      // 여러 서비스를 시도해서 가장 안정적인 것으로 테스트
      const testUrls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://api.github.com',
        'https://httpstat.us/200'
      ];

      let success = false;
      let lastError = null;

      for (const url of testUrls) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            timeout: 5000,
          });

          if (response.ok) {
            setResults(prev => ({
              ...prev,
              network: `✅ 네트워크 연결 성공!\n테스트 URL: ${url}\n상태 코드: ${response.status}\n응답 시간: ${Date.now() % 1000}ms`
            }));
            success = true;
            break;
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      if (!success) {
        throw lastError || new Error('모든 테스트 URL에서 실패');
      }
      
    } catch (error) {
      setResults(prev => ({
        ...prev,
        network: `❌ 네트워크 연결 실패: ${error.message}\n\n💡 인터넷 연결을 확인해주세요`
>>>>>>> Stashed changes
      }));
    }
    setLoading(false);
  };

<<<<<<< Updated upstream
  // 모든 테스트 실행
  const runAllTests = async () => {
    setResults({});
    await testEnvironmentVariables();
    await testSupabaseConnection();
    await testAuthentication();
    await testOpenAIConnection();
    await testCBTQuestions();
    Alert.alert('완료', '모든 API 테스트가 완료되었습니다!');
=======
  // 3. Supabase 연결 테스트
  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase 설정이 누락되었습니다.');
      }

      // Supabase Health Check
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setResults(prev => ({
          ...prev,
          supabase: `✅ Supabase 연결 성공!\n\nURL: ${supabaseUrl}\n상태 코드: ${response.status}\n서버: ${response.headers.get('server') || 'Supabase'}\n\n🗄️ 데이터베이스 접근 가능`
        }));
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      setResults(prev => ({
        ...prev,
        supabase: `❌ Supabase 연결 실패: ${error.message}\n\n💡 Supabase 프로젝트 상태를 확인해주세요`
      }));
    }
    setLoading(false);
  };

  // 4. OpenAI API 테스트
  const testOpenAIConnection = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다.');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Respond in Korean.'
            },
            {
              role: 'user',
              content: `다음 감정을 한 줄로 간단히 분석해주세요: "${testEmotion}"`
            }
          ],
          max_tokens: 50,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        openai: `✅ OpenAI API 연결 성공!\n\n🤖 AI 분석 결과:\n"${data.choices[0].message.content.trim()}"\n\n📊 사용된 토큰: ${data.usage?.total_tokens || 'N/A'}\n모델: ${data.model}`
      }));
      
    } catch (error) {
      setResults(prev => ({
        ...prev,
        openai: `❌ OpenAI API 연결 실패: ${error.message}\n\n💡 API 키와 크레딧을 확인해주세요`
      }));
    }
    setLoading(false);
  };

  // 5. 종합 시스템 정보
  const getSystemInfo = () => {
    const systemInfo = {
      'Platform': Platform.OS,
      'React Native': '0.79.2',
      'Expo SDK': '~53.0.9',
      'Network State': navigator.onLine ? 'Online' : 'Offline',
      'User Agent': navigator.userAgent || 'N/A',
      'Current Time': new Date().toLocaleString('ko-KR'),
    };

    let result = '시스템 정보:\n\n';
    for (const [key, value] of Object.entries(systemInfo)) {
      result += `📱 ${key}: ${value}\n`;
    }

    setResults(prev => ({
      ...prev,
      system: result
    }));
  };

  // 모든 테스트 실행
  const runAllTests = async () => {
    setResults({});
    
    // 환경변수와 시스템 정보는 즉시 표시
    testEnvironmentVariables();
    getSystemInfo();
    
    // API 테스트는 순차적으로 실행
    await testNetworkConnection();
    
    if (results.network?.includes('✅')) {
      await testSupabaseConnection();
      await testOpenAIConnection();
    }
    
    Alert.alert(
      '테스트 완료', 
      '모든 API 테스트가 완료되었습니다!\n\n결과를 확인해보세요.',
      [{ text: '확인', style: 'default' }]
    );
>>>>>>> Stashed changes
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 API 연결 테스트</Text>
<<<<<<< Updated upstream
        <Text style={styles.subtitle}>Innerpal API 연결 상태를 확인해보세요</Text>
=======
        <Text style={styles.subtitle}>Innerpal 시스템 상태를 종합 진단합니다</Text>
>>>>>>> Stashed changes
      </View>

      {/* 테스트할 감정 텍스트 입력 */}
      <View style={styles.inputSection}>
<<<<<<< Updated upstream
        <Text style={styles.inputLabel}>테스트할 감정 텍스트:</Text>
=======
        <Text style={styles.inputLabel}>AI 테스트용 감정 텍스트:</Text>
>>>>>>> Stashed changes
        <TextInput
          style={styles.textInput}
          value={testEmotion}
          onChangeText={setTestEmotion}
<<<<<<< Updated upstream
          placeholder="감정을 입력해주세요..."
=======
          placeholder="OpenAI API 테스트에 사용할 감정을 입력해주세요..."
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            {loading ? '테스트 중...' : '🚀 전체 테스트 실행'}
=======
            {loading ? '종합 진단 중...' : '🚀 전체 시스템 진단'}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
            onPress={getSystemInfo}
          >
            <Text style={styles.secondaryButtonText}>시스템 정보</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={testNetworkConnection}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>네트워크</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
>>>>>>> Stashed changes
            onPress={testSupabaseConnection}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Supabase</Text>
          </TouchableOpacity>
        </View>

<<<<<<< Updated upstream
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
=======
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testOpenAIConnection}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>🤖 OpenAI GPT-4</Text>
>>>>>>> Stashed changes
        </TouchableOpacity>
      </View>

      {/* 로딩 표시 */}
      {loading && (
        <View style={styles.loadingContainer}>
<<<<<<< Updated upstream
          <ActivityIndicator size="large" color={APP_CONFIG.colors.primary} />
          <Text style={styles.loadingText}>테스트 진행 중...</Text>
=======
          <ActivityIndicator size="large" color="#4A5568" />
          <Text style={styles.loadingText}>API 연결 테스트 중...</Text>
          <Text style={styles.loadingSubText}>잠시만 기다려주세요</Text>
>>>>>>> Stashed changes
        </View>
      )}

      {/* 테스트 결과 */}
      <View style={styles.resultsSection}>
<<<<<<< Updated upstream
        <Text style={styles.resultsTitle}>📋 테스트 결과</Text>
        
        <ResultCard 
          title="🔐 환경변수" 
=======
        <Text style={styles.resultsTitle}>📋 진단 결과</Text>
        
        <ResultCard 
          title="📱 시스템 정보" 
          result={results.system} 
        />
        
        <ResultCard 
          title="🔐 환경변수 설정" 
>>>>>>> Stashed changes
          result={results.env} 
        />
        
        <ResultCard 
<<<<<<< Updated upstream
          title="🗃️ Supabase 연결" 
=======
          title="🌐 네트워크 연결" 
          result={results.network}
          type={results.network?.includes('❌') ? 'error' : 'info'}
        />
        
        <ResultCard 
          title="🗃️ Supabase 데이터베이스" 
>>>>>>> Stashed changes
          result={results.supabase}
          type={results.supabase?.includes('❌') ? 'error' : 'info'}
        />
        
        <ResultCard 
<<<<<<< Updated upstream
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
=======
          title="🤖 OpenAI GPT-4 API" 
          result={results.openai}
          type={results.openai?.includes('❌') ? 'error' : 'info'}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 문제가 지속되면 인터넷 연결과 API 키를 확인해주세요
        </Text>
>>>>>>> Stashed changes
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< Updated upstream
    backgroundColor: APP_CONFIG.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // 탭바를 위한 여백
=======
    backgroundColor: '#FEFCF0',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
>>>>>>> Stashed changes
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.text,
=======
    color: '#2D3748',
>>>>>>> Stashed changes
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.textLight,
=======
    color: '#718096',
>>>>>>> Stashed changes
    textAlign: 'center',
  },
  
  // 입력 섹션
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.text,
=======
    color: '#2D3748',
>>>>>>> Stashed changes
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
<<<<<<< Updated upstream
    borderColor: APP_CONFIG.colors.border,
    fontSize: 14,
    color: APP_CONFIG.colors.text,
=======
    borderColor: '#E2E8F0',
    fontSize: 14,
    color: '#2D3748',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    backgroundColor: APP_CONFIG.colors.primary,
=======
    backgroundColor: '#4A5568',
>>>>>>> Stashed changes
    paddingVertical: 16,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
<<<<<<< Updated upstream
    borderColor: APP_CONFIG.colors.border,
=======
    borderColor: '#E2E8F0',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.text,
=======
    color: '#2D3748',
>>>>>>> Stashed changes
    fontSize: 14,
    fontWeight: '500',
  },
  
  // 로딩
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
<<<<<<< Updated upstream
  },
  loadingText: {
    marginTop: 8,
    color: APP_CONFIG.colors.textLight,
=======
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubText: {
    marginTop: 4,
    color: '#718096',
>>>>>>> Stashed changes
    fontSize: 14,
  },
  
  // 결과 섹션
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.text,
=======
    color: '#2D3748',
>>>>>>> Stashed changes
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
<<<<<<< Updated upstream
    borderLeftColor: APP_CONFIG.colors.primary,
  },
  errorCard: {
    borderLeftColor: APP_CONFIG.colors.error,
=======
    borderLeftColor: '#4A5568',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorCard: {
    borderLeftColor: '#F56565',
>>>>>>> Stashed changes
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.text,
=======
    color: '#2D3748',
>>>>>>> Stashed changes
    marginBottom: 8,
  },
  resultText: {
    fontSize: 13,
<<<<<<< Updated upstream
    color: APP_CONFIG.colors.textLight,
    lineHeight: 18,
    fontFamily: 'monospace', // 코드/결과 표시용
  },
  errorText: {
    color: APP_CONFIG.colors.error,
=======
    color: '#718096',
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#F56565',
  },
  
  // 푸터
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    fontStyle: 'italic',
>>>>>>> Stashed changes
  },
});

export default ApiTestScreen;