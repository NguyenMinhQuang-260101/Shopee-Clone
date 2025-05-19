import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { registerSchema, SchemaType } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../../components/Input'
import { useMutation } from '@tanstack/react-query'
// ! Không có tính năng tree-shaking
// import { omit } from 'lodash/'
// * Import chỉ mỗi function omit
import omit from 'lodash/omit'
import authApi from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'
import path from '../../constants/path'

type RegisterFormData = Pick<SchemaType, 'email' | 'password' | 'confirm_password'>

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    // watch,
    // getValues,
    setError,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<RegisterFormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    // * Cách 1: Dùng destructuring
    // const { confirm_password, ...body } = data
    // registerAccountMutation.mutate(body)
    // * Cách 2: Dùng lodash omit
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<RegisterFormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          // * Cách 1: Dùng forEach trong trường hợp có nhiều trường dữ liệu cần kiểm tra lỗi
          if (formError) {
            const formErrorKeys = Object.keys(formError) as Array<keyof Omit<RegisterFormData, 'confirm_password'>>
            formErrorKeys.forEach((key) => {
              setError(key, {
                message: formError[key],
                type: 'Server'
              })
            })
          }
          // * Cách 2: Dùng destructuring trong trường hợp chỉ có 1 số ít trường dữ liệu cần kiểm tra lỗi
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='bg-orange bg-none lg:bg-[url("https://down-vn.img.susercontent.com/file/sg-11134004-7rd4w-m7m4ydo2e4ljf1")] lg:bg-contain lg:bg-center lg:bg-no-repeat'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                type='email'
                name='email'
                className='mt-8'
                placeholder='Email'
                register={register}
                autoComplete='on'
                errorMessage={errors.email?.message}
              />
              <Input
                type='password'
                name='password'
                className='relative mt-3'
                placeholder='Password'
                register={register}
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <Input
                type='password'
                name='confirm_password'
                className='relative mt-3'
                placeholder='Nhập lại mật khẩu'
                register={register}
                autoComplete='on'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='mt-4 w-full rounded-sm bg-orange p-3 uppercase text-white hover:bg-orange/80'
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  đăng ký
                </Button>
              </div>
              <div className='mt-7 flex items-center justify-center'>
                <span className='text-gray-300'>Bạn đã có tài khoản?</span>
                <Link to='/login' className='ml-1 cursor-pointer text-orange hover:text-orange/80'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
