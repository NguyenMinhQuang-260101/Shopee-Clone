import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'

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
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
