import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import ProductApi from '../../apis/product.api'
import ProductRating from '../../components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from '../../utils/utils'
import InputNumber from '../../components/InputNumber'
import DOMPurify from 'dompurify' //! DOMPurify giúp ta làm sạch HTML, loại bỏ các thẻ độc hại như <script>, <iframe>, ...
import { useEffect, useMemo, useRef, useState } from 'react'
import { Product } from '../../types/product.type'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: productDetailData } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => {
      return ProductApi.getProductDetail(id as string)
    }
  })
  const product = productDetailData?.data.data
  const imageRef = useRef<HTMLImageElement>(null)
  const [currentIndexImgs, setCurrentIndexImgs] = useState<number[]>([0, 5])
  const [activeImg, setActiveImg] = useState<string>('')
  const currentImgs = useMemo(
    () => (product ? product.images.slice(...currentIndexImgs) : []),
    [product, currentIndexImgs]
  )

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImg(product.images[0])
    }
  }, [product])

  const chooseActiveImg = (img: string) => {
    setActiveImg(img)
  }

  const handleNextImg = () => {
    if (currentIndexImgs[1] < (product as Product).images.length) {
      setCurrentIndexImgs((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const handlePrevImg = () => {
    if (currentIndexImgs[0] > 0) {
      setCurrentIndexImgs((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoomImg = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // * Cách 1: Lấy offsetX, offsetY dơn giản khi chúng ta ĐÃ xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // * Cách 2: Lấy offsetX, offsetY phức tạp hơn một chút, chúng ta KHÔNG CẦN xử lý bubble event (KHÔNG cần thêm pointer-events-none vào ảnh)
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'

    // ! Event bubble dẫn đến việc zoom ảnh không chính xác bị chớp
    // * Cách khắc phục: Thêm pointer-events-none vào ảnh để không cho sự kiện chuột xảy ra trên ảnh
  }

  const handleRemoveZoomImg = () => {
    imageRef.current?.removeAttribute('style')
  }

  if (!product) return null

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full overflow-hidden pt-[100%] shadow hover:cursor-zoom-in'
                onMouseMove={handleZoomImg}
                onMouseLeave={handleRemoveZoomImg}
              >
                <img
                  src={activeImg}
                  alt={product.name}
                  className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={handlePrevImg}
                >
                  <ChevronLeftIcon className='h-5 w-5' />
                </button>
                {currentImgs.map((image) => {
                  const isActive = image === activeImg
                  return (
                    <div key={image} className='relative w-full pt-[100%]' onMouseEnter={() => chooseActiveImg(image)}>
                      <img
                        src={image}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={handleNextImg}
                >
                  <ChevronRightIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName='w-4 h-4 fill-orange text-orange'
                    nonActiveClassName='w-4 h-4 text-gray-300 fill-current'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} Giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Sô lượng</div>
                <div className='ml-10 flex items-center'>
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <MinusIcon className='h-4 w-4' />
                  </button>
                  <InputNumber
                    value={1}
                    className=''
                    classNameError='hidden'
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  />
                  <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                    <PlusIcon className='h-4 w-4' />
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'>
                  <img
                    alt='icon-add-to-cart'
                    className='mr-[10px] h-5 fill-current stroke-orange text-orange'
                    src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/f600cbfffbe02cc144a1.svg'
                  />
                  Thêm vào giỏ hàng
                </button>
                <button className='ml-4 flex h-12 min-w-20 items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg uppercase text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mb-4 mt-10 text-sm leading-loose'>
            <div
              className='prose max-w-none'
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
