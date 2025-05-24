import { describe, expect, it } from 'vitest'
import { logScreen, renderWithRouter } from '../../utils/testUtils'
import path from '../../constants/path'
import { screen, waitFor } from '@testing-library/react'

describe('Login', () => {
  it('Hiển thị lỗi required khi không nhập email', async () => {
    const { user } = renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).not.toBeNull()
    })
    const submitButton = screen.getByRole('button', {
      name: /Đăng nhập/i
    })
    user.click(submitButton)
    expect(await screen.findByText('Vui lòng nhập email')).toBeTruthy()
    expect(await screen.findByText('Vui lòng nhập mật khẩu')).toBeTruthy()
    await logScreen('Render trang Login')
  })
})
