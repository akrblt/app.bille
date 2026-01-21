import axios from 'axios'
import UserConnexion from '../helpers/user-connexion'

const client = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
})

// 🔐 JWT interceptor
client.interceptors.request.use(
  (config) => {
    //const user = UserConnexion.getUserData()
    const token = UserConnexion.getUserData()?.token
    console.log('Authorization TOKEN:', token) // debug

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }
  //(error) => Promise.reject(error)
)

const handle = async (promise: Promise<any>) => {
  try {
    const res = await promise
   return { status: 'success', data: res.data }
  } catch (e: any) {
    console.error('HTTP ERROR:', e.response)
  return {
     status: 'fail',
     error: e.response?.data?.error || e.response?.data?.msg || `HTTP ${e.response?.status}`,
    }
  }
}

export default {
  get: (url: string) => handle(client.get(url)),
  post: (url: string, body: any) => handle(client.post(url, body)),
}
