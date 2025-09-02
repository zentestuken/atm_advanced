import config from '../config.js'
import axios from 'axios'
import got from 'got'

function logData(client, path, params, method, body, response) {
  console.log(`API request (${client}):
  path: ${path}
  params: ${JSON.stringify(params)}
  method: ${method}
  body: ${JSON.stringify(body)}
  --> Response status: ${response.status}
  --> Response body: ${JSON.stringify(response.body)}`)
}

const apiRequestAxios = async ({ path, method = 'GET', body = {}, params }) => {
  const responseData = await axios({
    method,
    params,
    url: `${config.apiBaseUrl}${path}`,
    headers: {
      Authorization: process.env.TOKEN ? `Token ${process.env.TOKEN}` : '',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    data: body,
    timeout: config.requestTimeout,
  }).catch(error => {
    if (error.response) {
      return error.response
    } else throw error
  })
  const response = {
    status: responseData.status,
    body: responseData.data,
  }
  // Data for debugging purposes
  logData('Axios', path, params, method, body, response)
  return response
}

const apiRequestGot = async ({ path, method = 'GET', body = {}, params }) => {
  const requestOptions = {
    method,
    searchParams: params,
    url: `${config.apiBaseUrl}${path}`,
    headers: {
      Authorization: process.env.TOKEN ? `Token ${process.env.TOKEN}` : '',
      'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: { request: config.requestTimeout }
  }
  if (method !== 'GET' && Object.keys(body).length > 0) {
    requestOptions.json = body
  }
  const responseData = await got(requestOptions).catch(error => {
    if (error.response) {
      return error.response
    } else throw error
  })
  const response = {
    status: responseData.statusCode,
    body: responseData.body ? JSON.parse(responseData.body) : undefined
  }
  // Data for debugging purposes
  logData('GOT', path, params, method, body, response)
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

export default getBaseRequest()