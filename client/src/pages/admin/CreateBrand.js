import React from 'react'
import { InputForm, Button, Select, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from 'store/app/appSlice'
import { apiCreateBrand } from 'apis'
import { toast } from 'react-toastify'
const CreateBrand = () => {
  const { categories } = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm()

  const handleCreateBrand = async (data) => {
    const finalPayload = { ...data }
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiCreateBrand(finalPayload)
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
    if (response.success) {
      toast.success(response.mes)
      reset()
    } else {
      toast.error(response.mes)
    }
  }
  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold border-b px-4">
        <span>Create New Brand</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateBrand)}>
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Brand"
              register={register}
              errors={errors}
              id="brand"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
            />
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title
              }))}
              register={register}
              id="category"
              validate={{
                required: 'Need fill this field'
              }}
              style="flex-auto"
              errors={errors}
              fullwidth
            />
          </div>
          <div className="my-8">
            <Button type="submit">Create new brand</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBrand
