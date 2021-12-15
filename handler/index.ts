import axios from 'axios'
import assert from 'assert'
import {
  APIGatewayProxyHandler
} from 'aws-lambda'

const botToken = process.env?.TOKEN
if (!botToken) {
  throw Error('Could not access `TOKEN` environment variable')
}

const handler: APIGatewayProxyHandler = async (event, context) => {
  // Handling Authentication
  try {
    assert(event.queryStringParameters?.token)
  } catch {
    return buildResponse({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  const queryStringToken = event.queryStringParameters.token

  try {
    assert(queryStringToken === botToken)
  } catch {
      return buildResponse({
        statusCode: 403,
        message: 'Forbidden'
      })
  }


  assert(event.body, 'Empty request body')
  const body = JSON.parse(event.body)

  // Take a look at the Telegram Bot Api to know more!
  // https://core.telegram.org/bots/api#update
  const chatId = body.message.chat.id
  assert(typeof chatId  === 'number')

  const responseData = await sendMessageTo('Hello, there!', chatId)
  try {
    // Again, check Telegram Bot Api:
    // https://core.telegram.org/bots/api#making-requests
    // "The response contains a JSON object, which always has a Boolean field 'ok'"
    assert(responseData.ok === true)
  } catch {
    console.warn('Unsuccessful request', 'Reponse:', '\n', responseData)
  }
  
  return buildResponse({
    statusCode: 200,
    message: 'ok'
  })
}

async function sendMessageTo(message: string, chat_id: number) {
  const response = await axios({
    method: 'POST',
    url: `https://api.telegram.org/bot${botToken}/sendMessage`,
    data: {
      text: message,
      chat_id 
    }
  })

  // the response payload
  return response.data
}

interface BuildResponseParams {
  statusCode: number,
  message: string
}

function buildResponse({
  statusCode,
  message
}: BuildResponseParams) {
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode,
    body: JSON.stringify({
      msg: message
    })
  }
}

export { handler }
