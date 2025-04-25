import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { schema } from '../../utils/rules'
import { FormData } from '../../types/register.type'
import { useMutation } from '@tanstack/react-query'
import { loginAccount } from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import Input from '../../components/Input'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'
import path from '../../constants/path'

type LoginFormData = Omit<FormData, 'confirm_password'>
const schemaLogin = schema.omit(['confirm_password'])

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
    resolver: yupResolver(schemaLogin)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginFormData) => loginAccount(body)
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
    <div className='bg-orange lg:bg-[url("https://down-vn.img.susercontent.com/file/sg-11134004-7rd4w-m7m4ydo2e4ljf1")] lg:bg-no-repeat lg:bg-center lg:bg-contain bg-none'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
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
                  className='w-full bg-orange text-white p-3 rounded-sm mt-4 hover:bg-orange/80 uppercase flex justify-center items-center'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                >
                  đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-300'>Bạn chưa có tài khoản?</span>
                <Link to='/register' className='ml-1 text-orange cursor-pointer hover:text-orange/80'>
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
