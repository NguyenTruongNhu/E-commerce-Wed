import { InputForm } from 'components'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import icons from 'ultils/icons'
import UpdateBrand from './UpdateBrand'
import { getCategories } from 'store/app/asyncActions'
import withBaseComponent from 'hocs/withBaseComponent'
import { toast } from 'react-toastify'
import { apiDeleteAllBrand } from 'apis'
import Swal from 'sweetalert2'
import DeleteOneBrand from './DeleteOneBrand'

const { BiEdit, RiDeleteBin6Line, MdOutlineDeleteSweep } = icons

const ManageBrand = ({ dispatch }) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [editBrand, setEditBrand] = useState(null)
  const [deleteOneBrand, setDeleteOneBrand] = useState(null)
  const [update, setUpdate] = useState(false)
  const { categories } = useSelector((state) => state.app)
  const render = useCallback(() => {
    setUpdate(!update)
  }, [update])
  useEffect(() => {
    dispatch(getCategories())
  }, [update])

  //Delete All
  const handleDeleteAllBrandel = async (pcid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure remove this all Brand',
      icon: 'warning',
      showCancelButton: true
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteAllBrand(pcid)
        if (response.success) toast.success(response.mes)
        else toast.error(response.mes)
        render()
      }
    })
  }

  return (
    <div className="w-full relative px-4">
      {editBrand && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <UpdateBrand
            setEditBrand={setEditBrand}
            editBrand={editBrand}
            render={render}
          />
        </div>
      )}
      {deleteOneBrand && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <DeleteOneBrand
            setDeleteOneBrand={setDeleteOneBrand}
            deleteOneBrand={deleteOneBrand}
            render={render}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0 z-10">
        <h1 className="text-3xl font-bold tracking-tight">Manage Brands</h1>
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

      {categories?.map((el, inx) => (
        <table key={inx} className="table-auto w-full mb-10">
          <thead>
            <tr className="border bg-sky-500 text-white border-white ">
              <th className="text-center py-2">{el.title}</th>
            </tr>
          </thead>
          <tbody className="flex">
            <tr className="w-1/5 border border-red-500">
              <td className="flex h-full items-center justify-center py-2">
                Brand
              </td>
            </tr>
            <tr className="w-3/5 border border-green-500">
              <td className="justify-center py-2">
                <ul className="flex  gap-5 items-center justify-center">
                  {el.brand.map((i, index) => (
                    <li key={index}>{i}</li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr className="w-1/5 border border-yellow-500">
              <td className="flex h-full items-center justify-center">
                <span
                  onClick={() => setEditBrand(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <BiEdit size={20} />
                </span>
                <span
                  onClick={() => setDeleteOneBrand(el)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <MdOutlineDeleteSweep size={20} />
                </span>
                <span
                  onClick={() => handleDeleteAllBrandel(el._id)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <RiDeleteBin6Line size={20} />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  )
}

export default withBaseComponent(ManageBrand)
