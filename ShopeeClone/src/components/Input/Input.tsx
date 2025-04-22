import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { FormData } from '../../types/register.type'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: keyof FormData
  register: UseFormRegister<FormData>
  rules?: RegisterOptions<FormData, keyof FormData>
  autoComplete?: string
}

export default function Input({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  rules,
  autoComplete
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md'
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name, rules)}
      />
      <div className='mt-1 text-[#ff424f] min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
