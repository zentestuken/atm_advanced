import apiRequest from './request.js'
import { generateRegisterUserData } from './helpers.js'

export const registerUser = async (email, password, username) => {
  const response = await apiRequest({
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
  return apiRequest({ path: '/user' })
}

export const updateCurrentUser = async (paramsToUpdate) => {
  const response = await apiRequest({
    path: '/user',
    method: 'PUT',
    body: { user: paramsToUpdate }
  })
  if (response.status === 200) process.env.TOKEN = response.body.user.token
  return response
}

export const login = (email, password) => {
  return apiRequest({
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
  return apiRequest({ path: '/articles', params })
}

export const getArticleBySlug = (slug) => {
  return apiRequest({ path: `/articles/${slug}` })
}

export const createArticle = (title, description, body, tagList) => {
  return apiRequest({
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

export const deleteArticle = (slug) => {
  return apiRequest({ path: `/articles/${slug}`, method: 'DELETE' })
}

export const registerAndLoginAsTestUser = async () => {
  const registerData = generateRegisterUserData()
  await registerUser(...Object.values(registerData))
  await login(registerData.email, registerData.password)
  return { ...registerData, token: process.env.TOKEN }
}
