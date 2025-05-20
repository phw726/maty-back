const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId, birthDate, birthTime, name, lunarType,currentJob, sajuResult } = JSON.parse(event.body);

    const params = {
      TableName: 'Users',
      Item: {
        userId,
        birthDate,
        birthTime,
        name: name || '',            // 선택사항
        lunarType: lunarType || 'solar', // 기본값
        currentJob: currentJob || '',
        sajuResult: sajuResult || '',
        updatedAt: new Date().toISOString()
      }
    };

    await db.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({ success: true, message: 'User profile saved' })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: e.message })
    };
  }
};
