import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import authApi from '../../apis/auth.api'
import path from '../../constants/path'
import { purchasesStatus } from '../../constants/purchaseStatus'
import { AppContext } from '../../contexts/app.context'
import { getAvatarUrl } from '../../utils/utils'
import Popover from '../Popover'
import { useTranslation } from 'react-i18next'
import { locales } from '../../i18n/i18n'

export default function NavHeader() {
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const { logoutAccount } = authApi
  const logoutMutation = useMutation({
    mutationFn: logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })

  const handleLogoutMutation = () => {
    logoutMutation.mutate()
  }

  const handleChangeLanguage = (lang: 'en' | 'vi') => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className='flex justify-end'>
      <Popover
        as={'span'}
        // initialIsOpen={true}
        className='flex cursor-pointer items-center py-1 hover:text-white/70'
        renderPopover={
          <div className='flex w-52 flex-col py-2 pl-3'>
            <button
              className='max-w-fit py-2 text-left hover:text-orange'
              onClick={() => {
                handleChangeLanguage('vi')
              }}
            >
              Tiếng Việt
            </button>
            <button
              className='max-w-fit py-2 text-left hover:text-orange'
              onClick={() => {
                handleChangeLanguage('en')
              }}
            >
              English
            </button>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>{currentLanguage}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='ml-6 flex cursor-pointer items-center py-1 hover:text-white/70'
          renderPopover={
            <div>
              <Link
                to={path.profile}
                className='block w-full bg-white px-4 py-2 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                Tài khoản của tôi
              </Link>
              <Link
                to={path.historyPurchase}
                className='block w-full bg-white px-4 py-2 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                Đơn mua
              </Link>
              <button
                className='block w-full bg-white px-4 py-2 text-left hover:bg-slate-100 hover:text-cyan-500'
                onClick={handleLogoutMutation}
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div className='mr-2 h-6 w-6 flex-shrink-0'>
            <img
              src={getAvatarUrl(profile?.avatar)}
              alt='avatar'
              className='h-full w-full rounded-full bg-current object-cover'
            />
          </div>
          <span className='mx-1'>{profile?.email}</span>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Đăng ký
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40'></div>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
