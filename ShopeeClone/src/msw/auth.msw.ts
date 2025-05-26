import { http, HttpResponse } from 'msw'
import config from '../constants/config'
import { HttpStatusCode } from 'axios'

export const access_token_1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTI2VDA0OjAwOjA2Ljc5NVoiLCJpYXQiOjE3NDgyMzIwMDYsImV4cCI6MTc0OTIzMjAwNX0.gpSsNRd-QWWHxEnQHyUT3GdDYrFchEvCUznjVcDtCNM'
export const refresh_token_1000days =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTI2VDA0OjAwOjA2Ljc5NVoiLCJpYXQiOjE3NDgyMzIwMDYsImV4cCI6MTgzNDYzMjAwNn0.YGuyEzw0DIKqsfj40xMxKkH7AdkhJeT_XQ_sePv4FXU'

const loginRes = {
  message: 'Đăng nhập thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTI2VDA0OjAwOjA2Ljc5NVoiLCJpYXQiOjE3NDgyMzIwMDYsImV4cCI6MTc0OTIzMjAwNX0.gpSsNRd-QWWHxEnQHyUT3GdDYrFchEvCUznjVcDtCNM',
    expires: 999999,
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTI2VDA0OjAwOjA2Ljc5NVoiLCJpYXQiOjE3NDgyMzIwMDYsImV4cCI6MTgzNDYzMjAwNn0.YGuyEzw0DIKqsfj40xMxKkH7AdkhJeT_XQ_sePv4FXU',
    expires_refresh_token: 86400000,
    user: {
      _id: '68072eae216ca4033ed12bbf',
      roles: ['User'],
      email: 'quang03@gmail.com',
      createdAt: '2025-04-22T05:52:46.146Z',
      updatedAt: '2025-04-22T05:52:46.146Z',
      __v: 0
    }
  }
}

const refreshTokenRes = {
  message: 'Refresh Token thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTI2VDA2OjMxOjM4LjQyNFoiLCJpYXQiOjE3NDgyNDEwOTgsImV4cCI6MTc0ODg0NTg5OH0.MWZW3AHuO0hsqitnTm2znQO27NbFlfYbkN9L4O_-ao4'
  }
}

const loginRequest = http.post(`${config.baseUrl}login`, () => {
  return HttpResponse.json(loginRes, {
    status: HttpStatusCode.Ok
  })
})

const refreshToken = http.post(`${config.baseUrl}refresh-access-token`, () => {
  return HttpResponse.json(refreshTokenRes, {
    status: HttpStatusCode.Ok
  })
})

const authRequests = [loginRequest, refreshToken]

export default authRequests
