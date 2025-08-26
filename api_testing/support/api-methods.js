import { APIRequestAxios } from './api.js'

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
  return APIRequest('/users', 'POST',
    {
      user: {
        email,
        password,
        username
      }
    }
  )
}