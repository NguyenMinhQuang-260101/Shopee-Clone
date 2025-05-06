import axios, { AxiosError, HttpStatusCode } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(currency: number): string {
  return new Intl.NumberFormat('en-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number): string {
  return new Intl.NumberFormat('en-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(value).toLowerCase()
}

export function rateSale(original: number, sale: number): string {
  return Math.round(((original - sale) / original) * 100) + '%'
}
