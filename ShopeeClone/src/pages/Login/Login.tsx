import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export default function Login() {
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

  return (
    <div className='bg-orange lg:bg-[url("https://down-vn.img.susercontent.com/file/sg-11134004-7rd4w-m7m4ydo2e4ljf1")] lg:bg-no-repeat lg:bg-center lg:bg-contain bg-none'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm'>
              <div className='text-2xl'>Đăng nhập</div>
              <div className='mt-8'>
                <input
                  type='email'
                  name='email'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md'
                  placeholder='Email'
                />
                <div className='mt-1 text-[#ff424f] min-h-[1rem] text-sm'></div>
              </div>
              <div className='mt-3'>
                <input
                  type='password'
                  name='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md'
                  placeholder='Password'
                  autoComplete='on'
                />
                <div className='mt-1 text-[#ff424f] min-h-[1rem] text-sm'></div>
              </div>
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full bg-orange text-white p-3 rounded-sm mt-4 hover:bg-orange/80 uppercase'
                >
                  đăng nhập
                </button>
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
