import { API_CONFIG } from '../config/app';
import { apiUtils, devUtils } from '../utils';

/**
 * OpenAI GPT API 연동 서비스
 */
class OpenAIService {
  constructor() {
    this.apiKey = API_CONFIG.openai.apiKey;
    this.model = API_CONFIG.openai.model;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * GPT API 호출
   */
  async callGPT(messages, options = {}) {
    try {
      devUtils.performance.start('OpenAI API Call');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages,
          max_tokens: options.maxTokens || API_CONFIG.openai.maxTokens,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 1,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0,
          ...options.additionalParams
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      devUtils.performance.end('OpenAI API Call');

      return {
        success: true,
        data: data.choices[0].message.content,
        usage: data.usage,
        error: null
      };

    } catch (error) {
      devUtils.performance.end('OpenAI API Call');
      devUtils.log('OpenAI API Error:', error);
      
      return {
        success: false,
        data: null,
        usage: null,
        error: apiUtils.handleApiError(error)
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

응답 형식 (JSON):
{
  "emotion_analysis": {
    "primary_emotion": "주요 감정 (기쁨/슬픔/분노/불안/놀람/혐오/평온)",
    "intensity": "강도 (1-5)",
    "keywords": ["감정을", "나타내는", "키워드들"],
    "secondary_emotions": ["부차적", "감정들"]
  },
  "empathy_response": "공감과 위로의 응답 메시지 (100-200자)",
  "follow_up_questions": ["더 깊은", "대화를 위한", "질문들 (최대 2개)"],
  "care_level": "관심 필요 정도 (low/medium/high)",
  "suggested_actions": ["도움이 될", "행동 제안들"]
}`;

    const userMessage = context.previousContext 
      ? `이전 맥락: ${context.previousContext}\n\n현재 감정: ${emotionText}`
      : emotionText;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.8,
        maxTokens: 800
      });

      if (result.success) {
        const parsedData = JSON.parse(result.data);
        return {
          success: true,
          analysis: parsedData,
          rawResponse: result.data,
          usage: result.usage,
          error: null
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      devUtils.log('Emotion Analysis Error:', error);
      
      // 파싱 실패 시 기본 응답 제공
      return {
        success: false,
        analysis: {
          emotion_analysis: {
            primary_emotion: '평온',
            intensity: 3,
            keywords: [],
            secondary_emotions: []
          },
          empathy_response: '마음이 편하지 않으시군요. 어떤 일이 있었는지 더 이야기해주시겠어요?',
          follow_up_questions: ['어떤 부분이 가장 힘드신가요?'],
          care_level: 'medium',
          suggested_actions: ['깊게 숨을 들이마시고 내쉬어보세요']
        },
        rawResponse: null,
        usage: null,
        error: error.message
      };
    }
  }

  /**
   * CBT 기반 인지재구성 질문 생성
   */
  async generateCBTQuestions(emotionAnalysis, context = {}) {
    const systemPrompt = `당신은 CBT(인지행동치료) 전문가입니다. 사용자의 감정과 생각을 건강하게 재구성할 수 있도록 도와주는 질문들을 생성합니다.

CBT 원칙:
- 자동적 사고 패턴 인식
- 생각과 감정의 연결고리 발견
- 객관적 증거 탐색
- 대안적 관점 제시
- 행동 변화 유도

사용자 감정 정보:
주요 감정: ${emotionAnalysis.primary_emotion}
강도: ${emotionAnalysis.intensity}/5
키워드: ${emotionAnalysis.keywords?.join(', ')}

응답 형식 (JSON):
{
  "cbt_questions": [
    {
      "step": "사고 인식",
      "question": "구체적인 질문 내용",
      "purpose": "이 질문의 목적 설명"
    },
    {
      "step": "증거 탐색", 
      "question": "구체적인 질문 내용",
      "purpose": "이 질문의 목적 설명"
    },
    {
      "step": "대안 탐색",
      "question": "구체적인 질문 내용", 
      "purpose": "이 질문의 목적 설명"
    }
  ],
  "reflection_prompt": "마무리 성찰을 위한 종합적 질문",
  "homework": "다음에 시도해볼 수 있는 간단한 과제"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `위 감정 상황에 맞는 CBT 질문들을 생성해주세요.` }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.6,
        maxTokens: 600
      });

      if (result.success) {
        const parsedData = JSON.parse(result.data);
        return {
          success: true,
          questions: parsedData,
          error: null
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      devUtils.log('CBT Questions Error:', error);
      
      return {
        success: false,
        questions: {
          cbt_questions: [
            {
              step: "사고 인식",
              question: "지금 이 감정을 느끼게 한 구체적인 생각은 무엇인가요?",
              purpose: "자동적 사고 패턴을 인식합니다"
            }
          ],
          reflection_prompt: "이런 상황에서 나에게 도움이 되는 생각은 무엇일까요?",
          homework: "오늘 하루 긍정적인 순간을 하나 기록해보세요"
        },
        error: error.message
      };
    }
  }

  /**
   * 개인화된 위로 메시지 생성
   */
  async generateComfortMessage(userProfile, currentEmotion) {
    const systemPrompt = `당신은 사용자를 잘 아는 친한 친구입니다. 개인의 특성을 고려하여 맞춤형 위로 메시지를 작성합니다.

사용자 정보:
${userProfile ? `
- 성향: ${userProfile.personality || '정보 없음'}
- 선호 위로 방식: ${userProfile.comfort_style || '정보 없음'}
- 관심사: ${userProfile.interests?.join(', ') || '정보 없음'}
- 최근 패턴: ${userProfile.recent_patterns || '정보 없음'}
` : '프로필 정보 없음'}

현재 감정: ${currentEmotion}

지침:
- 50-100자 내외의 간결하면서도 따뜻한 메시지
- 사용자의 특성을 반영한 개인화된 표현
- 강요하지 않는 부드러운 톤
- 구체적이고 실용적인 조언 포함`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '지금 상황에 맞는 위로 메시지를 작성해주세요.' }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.9,
        maxTokens: 200
      });

