// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prettyDOM, render, screen, waitFor, waitForOptions } from '@testing-library/react'
import { expect } from 'vitest'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider, getInitialAppContext } from '../contexts/app.context'

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

const createWarper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    }
  })
  const Provider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Provider
}

const Provider = createWarper()

export const renderWithRouter = ({ route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  const defaultValueAppContext = getInitialAppContext()
  return {
    user: userEvent.setup(),
    ...render(
      <Provider>
        <AppProvider defaultValue={defaultValueAppContext}>
          <App />
        </AppProvider>
      </Provider>,
      {
        wrapper: BrowserRouter
      }
    )
  }
}
