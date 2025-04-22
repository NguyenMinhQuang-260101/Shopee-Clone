import { RegisterOptions } from 'react-hook-form'
import { FormData } from '../types/register.type'
import * as yup from 'yup'

type Rules = {
  [key in keyof FormData]?: RegisterOptions<FormData, key>
}

export const rules: Rules = {
  email: {
    required: {
      value: true,
      message: 'Vui lòng nhập email'
    },
    pattern: {
      value: /^\S+@\S+$/i,
      message: 'Email không hợp lệ'
    },
    maxLength: {
      value: 160,
      message: 'Email không được dài hơn 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Email không được ngắn hơn 5 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Vui lòng nhập mật khẩu'
    },
    minLength: {
      value: 6,
      message: 'Mật khẩu không được ngắn hơn 6 ký tự'
    },
    maxLength: {
      value: 160,
      message: 'Mật khẩu không được dài hơn 160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Vui lòng nhập lại mật khẩu'
    },
    validate: (value: string, formValues: FormData): string | boolean => {
      // Giải thích: Nếu value === formValues.password thì trả về true, ngược lại trả về thông báo lỗi
      return value === formValues.password || 'Mật khẩu không khớp'
    }
  }
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .max(160, 'Email không được dài hơn 160 ký tự')
    .min(5, 'Email không được ngắn hơn 5 ký tự'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu không được ngắn hơn 6 ký tự')
    .max(160, 'Mật khẩu không được dài hơn 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
})

const loginSchema = schema.pick(['email', 'password'])

// Có thể dùng Omit để loại bỏ các trường không cần thiết
// const loginSchemaOmit = schema.omit(['confirm_password'])

export type Schema = yup.InferType<typeof schema>
export type LoginSchema = yup.InferType<typeof loginSchema>