      return {
        success: result.success,
        message: result.data?.replace(/"/g, '') || '당신의 마음을 이해합니다. 함께 이겨내봐요.',
        error: result.error
      };

    } catch (error) {
      devUtils.log('Comfort Message Error:', error);
      
      return {
        success: false,
        message: '힘든 시간이시군요. 당신의 감정을 이해하고 있어요. 조금씩 나아질 거예요.',
        error: error.message
      };
    }
  }

  /**
   * 감정 패턴 인사이트 생성
   */
  async generateEmotionInsights(emotionHistory) {
    const systemPrompt = `당신은 감정 패턴 분석 전문가입니다. 사용자의 감정 기록을 분석하여 유용한 인사이트를 제공합니다.

분석 관점:
- 감정 변화 트렌드
- 반복되는 패턴
- 촉발 요인
- 회복 패턴
- 성장 포인트

응답 형식 (JSON):
{
  "insights": [
    {
      "title": "인사이트 제목",
      "description": "구체적인 설명",
      "type": "trend/pattern/trigger/recovery/growth"
    }
  ],
  "recommendations": ["구체적인", "개선 제안들"],
  "positive_changes": ["긍정적", "변화들"],
  "next_focus": "다음에 집중할 점"
}`;

    const emotionSummary = emotionHistory.map(emotion => 
      `${emotion.created_at}: ${emotion.primary_emotion} (강도: ${emotion.intensity})`
    ).join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `감정 기록:\n${emotionSummary}\n\n위 데이터를 바탕으로 인사이트를 제공해주세요.` }
    ];

    try {
      const result = await this.callGPT(messages, {
        temperature: 0.5,
        maxTokens: 800
      });

      if (result.success) {
        const parsedData = JSON.parse(result.data);
        return {
          success: true,
          insights: parsedData,
          error: null
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      devUtils.log('Emotion Insights Error:', error);
      
      return {
        success: false,
        insights: {
          insights: [
            {
              title: "꾸준한 기록",
              description: "감정을 기록하는 습관이 자기 이해에 도움이 되고 있어요.",
              type: "growth"
            }
          ],
          recommendations: ["계속해서 감정을 솔직하게 기록해보세요"],
          positive_changes: ["자기 인식이 향상되고 있어요"],
          next_focus: "감정의 원인을 더 구체적으로 탐색해보세요"
        },
        error: error.message
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const openAIService = new OpenAIService();
export default openAIService;