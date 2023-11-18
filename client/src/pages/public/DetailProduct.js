import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts, apiUpdateCart } from '../../apis'
import {
  Breadcrumb,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInfomation,
  CustomSlider
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

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
}

const DetailProduct = ({ isQuickView, data, navigate, location, dispatch }) => {
  const params = useParams()
  const titleRef = useRef()
  const { current } = useSelector((state) => state.user)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [update, setUpdate] = useState(false)
  const [variant, setVariant] = useState(null)
  const [category, setCategory] = useState(null)
  const [pid, setPid] = useState(null)
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    thumb: '',
    images: '',
    price: '',
    color: ''
  })

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
  // console.log({ currentProduct, currentImage })
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
                  src: currentImage
                },
                largeImage: {
                  src: currentImage,
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
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity</span>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <Button handleOnclick={handleAddToCart} fw>
              Add to Cart
            </Button>
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
