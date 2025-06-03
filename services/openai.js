const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const callGPT = async (messages = [], options = {}) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result };
    }

    return {
      success: true,
      data: result.choices[0].message.content.trim(),
      usage: result.usage,
    };
  } catch (error) {
    return { success: false, error };
  }
};

const innerTalk = async (messages = []) => {
  const systemPrompt = `당신은 사용자의 내면 친구입니다. 감정을 공감하며 생각을 깊이 있게 반영해주는 조력자입니다.`;

  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  return await callGPT(fullMessages, {
    temperature: 0.7,
    maxTokens: 500
  });
};

export default {
  innerTalk,
};
