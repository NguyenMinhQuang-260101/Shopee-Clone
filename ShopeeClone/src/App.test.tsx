import { screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import path from './constants/path'
import { renderWithRouter } from './utils/testUtils'
describe('App', () => {
  test('App render và chuyển trang', async () => {
    const { user } = renderWithRouter()
    /*
     * waitFor sẽ run callback 1 vài lần
     * cho đến khi hết timeout hoặc expect pass
     * số lần run phụ thuộc vào timeout và interval
     * mặc định: timeout = 1000ms và interval = 50ms
     */

    //* Verify vào đúng trang chủ
    await waitFor(
      () => {
        expect(document.head.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone')
      },
      {
        timeout: 1000
      }
    )

    //* Verify chuyển sang trang login
    await user.click(screen.getByText(/Đăng nhập/i))
    await waitFor(
      () => {
        expect(document.head.querySelector('title')?.textContent).toBe('Đăng nhập | Shopee Clone')
        expect(screen.queryByText('Bạn chưa có tài khoản?')).not.toBeNull()
      },
      {
        timeout: 1000
      }
    )
  })

  test('Về trang not found', async () => {
    const badRoute = '/some/bad/route'
    renderWithRouter({ route: badRoute })
    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).not.toBeNull()
    })
  })

  test('Render trang register', async () => {
    renderWithRouter({ route: path.register })
    await waitFor(
      () => {
        expect(screen.getByText(/Bạn đã có tài khoản?/i)).not.toBeNull()
      },
      {
        timeout: 1000
      }
    )
  })
})
