import { BaseApiService } from './api/baseApi'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'USER' | 'MANAGER'
  }
}

class AuthService extends BaseApiService {
  constructor() {
    super('/api/auth')
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/login', credentials)
    
    // Store token
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    return response
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

export const authService = new AuthService()