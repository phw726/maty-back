const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId, date, content } = JSON.parse(event.body);

    // ✅ 1. 빈 다이어리 방지
    if (!content || content.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: '내용이 비어있습니다.' })
      };
    }

    const params = {
      TableName: 'CalendarData',
      Key: { userId, date },
      UpdateExpression: 'SET #diary = :diary',
      ExpressionAttributeNames: {
        '#diary': 'diary'
      },
      ExpressionAttributeValues: {
        ':diary': {
          content: content,
          updatedAt: new Date().toISOString() // ✅ 2. 저장 시간 추가
        }
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
      body: JSON.stringify({ success: true, message: 'Diary updated!' })
    };
  } catch (error) {
    console.error('Error updating diary:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal Server Error' })
    };
  }
};
