import { apiDeleteOneBrand } from 'apis'
import { Button, Loading, Select } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import Swal from 'sweetalert2'
import { capitalize_Words } from 'ultils/helper'

const DeleteOneBrand = ({
  setDeleteOneBrand,
  deleteOneBrand,
  render,
  dispatch
}) => {
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm()
  window.scrollTo(0, 0)
  const handleDeleteOneBrand = async (data) => {
    const UptocaseBrand = capitalize_Words(data.brand)
    const newBrands = JSON.parse(JSON.stringify(deleteOneBrand.brand))
    newBrands.splice(newBrands.indexOf(UptocaseBrand), 1)

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiDeleteOneBrand(newBrands, deleteOneBrand._id)
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
    if (response.success) {
      toast.success(response.mes)
      render()
      setDeleteOneBrand(null)
    } else toast.error(response.mes)
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Delete One Brand</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setDeleteOneBrand(null)}
        >
          Back
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleDeleteOneBrand)}>
          <Select
            label="Brand"
            options={deleteOneBrand?.brand?.map((el, index) => ({
              code: el.toLowerCase(),
              value: el
            }))}
            register={register}
            id="brand"
            style="flex-auto"
            validate={{
              required: 'Need fill this field'
            }}
            errors={errors}
            fullwidth
          />
          <div className="my-8">
            <Button type="submit">Delete One brand</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withBaseComponent(DeleteOneBrand)
