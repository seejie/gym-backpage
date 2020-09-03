import axios from 'axios'
import settings from '@/settings'
import { getUserToken } from '@/utils/storage'

const service = axios.create({
  baseURL: settings.baseUrl,
  method: 'get',
  responseType: 'blob',
  timeout: 5000, // request timeout
  headers: {
    idfv: 'backend',
    authorization: getUserToken() || '',
  },
})
service.interceptors.response.use(
  (response, aa) => {
    return new Promise((resolve, reject) => {
      if (typeof FileReader === 'undefined') {
        return reject({ message: 'not support FileReader' })
      }
      let reader = new FileReader()
      reader.onload = e => {
        response.data = e.target.result
        resolve(response)
      }
      reader.onerror = e => {
        reject(e)
      }
      reader.readAsDataURL(response.data)
    })
  },
  error => {
    return Promise.reject(error)
  },
)

export default service
