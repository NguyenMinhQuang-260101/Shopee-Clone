import axios, { AxiosError, HttpStatusCode } from 'axios'
import config from '../constants/config'
import userImage from '../assets/images/user.svg'
import { ErrorResponse } from '../types/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data.data?.name === 'EXPIRED_TOKEN'
  )
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

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}

// * Dùng trong trường hợp server trả về avatar chỉ có tên
// * Còn nếu server trả về url thì không cần dùng hàm này3
export const getAvatarUrl = (avatarName?: string) => {
  if (avatarName) {
    if (!avatarName.includes(config.baseUrl)) {
      return `${config.baseUrl}images/${avatarName}`
    } else return avatarName
  }
  return userImage
}
