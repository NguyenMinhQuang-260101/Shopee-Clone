import { beforeEach, describe, expect, it } from 'vitest'
import { Http } from '../http'
import { HttpStatusCode } from 'axios'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

describe('http axios', () => {
  let http = new Http().instance

  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })
  const access_token_1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTIxVDA0OjM4OjQ0LjU5MVoiLCJpYXQiOjE3NDc4MDIzMjQsImV4cCI6MTc0NzgwMjMyNX0.5rgWjjlfaP9nLUbJRfg-6LbmtETaNeD-t830-ganjdU'
  const refresh_token_1y =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDcyZWFlMjE2Y2E0MDMzZWQxMmJiZiIsImVtYWlsIjoicXVhbmcwM0BnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTIxVDA0OjM4OjQ0LjU5MVoiLCJpYXQiOjE3NDc4MDIzMjQsImV4cCI6MTc3OTMzODMyNH0.8RdQRbIDMfGDDzcik2bQ7xZ6PrZYNmyPElzvaCxTo4g'

  it('Gọi API', async () => {
    // Không nên đụng đến thư mục apis
    // Vì chúng ta test riêng file http thì chỉ "nên" dùng http thôi
    // vì lỡ như thư mục apis có thay đổi gì đó
    // thì cũng không ảnh hưởng gì đến file test này
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
  it('Auth Request', async () => {
    await http.post('login', {
      email: 'quang03@gmail.com',
      password: 'quang123456'
    })
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh Token', async () => {
    setAccessTokenToLS(access_token_1s)
    setRefreshTokenToLS(refresh_token_1y)
    const httpNew = new Http().instance
    const res = await httpNew.get('me')
    // console.log(res)
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
