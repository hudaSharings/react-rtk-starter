export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER' | 'MANAGER'
  createdAt: string
}

export interface UserFormData {
  name: string
  email: string
  role: 'ADMIN' | 'USER' | 'MANAGER'
}