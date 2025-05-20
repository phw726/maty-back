const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient()

exports.handler = async event => {
	try {
		const {userId, date, todoId} = JSON.parse(event.body)

		const result = await db
			.get({
				TableName: 'CalendarData',
				Key: {userId, date}
			})
			.promise()

		const current = result.Item || {}
		const todos = current.todos || []

		const updatedTodos = todos.map(todo =>
			todo.id === todoId ? {...todo, isComplete: !todo.isComplete} : todo
		)

		await db
			.update({
				TableName: 'CalendarData',
				Key: {userId, date},
				UpdateExpression: 'SET todos = :todos',
				ExpressionAttributeValues: {
					':todos': updatedTodos
				}
			})
			.promise()

		return {
			statusCode: 200,
			headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
		    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
			},
			body: JSON.stringify({success: true, message: 'Todo toggled!'})
		}
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({success: false, message: e.message})
		}
	}
}
