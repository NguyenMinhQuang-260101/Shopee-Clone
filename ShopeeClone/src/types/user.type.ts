type Role = 'User' | 'Admin'

export default interface User {
  _id: string
  roles: Role[]
  email: string
  name?: string
  date_of_birth?: string //ISO 8601 format
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
}
