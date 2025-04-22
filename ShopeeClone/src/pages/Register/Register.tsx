import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { rules } from '../../utils/rules'
import { FormData } from '../../types/register.type'
import Input from '../../components/Input'

export default function Register() {
  const {
    register,
    handleSubmit,
    // watch,
    // getValues,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    // console.log(data)
    // const password = getValues('password')
    // const confirmPassword = getValues('confirm_password')
  })

  // const password = watch('password')
  // console.log('password', password)

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
                rules={rules.email}
                autoComplete='on'
                errorMessage={errors.email?.message}
              />
              <Input
                type='password'
                name='password'
                className='mt-3'
                placeholder='Password'
                register={register}
                rules={rules.password}
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <Input
                type='password'
                name='confirm_password'
                className='mt-3'
                placeholder='Nhập lại mật khẩu'
                register={register}
                rules={rules.confirm_password}
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
