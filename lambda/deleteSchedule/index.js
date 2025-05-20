const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient()

exports.handler = async event => {
	try {
		const {userId, date, scheduleId} = JSON.parse(event.body)

		const result = await db
			.get({
				TableName: 'CalendarData',
				Key: {userId, date}
			})
			.promise()

		const current = result.Item || {}
		const schedules = current.schedule || []
		const filtered = schedules.filter(s => s.id !== scheduleId)

		await db
			.update({
				TableName: 'CalendarData',
				Key: {userId, date},
				UpdateExpression: 'SET schedule = :schedule',
				ExpressionAttributeValues: {
					':schedule': filtered
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
			body: JSON.stringify({success: true, message: 'Schedule deleted'})
		}
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({success: false, message: e.message})
		}
	}
}
