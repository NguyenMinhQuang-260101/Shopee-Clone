import { RegisterOptions } from 'react-hook-form'
import { FormData } from '../types/Register.type'

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
