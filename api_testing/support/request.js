import 'dotenv/config'
import axios from 'axios'
import got from 'got'
import logger from './logger.js'

const apiBaseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_PREFIX}`
const requestTimeout = 10_000

function getCallData(path, params, method, body, responseOrError, isError = false) {
  const responseData = isError ? responseOrError.response || null : responseOrError
  const callData = {
    message: isError ? responseOrError.message || 'Unknown error' : '',
    request: {
      path: path,
      method: method,
      body: body || null,
      params: params || null,
    },
    response: {
      statusCode: responseData?.status || responseOrError?.code || 'Unknown',
      status: responseData?.statusText || 'Unknown',
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
      timeout: requestTimeout,
    })
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
    timeout: { request: requestTimeout }
  }
  if (method !== 'GET' && Object.keys(body).length > 0) {
    requestOptions.json = body
  }
  const responseData = await got(requestOptions)
    .catch(error => {
      if (error.response) {
        return error.response
      } else throw error
    })
  const response = {
    statusCode: responseData.statusCode,
    body: responseData.body ? JSON.parse(responseData.body) : undefined
  }
  return response
}

const getBaseRequest = () => {
  if (!process.env.APICLIENT) return apiRequestAxios
  switch (process.env.APICLIENT.toLowerCase()) {
    case 'axios':
      return apiRequestAxios
    case 'got':
      return apiRequestGot
    default:
      return apiRequestAxios
  }
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
