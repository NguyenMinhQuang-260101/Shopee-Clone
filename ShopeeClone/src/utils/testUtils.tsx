import { prettyDOM, render, screen, waitFor, waitForOptions } from '@testing-library/react'
import { expect } from 'vitest'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

const delay = (time: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(true)
    }, time)
  )

export const logScreen = async (
  labelLog: string = 'SCREEN DEBUG',
  body: HTMLElement = document.body.parentElement as HTMLElement,
  options?: waitForOptions
) => {
  const { timeout = 1000 } = options || {}
  await waitFor(
    async () => {
      expect(await delay(timeout - 100)).toBe(true)
    },
    {
      ...options,
      timeout
    }
  )
  console.log(`\n===== ${labelLog} =====`)
  console.log(prettyDOM(body, 99999999))
  console.log('===== END SCREEN LOG =====\n')
  // Show all the DOM
  // screen.debug(body, 99999999)
}

export const renderWithRouter = ({ route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return {
    user: userEvent.setup(),
    ...render(<App />, {
      wrapper: BrowserRouter
    })
  }
}
