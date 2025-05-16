import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from '../../../../apis/user.api'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import { userSchema, UserSchemaType } from '../../../../utils/rules'
import { isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import { ErrorResponse } from '../../../../types/utils.type'

type FormData = Pick<UserSchemaType, 'password' | 'new_password' | 'confirm_password'>
const profileSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const methods = useForm({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset
  } = methods

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        // * Cách 1: Dùng forEach trong trường hợp có nhiều trường dữ liệu cần kiểm tra lỗi
        if (formError) {
          const formErrorKeys = Object.keys(formError)
          formErrorKeys.forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mr-auto mt-8 max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput=' w-full rounded-sm border border-gray-300 pl-3 pr-6 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative'
                register={register}
                name='password'
                type='password'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput=' w-full rounded-sm border border-gray-300 pl-3 pr-6 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative'
                register={register}
                name='new_password'
                type='password'
                placeholder='Mật khẩu mới'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='pt-3 capitalize sm:w-[20%] sm:text-right'>Nhập lại mật khẩu</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput=' w-full rounded-sm border border-gray-300 pl-3 pr-6 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative'
                register={register}
                name='confirm_password'
                type='password'
                placeholder='Mật khẩu mới'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
