import { BaseApiService } from './api/baseApi'
import { User, UserFormData } from '../types/user'

class UserService extends BaseApiService {
  constructor() {
    super('/api/users')
  }

  async getUsers(params: {
    page?: number
    pageSize?: number
    search?: string
    sortField?: string
    sortOrder?: 'asc' | 'desc'
  } = {}) {
    return this.get<{
      users: User[]
      total: number
    }>('/', { params })
  }

  async createUser(userData: UserFormData) {
    return this.post<User>('/', userData)
  }

  async updateUser(id: string, userData: UserFormData) {
    return this.post<User>(`/${id}`, userData)
  }

  async deleteUser(id: string) {
   // return this.post<void>(`/${id}/delete`)
  }
}

export const userService = new UserService()