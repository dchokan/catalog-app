export interface IApiError {
  error: string
}

export interface IApiSuccess {
  success: boolean
}

// the list endpoint envelope — consumers read `.data` for the rows
export interface IPaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
