import { beforeAll, describe, expect, it } from 'vitest'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logScreen, renderWithRouter } from '../../utils/testUtils'
import path from '../../constants/path'
import { fireEvent, screen, waitFor } from '@testing-library/react'

describe('Login', () => {
  //* Trong một số trường hợp bị mutiple 1 số thẻ nguyên nhân là dùng beforeEach khiến cho render chồng chéo làm nhân ra nhieu lần
  //* Ta dùng beforeAll để render 1 lần duy nhất
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).not.toBeNull()
    })
    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = screen.getByRole('button', {
      name: /Đăng nhập/i
    }) as HTMLButtonElement
  })
  it('Hiển thị lỗi requited không nhập gì', async () => {
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
    await waitFor(() => {
      expect(screen.queryByText('Email không hợp lệ')).toBeTruthy()
      expect(screen.queryByText('Mật khẩu không được ngắn hơn 6 ký tự')).toBeTruthy()
    })
    // await logScreen('Render trang Login')
  })

  it('Không nên hiển thị lỗi khi nhập đúng email và password', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'quang03@gmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: 'quang123456'
      }
    })
    /*
     * Những trường hợp chứng minh tìm không ra text hay element nào đó
     * thì nên dùng query hơn là find hay get
     */
    await waitFor(() => {
      expect(screen.queryByText('Email không hợp lệ')).toBeNull()
      expect(screen.queryByText('Mật khẩu không được ngắn hơn 6 ký tự')).toBeNull()
    })
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone')
    })
  })
})
