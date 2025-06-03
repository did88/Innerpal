import Constants from 'expo-constants';

/**
 * 실제 OpenAI GPT API 연동 서비스
 */
class OpenAIService {
  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4';
  }

  /**
   * GPT API 호출
   */
  async callGPT(messages, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다.');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages,
          max_tokens: options.maxTokens || 800,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 1,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.choices[0].message.content,
        usage: data.usage,
        error: null
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      return {
        success: false,
        data: null,
        usage: null,
        error: error.message
      };
    }
  }

  /**
   * 감정 분석 및 공감 응답 생성
   */
  async analyzeEmotion(emotionText, context = {}) {
    const systemPrompt = `당신은 Innerpal의 AI 친구입니다. 사용자의 감정을 이해하고 공감하는 따뜻한 동반자 역할을 합니다.

역할과 특성:
- 한국어로 자연스럽고 따뜻하게 대화
- 감정을 판단하지 않고 있는 그대로 받아들임
- 구체적이고 개인적인 공감 표현 사용
- 필요시 부드러운 질문으로 대화 유도
- 전문적 상담이 필요한 경우 권유

응답은 반드시 다음 JSON 형식으로만 답변하세요:
{
  "emotion_analysis": {
    "primary_emotion": "joy|sadness|anger|fear|surprise|disgust|neutral 중 하나",
    "intensity": 1-5 사이의 숫자,
    "keywords": ["감정을", "나타내는", "키워드들"],
    "confidence": 0.0-1.0 사이의 신뢰도
  },
  "empathy_response": "공감과 위로의 응답 메시지 (50-150자)",
  "follow_up_question": "더 깊은 대화를 위한 질문 (한 개만)",
  "care_level": "low|medium|high",
  "should_suggest_cbt": true 또는 false
}`;

    const userMessage = context.conversationHistory 
      ? `이전 대화: ${context.conversationHistory.slice(-2).map(m => `${m.isUser ? '사용자' : 'AI'}: ${m.message}`).join('\n')}\n\n현재 메시지: ${emotionText}`
      : emotionText;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.8,
        maxTokens: 600
      });

      if (result.success) {
        try {
          const parsedData = JSON.parse(result.data);
          return {
            success: true,
            analysis: parsedData,
            rawResponse: result.data,
            usage: result.usage,
            error: null
          };
        } catch (parseError) {
          // JSON 파싱 실패 시 기본 응답
          return this.getFallbackEmotionAnalysis(emotionText);
        }
      } else {
        return this.getFallbackEmotionAnalysis(emotionText, result.error);
      }

    } catch (error) {
      console.error('Emotion Analysis Error:', error);
      return this.getFallbackEmotionAnalysis(emotionText, error.message);
    }
  }

  /**
   * CBT 기반 질문 생성
   */
  async generateCBTQuestions(emotionData, userAnswers = []) {
    const systemPrompt = `당신은 CBT(인지행동치료) 전문가입니다. 사용자의 감정과 상황에 맞는 단계별 질문을 생성합니다.

사용자 정보:
- 주요 감정: ${emotionData.primary_emotion}
- 강도: ${emotionData.intensity}/5
- 상황: ${emotionData.emotion_text}

CBT 4단계 과정:
1. 생각 인식: 자동적 사고 패턴 파악
2. 증거 탐색: 객관적 증거와 반박 증거 검토
3. 대안 탐색: 다른 관점과 해석 가능성
4. 행동 계획: 구체적 대처 방안 수립

응답은 반드시 다음 JSON 형식으로만 답변하세요:
{
  "questions": [
    {
      "step": "thoughts|evidence|alternatives|action",
      "question": "구체적인 질문 내용",
      "type": "text|scale",
      "placeholder": "입력 가이드 메시지"
    }
  ],
  "step_title": "현재 단계 제목",
  "step_description": "현재 단계 설명",
  "guidance": "이 단계에서 도움이 되는 팁"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `위 상황에 맞는 CBT 질문을 생성해주세요. 기존 답변: ${JSON.stringify(userAnswers)}` }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.6,
        maxTokens: 700
      });

      if (result.success) {
        try {
          const parsedData = JSON.parse(result.data);
          return {
            success: true,
            questions: parsedData,
            error: null
          };
        } catch (parseError) {
          return this.getFallbackCBTQuestions();
        }
      } else {
        return this.getFallbackCBTQuestions(result.error);
      }

    } catch (error) {
      console.error('CBT Questions Error:', error);
      return this.getFallbackCBTQuestions(error.message);
    }
  }

  /**
   * CBT 세션 완료 후 인사이트 생성
   */
  async generateCBTInsights(sessionData) {
    const systemPrompt = `당신은 CBT 치료사입니다. 완료된 CBT 세션을 분석하여 의미있는 인사이트를 제공합니다.

세션 데이터:
- 초기 감정: ${sessionData.initial_emotion}
- 답변들: ${JSON.stringify(sessionData.answers)}
- 기분 변화: ${sessionData.before_mood} → ${sessionData.after_mood}

응답은 반드시 다음 JSON 형식으로만 답변하세요:
{
  "insights": [
    {
      "title": "인사이트 제목",
      "content": "구체적인 내용",
      "type": "positive|growth|awareness",
      "suggestion": "실행 가능한 제안"
    }
  ],
  "key_learnings": ["핵심", "깨달음들"],
  "progress_summary": "전체적인 진전 요약",
  "next_steps": ["다음에", "시도해볼", "것들"]
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'CBT 세션 분석 및 인사이트를 제공해주세요.' }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.5,
        maxTokens: 800
      });

      if (result.success) {
        try {
          const parsedData = JSON.parse(result.data);
          return {
            success: true,
            insights: parsedData,
            error: null
          };
        } catch (parseError) {
          return this.getFallbackInsights();
        }
      } else {
        return this.getFallbackInsights(result.error);
      }

    } catch (error) {
      console.error('CBT Insights Error:', error);
      return this.getFallbackInsights(error.message);
    }
  }

  /**
   * 폴백 감정 분석 (API 실패 시)
   */
  getFallbackEmotionAnalysis(emotionText, error = null) {
    // 간단한 키워드 기반 감정 분석
    const emotions = {
      joy: ['기쁘', '행복', '좋아', '신나', '즐거', '만족', '뿌듯'],
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

    const intensity = Math.min(5, Math.max(1, Math.floor(emotionText.length / 20) + 2));

    const responses = {
      joy: "정말 기쁜 일이 있으셨나봐요! 그 기쁨이 느껴져요.",
      sadness: "마음이 많이 힘드시겠어요. 혼자가 아니라는 걸 기억해주세요.",
      anger: "화가 많이 나셨나봐요. 그런 감정을 느끼는 것도 자연스러워요.",
      fear: "불안하고 걱정이 많으시군요. 천천히 깊게 숨을 쉬어보세요.",
      surprise: "놀라운 일이 있으셨나봐요! 어떤 일이었는지 궁금해요.",
      disgust: "불쾌한 일이 있으셨군요. 그런 감정도 충분히 이해해요.",
      neutral: "지금 느끼고 계신 감정에 대해 더 이야기해주세요."
    };

    return {
      success: false,
      analysis: {
        emotion_analysis: {
          primary_emotion: detectedEmotion,
          intensity: intensity,
          keywords: emotions[detectedEmotion] || [],
          confidence: 0.5
        },
        empathy_response: responses[detectedEmotion],
        follow_up_question: "어떤 부분이 가장 마음에 와닿으시나요?",
        care_level: intensity >= 4 ? 'high' : 'medium',
        should_suggest_cbt: intensity >= 4 && ['sadness', 'anger', 'fear'].includes(detectedEmotion)
      },
      rawResponse: null,
      usage: null,
      error: error || 'API 연결 문제로 기본 분석을 제공합니다.'
    };
  }

  /**
   * 폴백 CBT 질문 (API 실패 시)
   */
  getFallbackCBTQuestions(error = null) {
    return {
      success: false,
      questions: {
        questions: [
          {
            step: "thoughts",
            question: "그 상황에서 가장 먼저 떠오른 생각은 무엇이었나요?",
            type: "text",
            placeholder: "예: '나는 실패자야', '모든 게 잘못될 거야' 등"
          }
        ],
        step_title: "생각 인식하기",
        step_description: "그 순간 떠오른 생각들을 살펴봅시다",
        guidance: "떠오른 생각을 그대로 적어보세요. 옳고 그름을 판단하지 마세요."
      },
      error: error || 'API 연결 문제로 기본 질문을 제공합니다.'
    };
  }

  /**
   * 폴백 인사이트 (API 실패 시)
   */
  getFallbackInsights(error = null) {
    return {
      success: false,
      insights: {
        insights: [
          {
            title: "자기 인식 향상",
            content: "CBT 과정을 통해 자신의 생각 패턴을 객관적으로 바라보는 능력이 향상되었습니다.",
            type: "positive",
            suggestion: "앞으로도 정기적으로 자신의 생각을 점검해보세요."
          }
        ],
        key_learnings: ["감정과 생각의 연결고리 이해", "객관적 관점의 중요성"],
        progress_summary: "CBT 세션을 통해 자기 이해가 깊어졌습니다.",
        next_steps: ["일상에서 배운 것들 적용하기", "정기적인 자기 점검"]
      },
      error: error || 'API 연결 문제로 기본 인사이트를 제공합니다.'
    };
  }
}

// 싱글톤 인스턴스 생성
export const openAIService = new OpenAIService();
export default openAIService;