import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearLocalStorage,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileFromLS,
  setRefreshTokenToLS
} from '../auth'
import User from '../../types/user.type'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGIxYjEzMjE2Y2E0MDMzZWQxMmUxNSIsImVtYWlsIjoicXVhbmcwNUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTIxVDAyOjM1OjUxLjYyM1oiLCJpYXQiOjE3NDc3OTQ5NTEsImV4cCI6MTc0Nzc5ODU1MX0.ubZnNJ5BytOoz9-ESDX7ig-gxL6W9jA5oM-ujX7n_5o'

const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGIxYjEzMjE2Y2E0MDMzZWQxMmUxNSIsImVtYWlsIjoicXVhbmcwNUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTIxVDAyOjM1OjUxLjYyM1oiLCJpYXQiOjE3NDc3OTQ5NTEsImV4cCI6MTc0Nzg4MTM1MX0.A0aV4pKJYby-oE2i0sDoLG4JrkJ8UKdXRQIeiyf0rjA'

const profile: User = {
  _id: '680b1b13216ca4033ed12e15',
  roles: ['User'],
  email: 'quang05@gmail.com',
  createdAt: '2025-04-25T05:18:11.302Z',
  updatedAt: '2025-05-16T06:37:27.670Z',
  address: 'Hoc Mon district',
  avatar: 'https://api-ecom.duthanhduoc.com/images/3d36a809-6f3a-4bf9-a997-26b5de53fa8c.jpg',
  date_of_birth: '2001-01-25T17:00:00.000Z',
  name: 'Nguyễn Minh Quang 2',
  phone: '987654321'
}

describe('access_token', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('access_token được set vào LocalStorage', () => {
    setAccessTokenToLS(access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })
})

describe('refresh_token', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('refresh_token được set vào LocalStorage', () => {
    setRefreshTokenToLS(refresh_token)
    expect(getRefreshTokenFromLS()).toEqual(refresh_token)
  })
})

describe('setProfileFromLS', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('set profile vào LocalStorage', () => {
    setProfileFromLS(profile)
    expect(getProfileFromLS()).toEqual(JSON.parse(JSON.stringify(profile)))
  })
})

describe('clearLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('Xóa access_token, refresh_token và profile khỏi LocalStorage', () => {
    setAccessTokenToLS(access_token)
    setRefreshTokenToLS(refresh_token)
    setProfileFromLS(profile)
    clearLocalStorage()
    expect(getAccessTokenFromLS()).toBe('')
    expect(getRefreshTokenFromLS()).toBe('')
    expect(getProfileFromLS()).toBeNull()
  })
})
