import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Pagination } from 'components'
import { useForm } from 'react-hook-form'
import { apiDeleteProduct } from 'apis/product'
import moment from 'moment'
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation
} from 'react-router-dom'
import useDebounce from 'hooks/useDebounce'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import icons from 'ultils/icons'
import { apiDeleteBlog, apiGetBlogs } from 'apis'
import UpdateBlog from './UpdateBlog'

const { BiEdit, RiDeleteBin6Line } = icons

const ManageBlog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [blogs, setBlogs] = useState(null)
  const [counts, setCounts] = useState(0)
  const [editBlog, setEditBlog] = useState(null)
  const [update, setUpdate] = useState(false)

  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])

  const fetchBlog = async (params) => {
    const response = await apiGetBlogs({
      ...params,
      limit: process.env.REACT_APP_LIMIT
    })
    if (response.success) {
      setCounts(response.counts)
      setBlogs(response.mes)
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

    fetchBlog(searchParams)
  }, [params, update])

  const handleDeleteBlog = (Bid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this Blog',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteBlog(Bid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
    })
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      {editBlog && (
        <div className="absolute inset-0 h-fit bg-gray-100 z-50">
          <UpdateBlog
            setEditBlog={setEditBlog}
            editBlog={editBlog}
            render={render}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0 z-10">
        <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
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
            <th className="text-center py-2">STT</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Caption</th>
            <th className="text-center py-2">Category</th>
            <th className="text-center py-2">CreatedAt</th>
            <th className="text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs?.map((el, index) => (
            <tr className="border-b" key={el._id}>
              <td className="text-center py-2">
                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  index +
                  1}
              </td>
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">{el.caption}</td>

              <td className="text-center py-2">{el.category}</td>
              <td className="text-center py-2">
                {moment(el.createdAt).format('DD/MM/YYYY')}
              </td>
              <td className="text-center py-2">
                <span
                  onClick={() => setEditBlog(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <BiEdit size={20} />
                </span>
                <span
                  onClick={() => handleDeleteBlog(el._id)}
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

export default ManageBlog
