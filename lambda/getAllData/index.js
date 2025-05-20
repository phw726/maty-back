const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId } = event.queryStringParameters;

    const result = await db.query({
      TableName: 'CalendarData',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: {
        ':uid': userId
      }
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',

      },
      body: JSON.stringify(result.Items || [])
    };
  } catch (e) {
    console.error('Error fetching all data:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: e.message })
    };
  }
};
