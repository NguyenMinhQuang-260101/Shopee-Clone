import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { schema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormData } from '../../types/register.type'
import Input from '../../components/Input'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { registerAccount } from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { ResponseApi } from '../../types/utils.type'

export default function Register() {
  const {
    register,
    handleSubmit,
    // watch,
    // getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    // * Cách 1: Dùng destructuring
    // const { confirm_password, ...body } = data
    // registerAccountMutation.mutate(body)
    // * Cách 2: Dùng lodash omit
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log('Register successfully', data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          // * Cách 1: Dùng forEach trong trường hợp có nhiều trường dữ liệu cần kiểm tra lỗi
          if (formError) {
            const formErrorKeys = Object.keys(formError) as Array<keyof Omit<FormData, 'confirm_password'>>
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
    <div className='bg-orange lg:bg-[url("https://down-vn.img.susercontent.com/file/sg-11134004-7rd4w-m7m4ydo2e4ljf1")] lg:bg-no-repeat lg:bg-center lg:bg-contain bg-none'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
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
                className='mt-3'
                placeholder='Password'
                register={register}
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <Input
                type='password'
                name='confirm_password'
                className='mt-3'
                placeholder='Nhập lại mật khẩu'
                register={register}
                autoComplete='on'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-2'>
                <button
                  type='submit'
                  className='w-full bg-orange text-white p-3 rounded-sm mt-4 hover:bg-orange/80 uppercase'
                >
                  đăng ký
                </button>
              </div>
              <div className='mt-7 flex items-center justify-center'>
                <span className='text-gray-300'>Bạn đã có tài khoản?</span>
                <Link to='/login' className='ml-1 text-orange cursor-pointer hover:text-orange/80'>
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
