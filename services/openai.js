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
  const systemPrompt = `당신은 CBT(인지행동치료) 원칙을 따르는 AI 상담가입니다. 사용자의 감정 상태를 존중하며 긍정적인 경험에는 따뜻하게 공감하고 격려해주세요. 부정적 자동사고가 드러날 때만 "왜 그렇게 생각하나요?", "다른 가능성은 없을까요?"와 같은 소크라틱 질문을 사용해 스스로 대안을 찾도록 돕습니다. 항상 존중하는 태도를 유지하고, 작은 행동 실험을 제안하며 필요하면 전문가의 도움을 안내해주세요.`;

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
 * 변화 코칭 대화 생성
 * @param {Array<{role: string, content: string}>} messages 대화 기록
 * @returns {Promise<{success: boolean, data?: string}>}
 */
export const coachingTalk = async (messages = []) => {
  const systemPrompt = `당신은 사용자가 자신의 감정을 표현하고 원인을 탐색할 수 있도록 돕는 코칭 전문가입니다. 대화는 "감정 표현 → 원인 탐색 → 변화 제안" 순서로 진행합니다. "혹시 어떤 욕구가 충족되지 않아서일까요?"와 같이 욕구를 살피는 질문을 사용하고, 사용자의 말에 "항상 그래야 한다"와 같은 고정관념이 보이면 부드럽게 알려주세요. 마지막에는 작은 행동 변화를 제안하여 대화를 마무리합니다.`;

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
    console.error('coachingTalk 오류:', err);
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

export default {
  getEmotionSummary,
  innerTalk,
  coachingTalk,
  generateCBTInsights,
};
