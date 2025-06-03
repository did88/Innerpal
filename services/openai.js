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
        model: 'gpt-3.5-turbo',
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
      return emotionResult;
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return null;
    }

  } catch (err) {
    console.error('감정 분석 오류:', err);
    return null;
  }
};