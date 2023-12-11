import { apiCreateCateBlog } from 'apis/blogCategory'
import { Button, InputForm, Loading } from 'components'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'

const CreateCateBlog = () => {
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm()
  const handleCreateCategory = async (data) => {
    const finalPayload = { ...data }
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiCreateCateBlog(finalPayload)
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
        <span>Create New Category Blog</span>
      </h1>

      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateCategory)}>
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Title Category"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: 'Need fill this field'
              }}
              placeholder="title of new category"
            />
          </div>
          <div className="my-8">
            <Button type="submit">Create new Category Blog</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCateBlog
