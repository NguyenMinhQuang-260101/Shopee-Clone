import { range } from 'lodash'
import React from 'react'

type DateSelect = {
  date: number | Date
  month: number | Date
  year: number | Date
}

interface Props {
  onChange?: (date: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = React.useState<DateSelect>({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  React.useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = e.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year as number, newDate.month as number, newDate.date as number))
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            name='date'
            value={date.date as number}
            onChange={handleChange}
          >
            <option disabled>Ngày</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            name='month'
            value={date.month as number}
            onChange={handleChange}
          >
            <option disabled>Tháng</option>
            {range(1, 13).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            name='year'
            value={date.year as number}
            onChange={handleChange}
          >
            <option disabled>Năm</option>
            {range(1900, new Date().getFullYear() + 1).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className='mt-1 min-h-[1.25rem] text-sm text-[#ff424f]'>{errorMessage}</div>
        </div>
      </div>
    </div>
  )
}
