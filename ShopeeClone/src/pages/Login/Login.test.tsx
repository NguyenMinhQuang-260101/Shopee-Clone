import { beforeAll, describe, expect, it } from 'vitest'
import { logScreen, renderWithRouter } from '../../utils/testUtils'
import path from '../../constants/path'
import { fireEvent, screen, waitFor } from '@testing-library/react'

describe('Login', () => {
  //* Trong một số trường hợp bị mutiple 1 số thẻ nguyên nhân là dùng beforeEach khiến cho render chồng chéo làm nhân ra nhieu lần
  //* Ta dùng beforeAll để render 1 lần duy nhất
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).not.toBeNull()
    })
  })
  it('Hiển thị lỗi requited không nhập gì', async () => {
    const submitButton = screen.getByRole('button', {
      name: /Đăng nhập/i
    })
    fireEvent.submit(submitButton)
    // await waitFor(async () => {
    //   expect(await screen.queryByText('Vui lòng nhập email')).not.toBeNull()
    //   expect(await screen.queryByText('Vui lòng nhập mật khẩu')).not.toBeNull()
    // })
    await waitFor(() => {
      expect(screen.queryByText('Vui lòng nhập email')).not.toBeNull()
      expect(screen.queryByText('Vui lòng nhập mật khẩu')).not.toBeNull()
    })
  })
  it('Hiển thị lỗi nhập email và password không hợp lệ', async () => {
    // const emailInput = screen.getByRole('textbox', { name: /email/i })
    // const passwordInput = screen.getByRole('textbox', { name: /password/i })
    const emailInput = document.querySelector('form input[type="email"]') as Element
    const passwordInput = document.querySelector('form input[type="password"]') as Element
    const submitButton = screen.getByRole('button', {
      name: /Đăng nhập/i
    })
    fireEvent.change(emailInput, {
      target: {
        value: 'testgmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)
    expect(await screen.findByText('Email không hợp lệ')).toBeTruthy()
    expect(await screen.findByText('Mật khẩu không được ngắn hơn 6 ký tự')).toBeTruthy()
    await logScreen('Render trang Login')
  })
})
