import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig 
} from 'axios'

export class BaseApiService {
  protected axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.initializeInterceptors()
  }

  private initializeInterceptors() {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  protected async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, { params })
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  protected async post<T, D = unknown>(url: string, data: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(url, data)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  }
}