import { apiDeleteVariant, apiGetProducts } from 'apis'
import { InputForm } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import useDebounce from 'hooks/useDebounce'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import icons from 'ultils/icons'
import UpdateVariant from './UpdateVariant'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const { BiEdit, RiDeleteBin6Line } = icons

const ManageVariant = ({ navigate, location }) => {
  const [variants, setVariants] = useState(null)
  const [editVariant, setEditVariant] = useState(null)
  const [update, setUpdate] = useState(false)
  const [params] = useSearchParams()
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const fetchVariant = async (params) => {
    const response = await apiGetProducts({
      ...params,
      sort: '-variants'
    })
    if (response.success)
      setVariants(
        response.products
          ?.filter((el) => el.variants.length > 0)
          ?.map((el) => el.variants)
      )
  }
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])
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
    const pr = Object.fromEntries([...params])
    fetchVariant(pr)
  }, [params, update])

  const handleDeleteVariant = (vid, pid, color) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this variant',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteVariant(pid, vid, color)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
    })
  }
  return (
    <div className="w-full relative px-4">
      {editVariant && (
        <div className="absolute inset-0 h-fit bg-gray-100 z-50">
          <UpdateVariant
            setEditVariant={setEditVariant}
            editVariant={editVariant}
            render={render}
          />
        </div>
      )}
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Manage Variant
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
            <th className="text-center py-2">Color</th>
            <th className="text-center py-2">Price</th>
            <th className="text-center py-2">Updated At</th>
            <th className="text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants &&
            variants?.map((i) =>
              i?.map((el) => (
                <tr className="border-b" key={el._id}>
                  <td className="text-center py-2 flex items-center justify-center">
                    <img
                      src={el.thumb}
                      alt="thumb"
                      className="w-12 h-12 object-cover"
                    />
                  </td>

                  <td className="text-center py-2">{el.title}</td>
                  <td className="text-center py-2">{el.color}</td>
                  <td className="text-center py-2">{el.price}</td>

                  <td className="text-center py-2">
                    {moment(el.updatedAt)?.format('DD/MM/YYYY')}
                  </td>
                  <td className="text-center py-2">
                    <span
                      onClick={() => setEditVariant(el)}
                      className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                    >
                      <BiEdit size={20} />
                    </span>
                    <span
                      onClick={() =>
                        handleDeleteVariant(el._id, el.proId, el.color)
                      }
                      className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                    >
                      <RiDeleteBin6Line size={20} />
                    </span>
                  </td>
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  )
}

export default withBaseComponent(ManageVariant)
