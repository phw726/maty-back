const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.data.choices?.[0]?.message?.content ?? '';
    return {
      statusCode: 200,
       headers: corsHeaders,
      body: JSON.stringify({ result }),
    };
  } catch (e) {
    console.error('AI Error:', e);
    return {
      statusCode: 500,
        headers: corsHeaders,
      body: JSON.stringify({ error: 'AI 응답 실패' }),
    };
  }
};
