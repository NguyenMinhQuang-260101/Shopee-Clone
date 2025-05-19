import axios, { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import config from '../constants/config'
import path from '../constants/path'
import { AuthResponse } from '../types/auth.type'
import { clearLocalStorage, getAccessTokenFromLS, setAccessTokenToLS, setProfileFromLS } from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS() //Nên khởi tao accessToken trong constructor vì lấy dữ liệu trong ram nhanh hơn
    this.instance = axios.create({
      baseURL: config.baseUrl,
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
        if (url === path.login || url === path.register) {
          const data = response.data.data
          this.accessToken = data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileFromLS(data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const message = (error.response?.data as { message?: string })?.message || error.message
          toast.error(message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLocalStorage()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
