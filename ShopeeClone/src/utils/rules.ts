import { RegisterOptions } from 'react-hook-form'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
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
    validate: (value, { password }) => {
      if (value !== password) {
        return 'Mật khẩu không khớp'
      }
    }
  }
}
