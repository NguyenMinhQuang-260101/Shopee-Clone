import React from 'react'
import { forwardRef } from 'react'

export interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md',
    classNameError = 'mt-1 text-[#ff424f] min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = React.useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const regex = /^[0-9]*$/ // Regular expression to allow only numbers
    if ((regex.test(value) || value === '') && onChange) {
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
      // Cập nhập localValue state
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} {...rest} value={value || localValue} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
