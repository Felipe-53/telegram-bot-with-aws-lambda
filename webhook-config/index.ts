import assert from 'assert'
import axios from 'axios'
import { config } from 'dotenv'

const result = config()
if (result.error) {
  throw Error('failed to load .env file')
}

async function setWebhook() {
  const resp = await axios({
    url: buildTelegramUrlEndpoint('setWebhook'),
    method: 'POST',
    data: {
      url: `${getWebhookUrl()}/?token=${getToken()}`
    }
  })

  console.log(resp.data)
}

async function getWebhookInfo() {
  const resp = await axios({
    url: buildTelegramUrlEndpoint('getWebhookInfo'),
    method: 'GET'
  })

  console.log(resp.data)
}

const map = {
  setWebhook,
  getWebhookInfo
}

async function main() {
  const option = process.argv[2]
  if (!option) {
    throw Error('Command line argument not provided')
  }
  assert(option === 'setWebhook' || option === 'getWebhookInfo')

  await map[option]()
}

function getToken() {
  if (!process.env.TOKEN) {
    throw Error('Failed to load TOKEN key from environment')
  } 
  const botToken = process.env.TOKEN
  return botToken
}

function getWebhookUrl() {
  if (!process.env.WEBHOOK_URL) {
    throw Error('Failed to load WEBHOOK_URL key from environment')
  } 
  const webhookUrl = process.env.WEBHOOK_URL
  return webhookUrl
}

function buildTelegramUrlEndpoint(endpoint: string) {
  const token = getToken()
  return `https://api.telegram.org/bot${token}/${endpoint}`
}

main()
.catch(err => {
  console.log(err)
  process.exit(1)
})
