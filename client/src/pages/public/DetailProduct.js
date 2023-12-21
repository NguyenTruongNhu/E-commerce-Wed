import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import {
  apiGetProduct,
  apiGetProducts,
  apiUpdateCart,
  apiUserCustom
} from '../../apis'
import {
  Breadcrumb,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInfomation,
  CustomSlider,
  InputForm
} from '../../components'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'
import {
  formatMoney,
  formatPrice,
  renderStarFromNumber
} from '../../ultils/helper'
import { productExtraInfomation } from '../../ultils/contants'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { getCurrent } from 'store/user/asyncActions'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withBaseComponent from 'hocs/withBaseComponent'
import path from 'ultils/path'
import { FcCustomerSupport } from 'react-icons/fc'
import useDebounce from 'hooks/useDebounce'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
}

const DetailProduct = ({
  isQuickView,
  data,
  navigate,
  location,
  dispatch,
  loading = false
}) => {
  const params = useParams()
  const titleRef = useRef()
  const { current } = useSelector((state) => state.user)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(null)
  const [valueCustomProduct, setvalueCustomProduct] = useState('')
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [update, setUpdate] = useState(false)
  const [variant, setVariant] = useState(null)
  const [category, setCategory] = useState(null)
  const [isShowCustom, setIsShowCustom] = useState(null)
  const [pid, setPid] = useState(null)
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    thumb: '',
    images: '',
    price: '',
    color: ''
  })
  console.log(product)
  useEffect(() => {
    if (data) {
      setPid(data.pid)
      setCategory(data.category)
    } else if (params && params.pid) {
      setPid(params.pid)
      setCategory(params.category)
    }
  }, [data, params])
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid)
    if (response.success) {
      setProduct(response.productData)
      setCurrentImage(response.productData?.thumb)
    }
  }

  useEffect(() => {
    if (variant) {
      setCurrentProduct({
        title: product?.variants?.find((el) => el.sku === variant)?.title,
        color: product?.variants?.find((el) => el.sku === variant)?.color,
        price: product?.variants?.find((el) => el.sku === variant)?.price,
        images: product?.variants?.find((el) => el.sku === variant)?.images,
        thumb: product?.variants?.find((el) => el.sku === variant)?.thumb
      })
    } else {
      setCurrentProduct({
        title: product?.title,
        color: product?.color,
        price: product?.price,
        images: product?.images || [],
        thumb: product?.thumb
      })
    }
  }, [variant, product])
  const fetchProducts = async () => {
    const response = await apiGetProducts({ category })
    if (response.success) setRelatedProducts(response.products)
  }
  useEffect(() => {
    if (pid) {
      fetchProductData()
      fetchProducts()
    }
    titleRef.current?.scrollIntoView({ block: 'start' })
    window.scrollTo(0, 0)
  }, [pid])
  useEffect(() => {
    if (pid) {
      fetchProductData()
    }
  }, [update])

  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])
  const handleQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return
      } else {
        setQuantity(number)
      }
    },
    [quantity]
  )

  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === 'minus' && quantity === 1) return
      if (flag === 'minus') setQuantity((prev) => +prev - 1)
      if (flag === 'plus') setQuantity((prev) => +prev + 1)
    },
    [quantity]
  )

  const handleClickImage = (e, el) => {
    e.stopPropagation()
    setCurrentImage(el)
  }

  const handleAddToCart = async () => {
    if (!current)
      return Swal.fire({
        title: 'Almost...',
        text: 'Please login first!',
        icon: 'info',
        cancelButtonText: 'Not now!',
        showCancelButton: true,
        confirmButtonText: 'Go login page'
      }).then((rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname
            }).toString()
          })
      })

    const response = await apiUpdateCart({
      pid,
      color: currentProduct.color || product?.color,
      quantity,
      price: currentProduct.price || product?.price,
      thumbnail: currentProduct.thumb || product?.thumb,
      title: currentProduct.title || product?.title
    })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }

  const customProduct = useDebounce(valueCustomProduct, 1500)
  const handleAddToMyCart = async () => {
    if (!current)
      return Swal.fire({
        title: 'Almost...',
        text: 'Please login first!',
        icon: 'info',
        cancelButtonText: 'Not now!',
        showCancelButton: true,
        confirmButtonText: 'Go login page'
      }).then((rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname
            }).toString()
          })
      })
    const response = await apiUserCustom({
      pid,
      note: customProduct
    })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  console.log({ currentImage, currentProduct })

  return (
    <div className={clsx('w-full')}>
      {!isQuickView && (
        <div className="h-[81px] flex justify-center items-center bg-gray-100">
          <div className="w-main">
            <h3 ref={titleRef} className="font-semibold">
              {currentProduct.title || product?.title}
            </h3>
            <Breadcrumb
              title={currentProduct.title || product?.title}
              category={category}
            />
          </div>
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          ' bg-white m-auto mt-4 flex',
          isQuickView
            ? 'max-w-[900px] gap-[10rem] p-8 max-h-[80vh] overflow-y-auto'
            : 'w-main'
        )}
      >
        <div
          className={clsx('flex flex-col gap-4 w-2/5', isQuickView && 'w-1/2')}
        >
          <div className="h-[458px] w-[458px] border flex items-center">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'Wristwatch by Ted Baker London',
                  isFluidWidth: true,
                  src: currentProduct.thumb
                },
                largeImage: {
                  src: currentProduct.thumb,
                  width: 1000,
                  height: 1000
                }
              }}
            />
          </div>
          <div className="w-[458px]">
            <Slider className="image-slider" {...settings}>
              {currentProduct.images.length === 0 &&
                product?.images?.map((el) => (
                  <div key={el} className="flex w-full  justify-between">
                    <img
                      src={el}
                      alt="sub-product"
                      className="h-[143px] w-[143px] border object-cover cursor-pointer"
                      onClick={(e) => handleClickImage(e, el)}
                    />
                  </div>
                ))}
              {currentProduct.images.length > 0 &&
                currentProduct.images?.map((el) => (
                  <div key={el} className="flex w-full justify-between">
                    <img
                      src={el}
                      alt="sub-product"
                      className="h-[143px] w-[143px] border object-cover cursor-pointer"
                      onClick={(e) => handleClickImage(e, el)}
                    />
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <div
          className={clsx(
            ' pr-[24px] w-2/5 flex flex-col gap-4',
            isQuickView && 'w-1/2'
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">{`${formatMoney(
              formatPrice(currentProduct.price || product?.price)
            )} VNĐ`}</h2>
            <span className="text-sm text-main">{`In stock: ${product?.quantity}`}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-sm text-main italic">{`(Sold: ${product?.sold}) pieces`}</span>
          </div>
          <ul className=" list-square text-sm text-gray-500 pl-4">
            {product?.description?.length > 1 &&
              product?.description?.map((el) => (
                <li className="leading-8" key={el}>
                  {el}
                </li>
              ))}
            {product?.description?.length === 1 && (
              <div
                className="text-sm  line-clamp-[10]"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0])
                }}
              ></div>
            )}
          </ul>
          <div className="my-4 flex  gap-4">
            <span className="font-bold">Color:</span>
            <div className="flex flex-wrap gap-4 items-center w-full">
              <div
                onClick={() => setVariant(null)}
                className={clsx(
                  'flex items-center gap-2 p-2 border cursor-pointer',
                  !variant && 'border-red-500'
                )}
              >
                <img
                  src={product?.thumb}
                  alt="thumb"
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span className="flex flex-col ">
                  <span>{product?.color}</span>
                  <span className="text-sm">{product?.price}</span>
                </span>
              </div>
              {product?.variants?.map((el) => (
                <div
                  key={el.sku}
                  onClick={() => setVariant(el.sku)}
                  className={clsx(
                    'flex items-center gap-2 p-2 border cursor-pointer',
                    variant === el.sku && 'border-red-500'
                  )}
                >
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="flex flex-col ">
                    <span>{el.color}</span>
                    <span className="text-sm">{el.price}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity</span>
                <SelectQuantity
                  quantity={quantity}
                  handleQuantity={handleQuantity}
                  handleChangeQuantity={handleChangeQuantity}
                />
              </div>
              <div className="cursor-pointer relative">
                {isShowCustom && (
                  <div class="absolute  bottom-0 right-[28px] w-full bg-white shadow-md rounded-md min-w-[200px] h-[100px]">
                    <textarea
                      className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-4 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                      onChange={(e) => setvalueCustomProduct(e.target.value)}
                    />

                    <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                      Custom
                    </label>
                  </div>
                )}
                <span onClick={() => setIsShowCustom(!isShowCustom)}>
                  <FcCustomerSupport size={30} />
                </span>
              </div>
            </div>

            {valueCustomProduct ? (
              <Button handleOnclick={handleAddToMyCart} fw>
                Add to My Custom Cart
              </Button>
            ) : (
              <Button handleOnclick={handleAddToCart} fw>
                Add to Cart
              </Button>
            )}
          </div>
        </div>
        {!isQuickView && (
          <div className="  w-1/5">
            {productExtraInfomation.map((el) => (
              <ProductExtraInfoItem
                key={el.id}
                title={el.title}
                icon={el.icon}
                sub={el.sub}
              />
            ))}
          </div>
        )}
      </div>
      {!isQuickView && (
        <div className="w-main m-auto mt-8">
          <ProductInfomation
            totalRatings={product?.totalRatings}
            ratings={product?.ratings}
            nameProduct={product?.title}
            pid={product?._id}
            rerender={rerender}
          />
        </div>
      )}
      {!isQuickView && (
        <>
          <div className="w-main m-auto mt-8">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main mb-8">
              OTHER CUSTOMERS ALSO BUY:
            </h3>

            <CustomSlider normal={true} products={relatedProducts} />
          </div>

          <div className="h-[100px] w-full"></div>
        </>
      )}
    </div>
  )
}

export default withBaseComponent(DetailProduct)
