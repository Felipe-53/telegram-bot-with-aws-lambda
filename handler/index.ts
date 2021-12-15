import axios from 'axios'
import assert from 'assert'
import {
  APIGatewayProxyHandler
} from 'aws-lambda'

const botToken = process.env?.TOKEN
if (!botToken) {
  throw Error('Could not access environment variables')
}

const handler: APIGatewayProxyHandler = async (event, context) => {
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
  
  return {
    statusCode: 200,
    body: 'ok'
  }
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

export { handler }
