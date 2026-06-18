export interface ApiError {
  error: string
}

export interface ApiSuccess {
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
