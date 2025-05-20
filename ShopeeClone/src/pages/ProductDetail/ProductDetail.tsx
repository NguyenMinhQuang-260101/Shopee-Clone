import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify' //! DOMPurify giúp ta làm sạch HTML, loại bỏ các thẻ độc hại như <script>, <iframe>, ...
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductApi from '../../apis/product.api'
import purchaseApi from '../../apis/purchase.api'
import ProductRating from '../../components/ProductRating'
import QuantityController from '../../components/QuantityController'
import { ProductListConfig, Product as ProductType } from '../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '../../utils/utils'
import Product from '../ProductList/components/Product'
import { purchasesStatus } from '../../constants/purchaseStatus'
import { toast } from 'react-toastify'
import path from '../../constants/path'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

export default function ProductDetail() {
  const { t } = useTranslation(['product'])
  const [buyCount, setBuyCount] = useState(1)
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string) // Lấy id từ nameId
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
  const queryConfig: ProductListConfig = { limit: '12', page: '1', category: product?.category._id }
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return ProductApi.getProducts(queryConfig)
    },
    staleTime: 3 * 60 * 1000, // 3 phút
    enabled: Boolean(product) // Chỉ gọi API khi có product
  })

  // ! const addToCartMutation = useMutation(purchaseApi.addToCart) : Cái này sai vì useMutation nhận vào 1 object chứ không phải là 1 function
  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImg(product.images[0])
    }
  }, [product])

  const chooseActiveImg = (img: string) => {
    setActiveImg(img)
  }

  const handleNextImg = () => {
    if (currentIndexImgs[1] < (product as ProductType).images.length) {
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

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 3000 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] }) // Xóa cache của danh sách giỏ hàng
        }
      }
    )
  }

  const handleBuyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxInputLength: 150
            }
          })}
        />
      </Helmet>
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
                  src={activeImg ? activeImg : undefined}
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
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>
                  {product.quantity} {t('product:available')}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={addToCart}
                >
                  <img
                    alt='icon-add-to-cart'
                    className='mr-[10px] h-5 fill-current stroke-orange text-orange'
                    src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/f600cbfffbe02cc144a1.svg'
                  />
                  Thêm vào giỏ hàng
                </button>
                <button
                  className='ml-4 flex h-12 min-w-20 items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
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
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>Có thể bạn cũng thích</div>
          {productData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productData.data.data.products.map((product) => (
                <div
                  className='col-span-1'
                  key={product._id}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
