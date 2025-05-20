const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const { userId, planId, title, steps } = body;

  // 필수 값 검증
  if (!userId || !planId || !title || !Array.isArray(steps)) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({ success: false, message: 'Missing fields' }),
    };
  }

  const params = {
    TableName: 'UserPlans',
    Item: {
      userId,
      planId,
      title,
      steps, // [{ id, content, isComplete }]
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await db.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Plan saved',
        planId,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
