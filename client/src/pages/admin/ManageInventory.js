import { apiGetProducts } from 'apis'
import { InputForm, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import useDebounce from 'hooks/useDebounce'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import UpdateQuantityProduct from './UpdateQuantityProduct'

const ManageInventory = ({ navigate, location }) => {
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const [update, setUpdate] = useState(false)
  const [editQuantityProduct, setEditQuantityProduct] = useState(null)
  const [params] = useSearchParams()
  const {
    register,
    formState: { errors },
    watch
  } = useForm()

  const render = useCallback(() => {
    setUpdate(!update)
  }, [])
  const fetchProduct = async (params) => {
    const response = await apiGetProducts({
      ...params,
      limit: process.env.REACT_APP_LIMIT
    })
    if (response.success) {
      setCounts(response.counts)
      setProducts(response.products)
    }
  }

  const queryDebounce = useDebounce(watch('q'), 800)
  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString()
      })
    } else
      navigate({
        pathname: location.pathname
      })
  }, [queryDebounce])
  useEffect(() => {
    const searchParams = Object.fromEntries([...params])

    fetchProduct(searchParams)
  }, [params, update])

  return (
    <div className="w-full flex flex-col gap-4  relative">
      {editQuantityProduct && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-20">
          <UpdateQuantityProduct
            setEditQuantityProduct={setEditQuantityProduct}
            editQuantityProduct={editQuantityProduct}
            render={render}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full flex bg-gray-100 justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Manage Inventory</h1>
      </div>
      <div className="flex w-full justify-end items-center px-4">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullwidth
            placeholder="Search products by title, description,..."
          />
        </form>
      </div>
      <table className="table-auto ">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">#</th>
            <th className="text-center py-2">Thumb</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Brand</th>
            <th className="text-center py-2">Category</th>
            <th className="text-center py-2">Color</th>
            <th className="text-center py-2">Quantity</th>
            <th className="text-center py-2">CreatedAt</th>
            <th className="text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((el, index) => (
            <tr className="border-b" key={el._id}>
              <td className="text-center py-2">
                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  index +
                  1}
              </td>
              <td className="text-center py-2">
                <img
                  src={el.thumb}
                  alt="thumb"
                  className="w-12 h-12 object-cover"
                />
              </td>
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">{el.brand}</td>
              <td className="text-center py-2">{el.category}</td>
              <td className="text-center py-2">{el.color}</td>
              <td className="text-center py-2">{el.quantity}</td>
              <td className="text-center py-2">
                {moment(el.createdAt).format('DD/MM/YYYY')}
              </td>
              <td className="text-center py-2">
                <span
                  onClick={() => setEditQuantityProduct(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <BiEdit size={20} />
                </span>
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

export default withBaseComponent(ManageInventory)
