import 'dotenv/config'
import axios from 'axios'
import got from 'got'
import logger from './logger.js'

const apiBaseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_PREFIX}`

function getCallData(path, params, method, body, responseOrError, isError = false) {
  const responseData = isError ? responseOrError.response || null : responseOrError
  const callData = {
    message: isError ? responseOrError.message || 'Unknown error' : '',
    request: {
      path: path,
      method: method,
      body: Object.keys(body).length ? body : null,
      params: params || null,
    },
    response: {
      statusCode: responseData?.status || responseData?.statusCode || responseOrError?.code || 'Unknown',
      status: responseData?.statusText || responseData?.statusMessage || 'Unknown',
      body: responseData?.data || responseData?.body || null,
    },
  }
  if (!isError) delete callData.message
  return callData
}

const apiRequestAxios = async ({ path, method = 'GET', body = {}, params }) => {
  let response
  try {
    response = await axios({
      method,
      params,
      url: `${apiBaseUrl}${path}`,
      headers: {
        Authorization: process.env.TOKEN ? `Token ${process.env.TOKEN}` : '',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: body,
      timeout: process.env.API_TIMEOUT || 10_000,
    })
    console.log('AXIOS')
    return getCallData(path, params, method, body, response)
  } catch(error) {
    throw getCallData(path, params, method, body, error, true)
  }
}

const apiRequestGot = async ({ path, method = 'GET', body = {}, params }) => {
  const requestOptions = {
    method,
    searchParams: params,
    url: `${apiBaseUrl}${path}`,
    headers: {
      Authorization: process.env.TOKEN ? `Token ${process.env.TOKEN}` : '',
      'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: { request: +process.env.API_TIMEOUT || 10_000 }
  }
  if (method !== 'GET' && Object.keys(body).length > 0) {
    requestOptions.json = body
  }
  let response
  try {
    response = await got(requestOptions)
    console.log('GOT')

    if (response.body) response.body = JSON.parse(response.body)
    return getCallData(path, params, method, body, response)
  } catch(error) {
    if (error.response?.body) error.response.body = JSON.parse(error.response.body)
    throw getCallData(path, params, method, body, error, true)
  }
}

const getBaseRequest = () => {
  if (process.env.API_CLIENT && process.env.API_CLIENT.toLowerCase() === 'got') {
    return apiRequestGot
  }
  return apiRequestAxios
}

export default async function(callArgs, successMsg, errorMsg) {
  let callData
  const context = new Error().stack
    .split('\n')[2]
    .trim()
    .match(/at (\w+)/)[1]
  try {
    callData = await getBaseRequest()(callArgs)
    logger.info(successMsg, callData, context)
  } catch (errorData) {
    callData = errorData
    logger.error(`${errorMsg}: ${errorData.message}`, errorData, context)
  }
  return callData.response
}
