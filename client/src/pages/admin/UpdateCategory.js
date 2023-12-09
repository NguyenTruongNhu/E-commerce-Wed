import { apiUpdateCategory } from 'apis'
import { Button, InputForm, Loading } from 'components'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import { getBase64 } from 'ultils/helper'

const UpdateCategory = ({ setEditCategory, editCategory, render }) => {
  const {
    register,
    formState: { errors },
    watch,
    reset,
    handleSubmit
  } = useForm()
  const dispatch = useDispatch()
  const [preview, setPreview] = useState({
    image: null
  })
  useEffect(() => {
    reset({
      title: editCategory?.title
    })
    setPreview({
      image: editCategory?.image || ''
    })
  }, [editCategory])
  const handlePreviewImage = async (file) => {
    const base64Image = await getBase64(file)
    setPreview((prev) => ({ ...prev, image: base64Image }))
  }

  useEffect(() => {
    if (watch('image') instanceof FileList && watch('image').length > 0) {
      handlePreviewImage(watch('image')[0])
    }
  }, [watch('image')])
  const handleEditCategory = async (data) => {
    const finalPayload = { ...data }
    finalPayload.image =
      data?.image?.length === 0 ? preview.image : data.image[0]

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiUpdateCategory(finalPayload, editCategory._id)
    dispatch(showModal({ isShowModal: false, modalChildren: null }))

    if (response.success) {
      toast.success(response.mes)
      render()
      setEditCategory(null)
    } else {
      toast.error(response.mes)
    }
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Update Category</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditCategory(null)}
        >
          Back
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleEditCategory)}
        className="p-4 w-full flex flex-col gap-4"
      >
        <div className="w-full my-6 flex gap-4">
          <InputForm
            label="Title Category"
            register={register}
            errors={errors}
            id="title"
            placeholder="title of category"
          />
        </div>

        <div className="flex flex-col gap-2 mt-8">
          <label className="font-semibold" htmlFor="image">
            Upload image
          </label>
          <input type="file" id="image" {...register('image')} />
          {errors['image'] && (
            <small className="text-xs text-red-500 italic">
              {errors['image']?.message}
            </small>
          )}
          {preview.image && (
            <div className="my-4">
              <img
                src={preview.image}
                alt="imagenail"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="my-8">
            <Button type="submit">Updated Category</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateCategory
