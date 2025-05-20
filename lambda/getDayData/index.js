const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient()

exports.handler = async event => {
	try {
		const {userId, date} = event.queryStringParameters

		const result = await db
			.get({
				TableName: 'CalendarData',
				Key: {userId, date}
			})
			.promise()

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',

			},
			body: JSON.stringify(result.Item || null)
		}
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({success: false, message: e.message})
		}
	}
}
