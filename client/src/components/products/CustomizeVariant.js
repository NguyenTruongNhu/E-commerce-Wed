import Button from 'components/buttons/Button'
import InputForm from 'components/inputs/InputForm'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getBase64 } from 'ultils/helper'
import { apiAddVariant } from 'apis'
import Swal from 'sweetalert2'
import { showModal } from 'store/app/appSlice'
import { useDispatch } from 'react-redux'
import Loading from 'components/common/Loading'

const CustomizeVariant = ({
  setCustomizeVariant,
  customizeVariant,
  render
}) => {
  const {
    register,
    formState: { errors },
    watch,
    reset,
    handleSubmit
  } = useForm()
  const dispatch = useDispatch()
  const [preview, setPreview] = useState({
    thumb: '',
    images: []
  })

  useEffect(() => {
    reset({
      title: customizeVariant?.title,
      color: customizeVariant?.color,
      price: customizeVariant?.price
    })
  }, [customizeVariant])
  const handleAddVariant = async (data) => {
    if (data.color === customizeVariant.color)
      Swal.fire('Oops!', 'Color not changed', 'info')
    else {
      const formData = new FormData()
      for (let i of Object.entries(data)) formData.append(i[0], i[1])

      if (data.thumb) formData.append('thumb', data.thumb[0])
      if (data.images) {
        for (let image of data.images) formData.append('images', image)
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiAddVariant(formData, customizeVariant._id)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
      if (response.success) {
        toast.success(response.mes)
        reset()
        setPreview({ thumb: '', images: [] })
      } else {
        toast.error(response.mes)
      }
    }
  }
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file)
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }))
  }
  const handlePreviewImages = async (files) => {
    const imagesPreview = []
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('File not supported!')
        return
      }
      const base64 = await getBase64(file)
      imagesPreview.push(base64)
    }
    if (imagesPreview.length > 0)
      setPreview((prev) => ({ ...prev, images: imagesPreview }))
  }

  useEffect(() => {
    if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
      handlePreviewThumb(watch('thumb')[0])
    }
  }, [watch('thumb')])
  useEffect(() => {
    if (watch('images') instanceof FileList && watch('images').length > 0) {
      handlePreviewImages(watch('images'))
    }
  }, [watch('images')])
  return (
    <div className="w-full h-[100%]  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Customize variants of products
        </h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setCustomizeVariant(null)}
        >
          Back
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleAddVariant)}
        className="p-4 w-full flex flex-col gap-4"
      >
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Original name"
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
        </div>

        <div className="flex gap-4 items-center w-full">
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
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <label className="font-semibold" htmlFor="thumb">
            Upload thumb
          </label>
          <input type="file" id="thumb" {...register('thumb')} />
          {errors['thumb'] && (
            <small className="text-xs text-red-500 italic">
              {errors['thumb']?.message}
            </small>
          )}
        </div>
        {preview.thumb && (
          <div className="my-4">
            <img
              src={preview.thumb}
              alt="thumbnail"
              className="w-[200px] object-contain"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 mt-8">
          <label className="font-semibold" htmlFor="products">
            Upload images of product
          </label>
          <input type="file" id="products" {...register('images')} multiple />
          {errors['images'] && (
            <small className="text-xs text-red-500 italic">
              {errors['images']?.message}
            </small>
          )}
        </div>
        {preview.images.length > 0 && (
          <div className="my-4 flex w-full gap-3 flex-wrap">
            {preview.images?.map((el, index) => (
              <div key={index} className="w-fit relative">
                <img
                  src={el}
                  alt="products"
                  className="w-[200px] object-contain"
                />
              </div>
            ))}
          </div>
        )}
        <div className="my-8">
          <Button type="submit">Add variant</Button>
        </div>
      </form>
    </div>
  )
}

export default memo(CustomizeVariant)
