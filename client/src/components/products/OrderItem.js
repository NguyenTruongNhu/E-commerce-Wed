import { apiRemoveCart } from 'apis'
import SelectQuantity from 'components/common/SelectQuantity'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { useEffect, useState } from 'react'
import { ImBin } from 'react-icons/im'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { updateCart } from 'store/user/userSlice'
import { formatMoney } from 'ultils/helper'

const OrderItem = ({
  color,
  dfQuantity = 1,
  price,
  title,
  thumbnail,
  pid,
  dispatch
}) => {
  const [quantity, setQuantity] = useState(() => dfQuantity)
  const handleQuantity = (number) => {
    if (+number > 1) setQuantity(number)
  }
  const removeCart = async (pid, color) => {
    const response = await apiRemoveCart(pid, color)
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  const handleChangeQuantity = (flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity((prev) => +prev - 1)
    if (flag === 'plus') setQuantity((prev) => +prev + 1)
  }
  useEffect(() => {
    dispatch(updateCart({ pid, quantity, color }))
  }, [quantity])
  return (
    <div className="w-main mx-auto font-bold border-b  py-3 grid grid-cols-10">
      <span className="col-span-6 w-full text-center">
        <div className="flex gap-2 px-4 py-3">
          <img src={thumbnail} alt="thumb" className="w-28 h-28 object-cover" />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm text-main">{title}</span>
            <span className="text-[10px] font-semibold">{color}</span>
          </div>
        </div>
      </span>
      <span className="col-span-1 w-full text-center">
        <div className="flex items-center h-full">
          <SelectQuantity
            quantity={quantity}
            handleQuantity={handleQuantity}
            handleChangeQuantity={handleChangeQuantity}
          />
        </div>
      </span>
      <span className="col-span-2 w-full h-full flex items-center justify-center text-center">
        <span className="text-lg">{formatMoney(price * quantity) + 'VNĐ'}</span>
      </span>
      <span className=" cursor-pointer col-span-1 w-full h-full flex items-center justify-center  ">
        <span
          onClick={() => removeCart(pid, color)}
          className="w-8 h-8 hover:bg-gray-500 rounded-full flex items-center justify-center"
        >
          <ImBin size={16} />
        </span>
      </span>
    </div>
  )
}

export default withBaseComponent(OrderItem)
