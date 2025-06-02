  // 실제 GPT API 호출 함수
  const analyzeEmotionWithGPT = async (emotionText) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `당신은 Innerpal의 AI 친구입니다. 사용자의 감정을 이해하고 공감하는 따뜻한 동반자 역할을 합니다.

역할과 특성:
- 한국어로 자연스럽고 따뜻하게 대화
- 감정을 판단하지 않고 있는 그대로 받아들임
- 구체적이고 개인적인 공감 표현 사용
- 필요시 부드러운 질문으로 대화 유도
- 전문적 상담이 필요한 경우 권유

응답 형식 (JSON):
{
  "emotion_analysis": {
    "primary_emotion": "주요 감정 (joy/sadness/anger/fear/surprise/disgust/neutral)",
    "intensity": "강도 (1-5)",
    "keywords": ["감정을", "나타내는", "키워드들"],
    "secondary_emotions": ["부차적", "감정들"]
  },
  "empathy_response": "공감과 위로의 응답 메시지 (100-200자)",
  "follow_up_questions": ["더 깊은", "대화를 위한", "질문들 (최대 2개)"],
  "care_level": "관심 필요 정도 (low/medium/high)",
  "suggested_actions": ["도움이 될", "행동 제안들"]
}`
            },
            {
              role: 'user',
              content: emotionText
            }
          ],
          max_tokens: 800,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const data = await response.json();
      const gptResponse = data.choices[0].message.content;
      
      try {
        // JSON 파싱 시도
        const parsedResponse = JSON.parse(gptResponse);
        return parsedResponse;
      } catch (parseError) {
        // JSON 파싱 실패 시 기본 응답 생성
        console.log('JSON 파싱 실패, 원본 응답:', gptResponse);
        
        // 간단한 키워드 기반 감정 분석 (백업)
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

        return {
          emotion_analysis: {
            primary_emotion: detectedEmotion,
            intensity: Math.min(5, Math.floor(emotionText.length / 20) + 2),
            keywords: emotions[detectedEmotion] || [],
            secondary_emotions: []
          },
          empathy_response: gptResponse, // GPT의 원본 응답 사용
          follow_up_questions: ["더 자세히 이야기해주세요"],
          care_level: "medium",
          suggested_actions: ["깊게 숨을 들이마시고 내쉬어보세요"]
        };
      }

    } catch (error) {
      console.error('GPT API 호출 오류:', error);
      
      // API 오류 시 폴백 응답
      return {
        emotion_analysis: {
          primary_emotion: 'neutral',
          intensity: 3,
          keywords: [],
          secondary_emotions: []
        },
        empathy_response: '죄송해요, 지금 잠시 생각이 정리되지 않네요. 조금 더 구체적으로 말씀해주시면 더 잘 도와드릴 수 있을 것 같아요.',
        follow_up_questions: ['어떤 부분이 가장 마음에 걸리시나요?'],
        care_level: 'medium',
        suggested_actions: ['잠시 휴식을 취해보세요']
      };
    }
  };