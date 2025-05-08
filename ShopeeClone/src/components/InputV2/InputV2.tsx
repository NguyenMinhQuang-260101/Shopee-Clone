import React from 'react'
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form'

export type InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  classNameInput?: string
  classNameError?: string
} & React.InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<TFieldValues, TName>

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: InputProps<TFieldValues, TName>) {
  const {
    type,
    onChange,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md',
    classNameError = 'mt-1 text-[#ff424f] min-h-[1.25rem] text-sm',
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = React.useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const numberCondition = (type === 'number' && /^[0-9]*$/.test(valueFromInput)) || valueFromInput === '' // Regular expression to allow only numbers
    if (numberCondition || type !== 'number') {
      // Cập nhập localValue state
      setLocalValue(valueFromInput)
      // Gọi field.onChange để cập nhật giá trị trong react-hook-form
      field.onChange(event)
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      {/* Gọi rest và field lên trước để không tạo ra onChange mới */}
      <input className={classNameInput} {...rest} {...field} onChange={handleChange} value={value || localValue} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
