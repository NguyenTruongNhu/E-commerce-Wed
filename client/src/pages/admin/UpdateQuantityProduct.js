import { apiUpdateQuantityProduct } from 'apis'
import { Button, InputForm, Loading } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'

const UpdateQuantityProduct = ({
  setEditQuantityProduct,
  editQuantityProduct,
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
  useEffect(() => {
    reset({
      title: editQuantityProduct?.title || '',
      quantity: editQuantityProduct?.quantity || '',
      color: editQuantityProduct?.color || ''
    })
  }, [editQuantityProduct])

  const handleUpdateProduct = async (data) => {
    const finalPayload = { ...data }

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiUpdateQuantityProduct(
      finalPayload,
      editQuantityProduct._id
    )
    dispatch(showModal({ isShowModal: false, modalChildren: null }))

    if (response.success) {
      toast.success(response.mes)
      render()
      setEditQuantityProduct(null)
    } else {
      toast.error(response.mes)
    }
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0 z-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Update Quantity products
        </h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditQuantityProduct(null)}
        >
          Cancel
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Name Product"
              register={register}
              errors={errors}
              id="title"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
              placeholder="Name of new product"
            />

            <InputForm
              label="Color"
              register={register}
              errors={errors}
              id="color"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
              placeholder="Color of new product"
            />
          </div>
          <InputForm
            label="Quantity"
            register={register}
            errors={errors}
            id="quantity"
            style="flex-auto"
            validate={{
              required: 'Need fill this field'
            }}
            fullwidth
            placeholder="Price of new product"
            type="number"
          />
          <div className="my-8">
            <Button type="submit">Update quantity product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(UpdateQuantityProduct))
