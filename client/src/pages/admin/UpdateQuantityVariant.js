import { apiUpdateQuantityVariant } from 'apis'
import { Button, InputForm, Loading } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'

const UpdateQuantityVariant = ({
  editQuantityVariant,
  setEditQuantityVariant,
  render,
  dispatch
}) => {
  const {
    register,
    formState: { errors },
    watch,
    reset,
    handleSubmit
  } = useForm()

  useEffect(() => {
    reset({
      title: editQuantityVariant?.title,
      color: editQuantityVariant?.color,
      price: editQuantityVariant?.price,
      quantity: editQuantityVariant?.quantity,
      sku: editQuantityVariant?.sku
    })
  }, [editQuantityVariant])
  const handleEditQuantityVariant = async (data) => {
    const finalPayload = { ...data }

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiUpdateQuantityVariant(
      finalPayload,
      editQuantityVariant.proId
    )
    dispatch(showModal({ isShowModal: false, modalChildren: null }))

    if (response.success) {
      toast.success(response.mes)
      render()
      setEditQuantityVariant(null)
    } else {
      toast.error(response.mes)
    }
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Update Quantity Variant
        </h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditQuantityVariant(null)}
        >
          Back
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleEditQuantityVariant)}
        className="p-4 w-full flex flex-col gap-4"
      >
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Name"
            register={register}
            errors={errors}
            id="title"
            fullwidth
            style="flex-auto"
            validate={{
              required: 'Need fill this field'
            }}
            placeholder="Title of variant"
          />
          <InputForm
            label="Sku"
            register={register}
            errors={errors}
            id="sku"
            fullwidth
            style="flex-auto"
            placeholder="Sku of variant"
          />
          <InputForm
            label="Price variant"
            register={register}
            errors={errors}
            id="price"
            validate={{
              required: 'Need fill this field'
            }}
            fullwidth
            placeholder="Price of new variant"
            type="number"
            style="flex-auto"
          />
        </div>
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Quantity variant"
            register={register}
            errors={errors}
            id="quantity"
            validate={{
              required: 'Need fill this field'
            }}
            fullwidth
            placeholder="Quantity of new variant"
            type="number"
            style="flex-auto"
          />
          <InputForm
            label="Color variant"
            register={register}
            errors={errors}
            id="color"
            validate={{
              required: 'Need fill this field'
            }}
            fullwidth
            placeholder="Color of new variant"
            style="flex-auto"
          />
        </div>
        <div className="my-8">
          <Button type="submit">Update Quantity variant</Button>
        </div>
      </form>
    </div>
  )
}

export default withBaseComponent(UpdateQuantityVariant)
