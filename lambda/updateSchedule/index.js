const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId, date, schedule } = JSON.parse(event.body);

    if (!schedule?.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'schedule.id is required' })
      };
    }

    // 기존 데이터 조회
    const result = await db
      .get({
        TableName: 'CalendarData',
        Key: { userId, date }
      })
      .promise();

    const current = result.Item || {};
    const schedules = current.schedule || [];

    const existingIndex = schedules.findIndex((s) => s.id === schedule.id);
    let newSchedules;

    // ✅ isAllDay 처리: 시간 필드 포함 여부 결정
    const { isAllDay, ...rest } = schedule;
    const cleanedSchedule = {
      ...rest,
      isAllDay,
      ...(isAllDay ? {} : {
        startTime: schedule.startTime,
        endTime: schedule.endTime
      })
    };

    if (existingIndex >= 0) {
      // ✅ Update
      schedules[existingIndex] = {
        ...schedules[existingIndex],
        ...cleanedSchedule
      };
      newSchedules = schedules;
    } else {
      // ✅ Create
      newSchedules = [...schedules, cleanedSchedule];
    }

    // 저장
    await db
      .update({
        TableName: 'CalendarData',
        Key: { userId, date },
        UpdateExpression: 'SET schedule = :schedule',
        ExpressionAttributeValues: {
          ':schedule': newSchedules
        }
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',

      },
      body: JSON.stringify({
        success: true,
        message: 'Schedule saved (add or update)'
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: e.message })
    };
  }
};
