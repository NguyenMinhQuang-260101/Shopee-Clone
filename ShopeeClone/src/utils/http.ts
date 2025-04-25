import axios, { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse } from '../types/auth.type'
import { clearAccessTokenFromLS, getAccessTokenFromLS, saveAccessTokenToLS } from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS() //Nên khởi tao accessToken trong constructor vì lấy dữ liệu trong ram nhanh hơn
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      // Chuyển thành arrow function để gọi this
      (response: AxiosResponse<AuthResponse>) => {
        const { url } = response.config
        if (url === '/login' || url === '/register') {
          this.accessToken = response.data.data.access_token
          saveAccessTokenToLS(this.accessToken)
        } else if (url === '/logout') {
          this.accessToken = ''
          clearAccessTokenFromLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const message = (error.response?.data as { message?: string })?.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
