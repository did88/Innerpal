import { EMOTION_CONFIG } from '../utils/emotionConstants';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * 감정 분석 요청 함수
 * @param {string} text - 사용자가 입력한 감정 텍스트
 * @returns {Promise<Object|null>} 감정 비율 JSON 객체 또는 null
 */
export const getEmotionSummary = async (text) => {
  const systemPrompt = `
당신은 사용자의 감정을 분석해주는 전문가입니다. 사용자의 입력 문장에서 다음 7가지 감정 중 비율(0~100)을 추정해 JSON으로 반환하세요.
감정 종류: 기쁨, 슬픔, 분노, 두려움, 혐오, 놀람, 중립
반환 형식 (JSON): {
  "기쁨": 40,
  "슬픔": 10,
  "분노": 5,
  "두려움": 10,
  "혐오": 0,
  "놀람": 5,
  "중립": 30
}
단, 총합이 100이 되도록 하세요. 반환은 반드시 JSON 객체만 하세요.
  `.trim();

  try {
    const res = await global.fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `다음 문장을 분석해주세요:
"${text}"` },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('GPT 응답 없음');

    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    const jsonText = content.slice(jsonStart, jsonEnd);

    try {
      const emotionResult = JSON.parse(jsonText);

      const KOR_TO_ENG = Object.fromEntries(
        Object.entries(EMOTION_CONFIG.NAMES).map(([en, ko]) => [ko, en])
      );
      const normalized = {};

      Object.keys(emotionResult).forEach(key => {
        const num = parseFloat(emotionResult[key]);
        const engKey = KOR_TO_ENG[key] || key;
        normalized[engKey] = Number.isNaN(num) ? 0 : num;
      });

      return normalized;
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return null;
    }

  } catch (err) {
    console.error('감정 분석 오류:', err);
    return null;
  }
};

/**
 * 대화형 AI 응답 생성
 * @param {Array<{role: string, content: string}>} messages 대화 기록
 * @returns {Promise<{success: boolean, data?: string}>}
 */
export const innerTalk = async (messages = []) => {
  const systemPrompt = '당신은 CBT(인지행동치료) 상담의 원칙을 따르는 AI 상담가입니다. 사용자의 부정적 자동사고(Automatic Thoughts)를 탐색하고, 스스로 목표를 설정하도록 돕습니다. 소크라틱 대화법을 활용해 “왜 그렇게 생각했는지”, “다른 가능성은 없는지”와 같은 질문을 던지며, 책임을 사용자에게 전가하지 않고 스스로 인지하도록 유도합니다. 또한 작은 행동 실험(Behavioral Experiments)을 제안해 실제 생활에서 변화를 경험하도록 안내합니다. 사용자의 감정과 상황을 요약·반영하면서 “당신의 상황이 어렵게 느껴질 수 있겠어요”와 같은 공감 표현을 포함합니다. 입력된 내용을 분석해 반복되는 사고 패턴이나 감정 변화 추세를 기록하고, 필요 시 전문 상담이나 의료기관의 도움을 받을 것을 안내합니다. 항상 사용자의 안전을 우선하며, AI가 전문 의료인의 역할을 완전히 대체하지 않음을 명확히 알립니다.';

  try {
    const res = await global.fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply ? { success: true, data: reply } : { success: false };
  } catch (err) {
    console.error('innerTalk 오류:', err);
    return { success: false };
  }
};

/**
 * CBT 세션 인사이트 생성
 * @param {Object} sessionData - 세션 데이터
 * @returns {Promise<{success: boolean, insights?: string}>}
 */
export const generateCBTInsights = async (sessionData) => {
  const systemPrompt = '다음 사용자의 CBT 세션 기록을 바탕으로 주요 인지 왜곡과 개선 방향을 간결하게 한국어로 요약해 주세요.';

  try {
    const res = await global.fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(sessionData) },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply ? { success: true, insights: reply } : { success: false };
  } catch (err) {
    console.error('generateCBTInsights 오류:', err);
    return { success: false };
  }
};

export default { getEmotionSummary, innerTalk, generateCBTInsights };
