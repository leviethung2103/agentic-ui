export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  status: "active" | "inactive"
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role: "admin" | "user"
}

export interface UpdateUserData {
  username?: string
  email?: string
  role?: "admin" | "user"
  status?: "active" | "inactive"
}

export interface ResetPasswordData {
  userId: string
  newPassword: string
}

export type SortField = "username" | "email" | "role" | "status" | "lastLogin" | "createdAt"
export type SortDirection = "asc" | "desc"

export interface UserFilters {
  search: string
  role: "all" | "admin" | "user"
  status: "all" | "active" | "inactive"
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}
