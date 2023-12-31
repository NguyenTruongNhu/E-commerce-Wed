import React, { memo, useState } from 'react'
import { formatMoney } from 'ultils/helper'
import label from 'assets/new.png'
import trending from 'assets/trending.png'
import { renderStarFromNumber } from 'ultils/helper'
import { SelectOption } from '..'
import icons from 'ultils/icons'
import { createSearchParams } from 'react-router-dom'
import path from 'ultils/path'
import withBaseComponent from 'hocs/withBaseComponent'
import { showModal } from 'store/app/appSlice'
import { DetailProduct } from 'pages/public'
import { apiUpdateCart, apiUpdateWishlist } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import clsx from 'clsx'

const {
  AiFillEye,
  BsFillCartCheckFill,
  BsFillCartPlusFill,
  BsFillSuitHeartFill
} = icons
const Product = ({
  productData,
  isNew,
  normal,
  navigate,
  dispatch,
  location,
  pid,
  className
}) => {
  const [isShowOption, setIsShowOption] = useState(false)
  const { current } = useSelector((state) => state.user)

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation()
    if (flag === 'CART') {
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
        pid: productData?._id,
        color: productData?.color,
        quantity: 1,
        price: productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title
      })
      if (response.success) {
        toast.success(response.mes)
        dispatch(getCurrent())
      } else toast.error(response.mes)
    }
    if (flag === 'WISHLIST') {
      const response = await apiUpdateWishlist(pid)
      if (response.success) {
        dispatch(getCurrent())
        toast.success(response.mes)
      } else toast.error(response.mes)
    }
    if (flag === 'QUICK_VIEW') {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <DetailProduct
              data={{ pid: productData?._id, category: productData?.category }}
              isQuickView
            />
          )
        })
      )
    }
  }
  return (
    <div className={clsx('w-full text-base px-[10px] ', className)}>
      <div
        onClick={(e) =>
          navigate(
            `/${productData?.category?.toLowerCase()}/${productData?._id}/${
              productData?.title
            }`
          )
        }
        className="w-full border  p-[15px] flex flex-col items-center"
        onMouseEnter={(e) => {
          e.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={(e) => {
          e.stopPropagation()
          setIsShowOption(false)
        }}
      >
        <div className="w-full relative ">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slice-top">
              <span
                title="Quick View"
                onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}
              >
                <SelectOption icons={<AiFillEye />} />
              </span>
              {current?.cart?.some(
                (el) => el.product?._id === productData._id
              ) ? (
                <span title="Added to Cart">
                  <SelectOption icons={<BsFillCartCheckFill color="red" />} />
                </span>
              ) : (
                <span
                  title="Add to Cart"
                  onClick={(e) => handleClickOptions(e, 'CART')}
                >
                  <SelectOption icons={<BsFillCartPlusFill color="black" />} />
                </span>
              )}
              <span
                title="Add to Wishlist"
                onClick={(e) => handleClickOptions(e, 'WISHLIST')}
              >
                <SelectOption
                  icons={
                    <BsFillSuitHeartFill
                      color={
                        current?.wishlist?.some((i) => i._id === pid)
                          ? 'red'
                          : 'black'
                      }
                    />
                  }
                />
              </span>
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
            }
            alt=""
            className="w-[274px] h-[274px] object-cover"
          />
          {!normal && (
            <img
              src={isNew ? label : trending}
              alt=""
              className="absolute w-[100px] h-[35px] top-0 right-0 object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Product))
