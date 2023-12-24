import React, { useCallback, useEffect, useState } from 'react'
import { CustomizeVariant, InputForm, Pagination } from 'components'
import { useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from 'apis/product'
import moment from 'moment'
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation
} from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import UpdateProduct from './UpdateProduct'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import icons from 'ultils/icons'
import AllProduct from './AllProduct'

const { BiCustomize, BiEdit, RiDeleteBin6Line, RiHeavyShowersLine } = icons

const ManageProduct = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [products, setProducts] = useState(null)
  const [counts, setCounts] = useState(0)
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const [allProduct, setAllProduct] = useState(null)
  const [customizeVariant, setCustomizeVariant] = useState(null)

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

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this product',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteProduct(pid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
    })
  }
  return (
    <div className="w-full flex flex-col gap-4  relative">
      {editProduct && (
        <div className="absolute inset-0 h-fit bg-gray-100 z-20">
          <UpdateProduct
            setEditProduct={setEditProduct}
            editProduct={editProduct}
            render={render}
          />
        </div>
      )}

      {customizeVariant && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-20">
          <CustomizeVariant
            setCustomizeVariant={setCustomizeVariant}
            customizeVariant={customizeVariant}
            render={render}
          />
        </div>
      )}
      {allProduct && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <AllProduct
            setAllProduct={setAllProduct}
            allProduct={allProduct}
            render={render}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full flex bg-gray-100 justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Manage products</h1>
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
            <th className="text-center py-2">Order</th>
            <th className="text-center py-2">Thumb</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Brand</th>
            <th className="text-center py-2">Category</th>
            <th className="text-center py-2">Price</th>
            <th className="text-center py-2">Quantity</th>
            <th className="text-center py-2">Sold</th>
            <th className="text-center py-2">Color</th>
            <th className="text-center py-2">Ratings</th>
            <th className="text-center py-2">Variants</th>
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
              <td className="text-center py-2">{el.price}</td>
              <td className="text-center py-2">{el.quantity}</td>
              <td className="text-center py-2">{el.sold}</td>
              <td className="text-center py-2">{el.color}</td>
              <td className="text-center py-2">{el.totalRatings}</td>
              <td className="text-center py-2">{el?.variants?.length || 0}</td>
              <td className="text-center py-2">
                {moment(el.createdAt).format('DD/MM/YYYY')}
              </td>
              <td className="text-center py-2">
                <span
                  onClick={() => setEditProduct(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <BiEdit size={20} />
                </span>
                <span
                  onClick={() => handleDeleteProduct(el._id)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <RiDeleteBin6Line size={20} />
                </span>
                <span
                  onClick={() => setCustomizeVariant(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <BiCustomize size={20} />
                </span>
                <span
                  onClick={() => setAllProduct(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <RiHeavyShowersLine size={20} />
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

export default ManageProduct
