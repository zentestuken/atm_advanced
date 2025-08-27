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
  const response = await APIRequest('/users', 'POST',
    {
      user: {
        email,
        password,
        username
      }
    }
  )
  if (response.status === 200) process.env.TOKEN = response.body.user.token
  return response
}

export const getCurrentUser = () => {
  return APIRequest('/user', 'GET')
}

export const login = (email, password) => {
  return APIRequest('/users/login', 'POST',
    {
      user: {
        email,
        password,
      }
    }
  )
}

export const getAllArticles = () => {
  return APIRequest('/articles', 'GET')
}

export const createArticle = (title, description, body, tagList) => {
  return APIRequest('/articles', 'POST',
    {
      article: {
        title,
        description,
        body,
        tagList
      }
    }
  )
}

export const registerAndLoginAsTestUser = async () => {
  const registerData = generateRegisterUserData()
  await registerUser(...Object.values(registerData))
  await login(registerData.email, registerData.password)
  return { ...registerData, token: process.env.TOKEN }
}
