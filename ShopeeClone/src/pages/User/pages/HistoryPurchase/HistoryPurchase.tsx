import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import path from '../../../../constants/path'
import { purchasesStatus } from '../../../../constants/purchaseStatus'
import useQueryParams from '../../../../hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import purchaseApi from '../../../../apis/purchase.api'
import { PurchaseListStatus } from '../../../../types/purchase.type'
import { formatCurrency, generateNameId } from '../../../../utils/utils'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' }
]

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status = queryParams.status ? Number(queryParams.status) : purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchaseList({ status: status as PurchaseListStatus })
  })
  const purchasesInCart = purchasesInCartData?.data.data

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white p-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div className='mt-4 flex flex-col'>
            {purchasesInCart?.length ? (
              purchasesInCart.map((purchase) => (
                <div
                  key={purchase._id}
                  className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
                >
                  <Link
                    to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                    className='flex'
                  >
                    <div className='flex-shrink-0'>
                      <img
                        src={purchase.product.image}
                        alt={purchase.product.name}
                        className='h-20 w-20 object-cover'
                      />
                    </div>
                    <div className='ml-3 flex-grow overflow-hidden'>
                      <div className='truncate'>{purchase.product.name}</div>
                      <div className='mt-3'>{purchase.buy_count}</div>
                    </div>
                    <div className='ml-3 flex-shrink-0'>
                      <span className='truncate text-gray-500 line-through'>
                        ₫{formatCurrency(purchase.product.price_before_discount)}
                      </span>
                      <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                    </div>
                  </Link>
                  <div className='flex justify-end'>
                    <div>
                      <span className='text-sm text-gray-500'>Tổng giá tiền:</span>
                      <span className='ml-4 text-xl text-orange'>
                        ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500'>Không có đơn hàng nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
