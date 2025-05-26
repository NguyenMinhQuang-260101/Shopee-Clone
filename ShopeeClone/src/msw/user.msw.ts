import { http, HttpResponse } from 'msw'
import config from '../constants/config'
import { HttpStatusCode } from 'axios'
import { access_token_1s } from './auth.msw'

const meRes = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '68072eae216ca4033ed12bbf',
    roles: ['User'],
    email: 'quang03@gmail.com',
    createdAt: '2025-04-22T05:52:46.146Z',
    updatedAt: '2025-04-22T05:52:46.146Z',
    avatar: 'https://api-ecom.duthanhduoc.com/images/undefined'
  }
}

const meRequest = http.get(`${config.baseUrl}me`, ({ request }) => {
  const accessToken = request.headers.get('Authorization')
  if (accessToken === access_token_1s) {
    return HttpResponse.json(
      {
        message: 'Lỗi',
        data: {
          message: 'Token hết hạn',
          name: 'EXPIRED_TOKEN'
        }
      },
      {
        status: HttpStatusCode.Unauthorized
      }
    )
  }
  return HttpResponse.json(meRes, {
    status: HttpStatusCode.Ok
  })
})

const userRequests = [meRequest]
export default userRequests
