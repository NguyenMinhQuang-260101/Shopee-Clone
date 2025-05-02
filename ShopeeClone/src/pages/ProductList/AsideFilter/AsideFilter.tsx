import classNames from 'classnames'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from '../../../components/Button'
import InputNumber from '../../../components/InputNumber'
import path from '../../../constants/path'
import { Category } from '../../../types/category.type'
import { QueryConfig } from '../ProductList'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from '../../../types/utils.type'
import { PriceSchemaType, priceSchema } from '../../../utils/rules'
import RatingStars from '../RatingStars'
import { omit } from 'lodash'
interface AsideFilterProps {
  queryConfig: QueryConfig
  categories: Category[]
}

/**
 * * Rule validate:
 * Nếu có price_min và price_max thì price_min <= price_max
 * Còn không thì có price_min thì khong có price_max và ngược lại
 */

type FromData = NoUndefinedField<PriceSchemaType>

export default function AsideFilter({ queryConfig, categories }: AsideFilterProps) {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FromData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    // Nên có shouldFocusError khi dùng ref dể focus vào input lỗi tránh focus mặt định
    shouldFocusError: false
  })
  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold capitalize', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                <svg
                  viewBox='0 0 4 7'
                  className={classNames('absolute left-[-10px] top-1 h-2 w-2 fill-orange', {
                    hidden: !isActive
                  })}
                >
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng Giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={(
                { field } // Destructure the field object to get onChange and value
              ) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ TỪ'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md'
                  {...field} // Spread the field object to pass all its properties to the input element
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max') // Trigger validation for price_min field
                  }}
                  classNameError='hidden'
                />
              )}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={(
                { field } // Destructure the field object to get onChange and value
              ) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ ĐẾN'
                  classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-md'
                  {...field} // Spread the field object to pass all its properties to the input element
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min') // Trigger validation for price_max field
                  }}
                  classNameError='hidden'
                />
              )}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-[#ff424f]'>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
        onClick={handleRemoveAll}
      >
        Xoá tất cả
      </Button>
    </div>
  )
}
