import React, { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import config from '../../constants/config'

interface InputFileProps {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('Dung lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG', {
        autoClose: 1000,
        position: 'top-center'
      })
      return
    }
    onChange && onChange(fileFromLocal)
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Fragment>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // * Cách 1:
          event.currentTarget.value = ''
          // * Cách 2:
          // const target = event.target as HTMLInputElement
          // target.value = ''
        }}
      />
      <button
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  )
}
