import { APIRequestAxios } from './api.js'
import { generateRegisterUserData } from './helpers.js' 

const switchClients = () => {
  if (typeof process.env.APICLIENT === 'undefined') return APIRequestAxios
  switch (process.env.APICLIENT.toLowerCase()) {
    case 'axios':
      return APIRequestAxios
    default:
      APIRequestAxios
  }
}

const APIRequest = switchClients()

export const registerUser = async (email, password, username) => {
  const response = await APIRequest({
    path: '/users',
    method: 'POST',
    body:
      {
        user: {
          email,
          password,
          username
        }
      }
  })
  if (response.status === 200) process.env.TOKEN = response.body.user.token
  return response
}

export const getCurrentUser = () => {
  return APIRequest({ path: '/user' })
}

export const updateCurrentUser = async (paramsToUpdate) => {
  const response = await APIRequest({
    path: '/user',
    method: 'PUT',
    body: { user: paramsToUpdate }
  })
  if (response.status === 200) process.env.TOKEN = response.body.user.token
  return response
}

export const login = (email, password) => {
  return APIRequest({
    path: '/users/login',
    method: 'POST',
    body:
      {
        user: {
          email,
          password,
        }
      }
  })
}

export const getArticles = (params) => {
  return APIRequest({ path: '/articles', params })
}

export const createArticle = (title, description, body, tagList) => {
  return APIRequest({
    path: '/articles',
    method: 'POST',
    body:
      {
        article: {
          title,
          description,
          body,
          tagList
        }
      }
  })
}

export const registerAndLoginAsTestUser = async () => {
  const registerData = generateRegisterUserData()
  await registerUser(...Object.values(registerData))
  await login(registerData.email, registerData.password)
  return { ...registerData, token: process.env.TOKEN }
}
