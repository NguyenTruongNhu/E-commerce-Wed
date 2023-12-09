import { InputForm, Pagination } from 'components'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import icons from 'ultils/icons'
import UpdateCategory from './UpdateCategory'
import useDebounce from 'hooks/useDebounce'
import withBaseComponent from 'hocs/withBaseComponent'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import {
  apiDeleteCategory,
  apiGetCategories,
  apiGetCategoriesByAdmin
} from 'apis'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const { BiEdit, RiDeleteBin6Line } = icons

const ManageCategories = ({ navigate, location }) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [editCategory, setEditCategory] = useState(null)
  const [categories, setCategories] = useState(null)
  const [update, setUpdate] = useState(false)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()

  const render = useCallback(() => {
    setUpdate(!update)
  }, [])
  const fetchCategories = async (params) => {
    const response = await apiGetCategoriesByAdmin({
      ...params,
      limit: process.env.REACT_APP_LIMIT
    })
    if (response.success) {
      setCounts(response.counts)
      setCategories(response.products)
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
    fetchCategories(searchParams)
  }, [params, update])
  const handleDeleteCategory = (pcid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this product',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteCategory(pcid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
    })
  }
  return (
    <div className="w-full relative px-4">
      {editCategory && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <UpdateCategory
            setEditCategory={setEditCategory}
            editCategory={editCategory}
            render={render}
          />
        </div>
      )}
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Manage Categories
      </header>
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
      <table className="table-auto w-full ">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">Thumb</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Created At</th>
            <th className="text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((el, i) => (
            <tr className="border-b" key={i}>
              <td className="text-center py-2 flex items-center justify-center">
                <img
                  src={el.image}
                  alt="imagee"
                  className="w-12 h-12 object-cover"
                />
              </td>
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">
                {moment(el.createdAt)?.format('DD/MM/YYYY')}
              </td>
              <td className="text-center py-2">
                <span
                  onClick={() => setEditCategory(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <BiEdit size={20} />
                </span>
                <span
                  onClick={() => handleDeleteCategory(el._id)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <RiDeleteBin6Line size={20} />
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

export default withBaseComponent(ManageCategories)
