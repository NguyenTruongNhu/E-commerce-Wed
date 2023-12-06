import { InputForm } from 'components'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import icons from 'ultils/icons'
import UpdateBrand from './UpdateBrand'

const { BiEdit, RiDeleteBin6Line } = icons

const ManageBrand = () => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [editBrand, setEditBrand] = useState(null)
  const { categories } = useSelector((state) => state.app)

  return (
    <div className="w-full relative px-4">
      {editBrand && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <UpdateBrand
            setEditBrand={setEditBrand}
            editBrand={editBrand}
            // render={render}
          />
        </div>
      )}
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Manage Brand
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
                  {el.brand.map((i) => (
                    <li>{i}</li>
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
                  // onClick={() => handleDeleteBlog(el._id)}
                  className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
                >
                  <RiDeleteBin6Line size={20} />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
      {/* <table className="table-auto w-full mb-10">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">Category</th>
          </tr>
        </thead>
        <tbody className="flex">
          <tr className="w-1/5 border border-red-500">
            <td className="flex h-full items-center justify-center">brand</td>
          </tr>
          <tr className="w-3/5 border border-green-500">
            <td>
              <ul>
                <li>nhu</li>
              </ul>
            </td>
          </tr>
          <tr className="w-1/5 border border-yellow-500">
            <td className="flex h-full items-center justify-center">
              <span
                // onClick={() => setEditBlog(el)}
                className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
              >
                <BiEdit size={20} />
              </span>
              <span
                // onClick={() => handleDeleteBlog(el._id)}
                className="text-blue-500 hover:text-orange-500 hover:underline inline-block cursor-pointer px-1"
              >
                <RiDeleteBin6Line size={20} />
              </span>
            </td>
          </tr>
        </tbody>
      </table> */}
    </div>
  )
}

export default ManageBrand
