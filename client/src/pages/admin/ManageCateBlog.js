import { apiDeleteCateBlog, apiGetCateBlog } from 'apis/blogCategory'
import { InputForm, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import useDebounce from 'hooks/useDebounce'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import icons from 'ultils/icons'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import UpdateCateBlog from './UpdateCateBlog'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const { BiEdit, RiDeleteBin6Line } = icons
const ManageCateBlog = ({ navigate, location }) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm()

  const [params] = useSearchParams()
  const [counts, setCounts] = useState(0)
  const [cateBlog, setCateBlog] = useState(null)
  const [editCategory, setEditCategory] = useState(null)
  const [update, setUpdate] = useState(false)
  const render = useCallback(() => {
    setUpdate(!update)
  }, [])
  const fetchCategoryBlogs = async (params) => {
    const response = await apiGetCateBlog({
      ...params,
      limit: process.env.REACT_APP_LIMIT
    })
    if (response.success) {
      setCounts(response.counts)
      setCateBlog(response.blogs)
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
    fetchCategoryBlogs(searchParams)
  }, [params, update])

  const handleDeleteCateBlog = (bcid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this category blog',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteCateBlog(bcid)
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
          <UpdateCateBlog
            setEditCategory={setEditCategory}
            editCategory={editCategory}
            render={render}
          />
        </div>
      )}
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Manage Categories Blog
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
            {/* <th className="text-center py-2">#</th> */}
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Created At</th>
            <th className="text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {cateBlog?.map((el, i) => (
            <tr className="border-b" key={i}>
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
                  onClick={() => handleDeleteCateBlog(el._id)}
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

export default withBaseComponent(ManageCateBlog)
