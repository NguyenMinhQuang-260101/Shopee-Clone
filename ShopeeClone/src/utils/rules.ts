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

function textPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string } // Lấy giá trị của price_min và price_max từ context
  if (price_min !== '' && price_max !== '') {
    return Number(price_min) <= Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref(refString)], 'Mật khẩu không khớp')
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
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().default('').test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: textPriceMinMax
  }),
  price_max: yup.string().default('').test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: textPriceMinMax
  }),
  name: yup.string().required('Tên sản phẩm là bắt buộc').trim()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Tên dài tối đa 160 ký tự'),
  phone: yup.string().max(20, 'Số điện thoại dài tối đa 20 ký tự'),
  address: yup.string().max(160, 'Địa chỉ dài tối đa 160 ký tự'),
  avatar: yup.string().max(1000, 'Đường dẫn ảnh dài tối đa 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn ngày sinh trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password') as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
})

export const loginSchema = schema.pick(['email', 'password'])
export const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export const priceSchema = schema.pick(['price_min', 'price_max'])
export const searchSchema = schema.pick(['name'])
export const profileSchema = userSchema.pick(['name', 'phone', 'address', 'avatar', 'date_of_birth'])

// Có thể dùng Omit để loại bỏ các trường không cần thiết
// const loginSchemaOmit = schema.omit(['confirm_password'])

// export type LoginSchema = yup.InferType<typeof loginSchema>
export type SchemaType = yup.InferType<typeof registerSchema>
export type PriceSchemaType = yup.InferType<typeof priceSchema>
export type SearchSchemaType = yup.InferType<typeof searchSchema>
export type UserSchemaType = yup.InferType<typeof userSchema>
