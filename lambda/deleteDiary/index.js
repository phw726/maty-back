const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
const { userId, date } = JSON.parse(event.body || '{}');

    if (!userId || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'userId와 date가 필요합니다.' })
      };
    }

    const params = {
      TableName: 'CalendarData',
      Key: { userId, date },
      UpdateExpression: 'REMOVE #diary',
      ExpressionAttributeNames: {
        '#diary': 'diary'
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await db.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',

      },
      body: JSON.stringify({ success: true, message: 'Diary deleted!' })
    };
  } catch (error) {
    console.error('Error deleting diary:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' })
    };
  }
};
