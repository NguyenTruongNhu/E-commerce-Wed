import React, { memo, useState, useCallback, useEffect } from 'react'
import { InputForm, Select, Button, MartdownEditor, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { validate, getBase64 } from 'ultils/helper'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { apiCreateProduct, apiUpdateProduct } from 'apis'
import { showModal } from 'store/app/appSlice'

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const { categories } = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm()

  const [payload, setPayload] = useState({
    description: ''
  })
  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })

  useEffect(() => {
    reset({
      title: editProduct?.title || '',
      price: editProduct?.price || '',
      quantity: editProduct?.quantity || '',
      color: editProduct?.color || '',
      category: editProduct?.category || '',
      brand: editProduct?.brand?.toLowerCase() || ''
    })
    setPayload({
      description:
        typeof editProduct?.description === 'object'
          ? editProduct?.description?.join(', ')
          : editProduct?.description
    })
    setPreview({
      thumb: editProduct?.thumb || '',
      images: editProduct?.images || []
    })
  }, [editProduct])
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback(
    (e) => {
      setPayload(e)
    },
    [payload]
  )
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

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields)
    if (invalids === 0) {
      if (data.category)
        data.category = categories?.find(
          (el) => el.title === data.category
        )?.title

      const finalPayload = { ...data, ...payload }
      finalPayload.thumb =
        data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]

      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
      finalPayload.images =
        data?.images?.length === 0 ? preview.images : data.images
      for (let image of finalPayload.images) formData.append('images', image)
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiUpdateProduct(formData, editProduct._id)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))

      if (response.success) {
        toast.success(response.mes)
        render()
        setEditProduct(null)
        setPayload({
          thumb: '',
          images: []
        })
      } else {
        toast.error(response.mes)
      }
    }
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0 z-10">
        <h1 className="text-3xl font-bold tracking-tight">Update products</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditProduct(null)}
        >
          Cancel
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Name Product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: 'Need fill this field'
            }}
            fullwidth
            placeholder="Name of new product"
          />
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: 'Need fill this field'
              }}
              style="flex-auto"
              placeholder="Price of new product"
              type="number"
            />
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
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el.title,
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
            <Select
              label="Brand (Optional)"
              options={categories
                ?.find((el) => el.title === watch('category'))
                ?.brand?.map((el) => ({ code: el.toLowerCase(), value: el }))}
              register={register}
              id="brand"
              style="flex-auto"
              errors={errors}
              fullwidth
            />
          </div>
          <MartdownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
          />
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
            <Button type="submit">Update new product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(UpdateProduct)
