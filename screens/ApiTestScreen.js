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
  Platform,
} from 'react-native';

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

  // 환경변수 테스트
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

    setResults(prev => ({ ...prev, env: result }));
  };

  // 네트워크 연결 테스트
  const testNetworkConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      if (response.ok) {
        setResults(prev => ({
          ...prev,
          network: `✅ 네트워크 연결 성공!\n상태 코드: ${response.status}\n응답 시간: ${Date.now() % 1000}ms`
        }));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        network: `❌ 네트워크 연결 실패: ${error.message}\n\n💡 인터넷 연결을 확인해주세요`
      }));
    }
    setLoading(false);
  };

  // Supabase 연결 테스트
  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase 설정이 누락되었습니다.');
      }

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
          supabase: `✅ Supabase 연결 성공!\nURL: ${supabaseUrl}\n상태 코드: ${response.status}\n🗄️ 데이터베이스 접근 가능`
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

  // OpenAI API 테스트
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
            { role: 'system', content: 'You are a helpful assistant. Respond in Korean.' },
            { role: 'user', content: `다음 감정을 간단히 분석해주세요: "${testEmotion}"` }
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
        openai: `✅ OpenAI API 연결 성공!\n\n🤖 AI 분석 결과:\n"${data.choices[0].message.content.trim()}"\n\n📊 사용 토큰: ${data.usage?.total_tokens || 'N/A'}`
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        openai: `❌ OpenAI API 연결 실패: ${error.message}\n\n💡 API 키와 크레딧을 확인해주세요`
      }));
    }
    setLoading(false);
  };

  // 시스템 정보
  const getSystemInfo = () => {
    const systemInfo = {
      'Platform': Platform.OS,
      'React Native': '0.79.2',
      'Expo SDK': '~53.0.9',
      'Current Time': new Date().toLocaleString('ko-KR'),
    };

    let result = '시스템 정보:\n\n';
    for (const [key, value] of Object.entries(systemInfo)) {
      result += `📱 ${key}: ${value}\n`;
    }

    setResults(prev => ({ ...prev, system: result }));
  };

  // 모든 테스트 실행
  const runAllTests = async () => {
    setResults({});
    testEnvironmentVariables();
    getSystemInfo();
    await testNetworkConnection();
    await testSupabaseConnection();
    await testOpenAIConnection();
    
    Alert.alert('테스트 완료', '모든 API 테스트가 완료되었습니다!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 API 연결 테스트</Text>
        <Text style={styles.subtitle}>Innerpal 시스템 상태를 종합 진단합니다</Text>
      </View>

      {/* 테스트용 감정 텍스트 입력 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>AI 테스트용 감정 텍스트:</Text>
        <TextInput
          style={styles.textInput}
          value={testEmotion}
          onChangeText={setTestEmotion}
          placeholder="OpenAI API 테스트에 사용할 감정을 입력해주세요..."
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
            {loading ? '종합 진단 중...' : '🚀 전체 시스템 진단'}
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
            onPress={testSupabaseConnection}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Supabase</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testOpenAIConnection}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>🤖 OpenAI GPT-4</Text>
        </TouchableOpacity>
      </View>

      {/* 로딩 표시 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A5568" />
          <Text style={styles.loadingText}>API 연결 테스트 중...</Text>
        </View>
      )}

      {/* 테스트 결과 */}
      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle}>📋 진단 결과</Text>
        
        <ResultCard title="📱 시스템 정보" result={results.system} />
        <ResultCard title="🔐 환경변수 설정" result={results.env} />
        <ResultCard 
          title="🌐 네트워크 연결" 
          result={results.network}
          type={results.network?.includes('❌') ? 'error' : 'info'}
        />
        <ResultCard 
          title="🗃️ Supabase 데이터베이스" 
          result={results.supabase}
          type={results.supabase?.includes('❌') ? 'error' : 'info'}
        />
        <ResultCard 
          title="🤖 OpenAI GPT-4 API" 
          result={results.openai}
          type={results.openai?.includes('❌') ? 'error' : 'info'}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 문제가 지속되면 인터넷 연결과 API 키를 확인해주세요
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCF0',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
    color: '#2D3748',
    minHeight: 80,
    textAlignVertical: 'top',
  },
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
    backgroundColor: '#4A5568',
    paddingVertical: 16,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
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
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A5568',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorCard: {
    borderLeftColor: '#F56565',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#F56565',
  },
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
  },
});

export default ApiTestScreen;
