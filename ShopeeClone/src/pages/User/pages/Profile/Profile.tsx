import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from '../../../../apis/user.api'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import InputFile from '../../../../components/InputFile'
import InputNumber from '../../../../components/InputNumber'
import { AppContext } from '../../../../contexts/app.context'
import { ErrorResponse } from '../../../../types/utils.type'
import { setProfileFromLS } from '../../../../utils/auth'
import { profileSchema, UserSchemaType } from '../../../../utils/rules'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from '../../../../utils/utils'
import DateSelect from '../../components/DateSelect'
import { Helmet } from 'react-helmet-async'

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()

  return (
    <Fragment>
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <Helmet>
          <title>Thông tin cá nhân</title>
          <meta name='description' content='Thông tin cá nhân của người dùng' />
        </Helmet>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
            register={register}
            name='name'
            placeholder='Tên'
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  )
}

type FormData = Pick<UserSchemaType, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

// Flow 1:
// Nhấn upload: upload lên server luôn => server trả về url ảnh
// Nhấn submit thì gửi url ảnh cộng với data lên server

// Flow 2:
// Nhấn upload: không upload lên server
// Nhấn submit thì tiến hành upload lên server, nếu upload thành công thì tiến hành gọi api updateProfile

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return ''
  }, [file])

  const methods = useForm({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    setError,
    formState: { errors }
  } = methods

  const avatar = watch('avatar')
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const updateAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await updateAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileFromLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        // * Cách 1: Dùng forEach trong trường hợp có nhiều trường dữ liệu cần kiểm tra lỗi
        if (formError) {
          const formErrorKeys = Object.keys(formError)
          formErrorKeys.forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Địa chỉ'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
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
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <InputFile onChange={handleChangeFile} />
              <div className='mt-3 text-gray-400'>
                <div>Dung lượng file tối đa 1 MB</div>
                <div>Định dạng: .JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
