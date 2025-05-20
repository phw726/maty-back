const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { userId, planId } = event.queryStringParameters || {};

  if (!userId || !planId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'userId and planId are required' }),
    };
  }

  try {
    const result = await db.get({
      TableName: 'UserPlans',
      Key: { userId, planId },
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Plan not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({ success: true, plan: result.Item }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: e.message }),
    };
  }
};
