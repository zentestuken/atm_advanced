import { apiBaseUrl } from '../config.js'
import axios from 'axios'

export const APIRequestAxios = async ({ path, method = 'GET', body = {}, params }) => {
  const responseData = await axios({
    method,
    params,
    url: `${apiBaseUrl}${path}`,
        headers: {
      Authorization: process.env.TOKEN ? `Token ${process.env.TOKEN}` : '',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    data: body
  }).catch(error => {
    return {
      status: error.response.status,
      body: error.response.data,
      error: error.response.data
    }
  })
  const response = {
    status: responseData.status,
    body: responseData.data,
    error: await responseData.error
  }
  if (responseData.status > 299 && typeof responseData.error === 'undefined') response.error = response.body
  console.log(`API request (Axios):
  path: ${path}
  params: ${JSON.stringify(params)}
  method: ${method}
  body: ${JSON.stringify(body)}
  --> Response status: ${response.status}
  --> Errors: ${JSON.stringify(response.error)}`)
  return response
}
