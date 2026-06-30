export interface IApiError {
  error: string
}

export interface IApiSuccess {
  success: boolean
}

export interface IPaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
