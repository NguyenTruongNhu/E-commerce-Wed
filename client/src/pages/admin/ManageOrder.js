import { apiGetOrders } from 'apis'
import { CustomSelect, InputForm, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrder } from 'ultils/contants'
const ManageOrder = ({ navigate, location }) => {
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useForm()
  const status = watch('status')
  const fectchGetOrders = async () => {
    const response = await apiGetOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT
    })
    if (response.success) {
      setOrders(response.orders)
      setCounts(response.counts)
    }
  }
  useEffect(() => {
    const pr = Object.fromEntries([...params])
    fectchGetOrders(pr)
  }, [params])
  const handleSearchStatus = ({ value }) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString()
    })
  }
  return (
    <div className="w-full relative px-4">
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Manage Orders
      </header>
      <div className="flex w-full justify-end items-center px-4">
        <form className="w-[45%] grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <InputForm
              id="q"
              register={register}
              errors={errors}
              fullwidth
              placeholder="Search orders by status,..."
            />
          </div>
          <div className="col-span-1 flex items-center">
            <CustomSelect
              options={statusOrder}
              value={status}
              onChange={(val) => handleSearchStatus(val)}
              wrapClassname="w-full"
            />
          </div>
        </form>
      </div>
      <table className="table-auto w-full ">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">#</th>
            <th className="text-center py-2">Product</th>
            <th className="text-center py-2">Name</th>
            <th className="text-center py-2">Phone</th>
            <th className="text-center py-2">Address</th>
            <th className="text-center py-2">Status</th>
            <th className="text-center py-2">Total</th>
            <th className="text-center py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((el, index) => (
            <tr className="border-b" key={el._id}>
              <td className="text-center py-2">
                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  index +
                  1}
              </td>
              <td className="text-center py-2 max-w-[200px]">
                <span className="grid grid-cols-1  gap-2">
                  {el.products?.map((item) => (
                    <span
                      className="flex col-span-1 items-center gap-2"
                      key={item._id}
                    >
                      <img
                        src={item.thumbnail}
                        alt="thumb"
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="flex flex-col">
                        <span className="text-main text-sm">{item.title}</span>
                        <span className="flex items-center text-xs gap-2">
                          <span>Quantity:</span>
                          <span className="text-main">{item.quantity}</span>
                        </span>
                      </span>
                    </span>
                  ))}
                </span>
              </td>
              <td className="text-center py-2">{`${el?.orderBy?.firstname} ${el?.orderBy?.lastname}`}</td>

              <td className="text-center py-2">{el?.orderBy?.mobile}</td>
              <td className="text-center py-2">{el?.orderBy?.address}</td>
              <td className="text-center py-2">{el?.status}</td>
              <td className="text-center py-2">{el?.total + '💲'}</td>
              <td className="text-center py-2">
                {moment(el.createdAt)?.format('DD/MM/YYYY')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  )
}

export default withBaseComponent(ManageOrder)
