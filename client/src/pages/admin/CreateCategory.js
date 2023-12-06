import React, { useEffect, useState } from 'react'
import { InputForm, Button, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { getBase64 } from 'ultils/helper'
import { showModal } from 'store/app/appSlice'
import { apiCreateCategory } from 'apis'
import { toast } from 'react-toastify'
const CreateCategory = () => {
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm()
  const [preview, setPreview] = useState({
    image: null
  })
  const handlePreviewImage = async (file) => {
    const base64Image = await getBase64(file)
    setPreview((prev) => ({ ...prev, image: base64Image }))
  }
  useEffect(() => {
    handlePreviewImage(watch('image')[0])
  }, [watch('image')])
  const handleCreateCategory = async (data) => {
    const finalPayload = { ...data }
    const formData = new FormData()
    for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])

    if (finalPayload.image) formData.append('image', finalPayload.image[0])
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiCreateCategory(formData)
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
        <span>Create New Category</span>
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

          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="image">
              Upload image
            </label>
            <input
              type="file"
              id="image"
              {...register('image', { required: 'Need fill' })}
            />
            {errors['image'] && (
              <small className="text-xs text-red-500 italic">
                {errors['image']?.message}
              </small>
            )}
            {preview.image && (
              <div className="my-4">
                <img
                  src={preview.image}
                  alt="imagen"
                  className="w-[200px] object-contain"
                />
              </div>
            )}
            <div className="my-8">
              <Button type="submit">Create new Category</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCategory
