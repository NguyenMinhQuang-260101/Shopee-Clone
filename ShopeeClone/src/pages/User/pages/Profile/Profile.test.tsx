import { describe, expect, it } from 'vitest'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logScreen, renderWithRouter } from '../../../../utils/testUtils'
import path from '../../../../constants/path'
import { setAccessTokenToLS } from '../../../../utils/auth'
import { access_token } from '../../../../msw/auth.msw'
import { waitFor } from '@testing-library/react'

describe('Profile', () => {
  it('Hiển thị trang Profile', async () => {
    setAccessTokenToLS(access_token)
    const { container } = renderWithRouter({ route: path.profile })
    // await logScreen('Trang Profile')
    await waitFor(() => {
      expect((container.querySelector('form input[placeholder="Tên"]') as HTMLInputElement).value).toBe('')
    })
  })
})
