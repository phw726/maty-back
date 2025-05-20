const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('🔥 Lambda Triggered! Event:', JSON.stringify(event));

  try {
    const { userId, date, todo } = JSON.parse(event.body);

    if (!todo?.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'todo.id is required' })
      };
    }

    // ✅ 필드명 일관성 처리 (isComplete로 저장)
    const normalizedTodo = {
      ...todo,
      isComplete: todo.isComplete ?? todo.completed
    };
    delete normalizedTodo.completed;

    const result = await db
      .get({
        TableName: 'CalendarData',
        Key: { userId, date }
      })
      .promise();

    const current = result.Item || {};
    const todos = current.todos || [];

    const existingIndex = todos.findIndex(t => t.id === normalizedTodo.id);
    let newTodos;

    if (existingIndex >= 0) {
      // ✅ Update
      todos[existingIndex] = {
        ...todos[existingIndex],
        ...normalizedTodo
      };
      newTodos = todos;
    } else {
      // ✅ Create
      newTodos = [...todos, normalizedTodo];
    }

    await db
      .update({
        TableName: 'CalendarData',
        Key: { userId, date },
        UpdateExpression: 'SET todos = :todos',
        ExpressionAttributeValues: {
          ':todos': newTodos
        }
      })
      .promise();

    console.log({ userId, date, todo });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Todo saved (add or update)'
      })
    };
  } catch (e) {
    console.error('Error updating todo:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: e.message })
    };
  }
};
