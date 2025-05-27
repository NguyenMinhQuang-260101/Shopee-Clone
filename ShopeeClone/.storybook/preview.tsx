import type { Preview } from '@storybook/react'
import { AppProvider } from '../src/contexts/app.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { withRouter } from 'storybook-addon-remix-react-router'
import '../src/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withRouter,
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <HelmetProvider>
            <Story />
          </HelmetProvider>
        </AppProvider>
      </QueryClientProvider>
    )
  ]
}

export default preview
