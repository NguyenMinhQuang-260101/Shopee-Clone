import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../../apis/auth.api'
import Button from '../../components/Button'
import Input from '../../components/Input'
import path from '../../constants/path'
import { AppContext } from '../../contexts/app.context'
import { ErrorResponse } from '../../types/utils.type'
import { loginSchema, SchemaType } from '../../utils/rules'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'

type LoginFormData = Pick<SchemaType, 'email' | 'password'>

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    // watch,
    // getValues,
    setError,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginFormData) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        console.log(data.data.data.user)
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<LoginFormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            const formErrorKeys = Object.keys(formError) as Array<keyof LoginFormData>
            formErrorKeys.forEach((key) => {
              setError(key, {
                message: formError[key],
                type: 'Server'
              })
            })
          }
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
              <div className='text-2xl'>Đăng nhập</div>
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
                className='mt-3'
                placeholder='Password'
                register={register}
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='mt-4 flex w-full items-center justify-center rounded-sm bg-orange p-3 uppercase text-white hover:bg-orange/80'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                >
                  đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-300'>Bạn chưa có tài khoản?</span>
                <Link to='/register' className='ml-1 cursor-pointer text-orange hover:text-orange/80'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
