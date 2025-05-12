import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { SearchSchemaType, searchSchema } from '../utils/rules'
import useQueryConfig from './useQueryConfig'
import path from '../constants/path'

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm<SearchSchemaType>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(searchSchema)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
