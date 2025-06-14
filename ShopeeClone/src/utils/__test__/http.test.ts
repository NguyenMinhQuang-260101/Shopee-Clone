import { beforeEach, describe, expect, it } from 'vitest'
import { Http } from '../http'
import { HttpStatusCode } from 'axios'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'
import { access_token_1s, refresh_token_1000days } from '../../msw/auth.msw'

describe('http axios', () => {
  let http = new Http().instance

  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })

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
    setRefreshTokenToLS(refresh_token_1000days)
    const httpNew = new Http().instance
    const res = await httpNew.get('me')
    // console.log(res)
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
