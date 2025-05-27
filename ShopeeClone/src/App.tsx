import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/*
 * Khi url thay đỗi thì các component nào dùng các hook như
 * useRoutes, useParams, useSearchParams,...
 * sẽ tự động re-render lại.
 * Ví dung: khi component `App` dưới đây bị re-render khi mà url thay đổi,
 * vì dùng hook `useRouteElements` (đây là customhook của `useRoutes`),
 */

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLocalStorage', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLocalStorage', reset)
    }
  }, [reset])
  return (
    <div>
      <HelmetProvider>
        <ErrorBoundary>
          {routeElements}
          <ToastContainer />
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </HelmetProvider>
    </div>
  )
}

export default App
