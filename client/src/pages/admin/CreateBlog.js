import React, { useCallback, useState, useEffect } from 'react'
import { InputForm, Select, Button, MartdownEditor, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { validate, getBase64 } from 'ultils/helper'
import { toast } from 'react-toastify'
import { apiCreateBlog } from 'apis'
import { showModal } from 'store/app/appSlice'

const CreateBlog = () => {
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
    photo: null
  })
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback(
    (e) => {
      setPayload(e)
    },
    [payload]
  )

  const handlePreviewPhoto = async (file) => {
    const base64Photo = await getBase64(file)
    setPreview((prev) => ({ ...prev, photo: base64Photo }))
  }

  useEffect(() => {
    handlePreviewPhoto(watch('photo')[0])
  }, [watch('photo')])

  const handleCreateBlog = async (data) => {
    const invalids = validate(payload, setInvalidFields)
    if (invalids === 0) {
      const finalPayload = { ...data, ...payload }
      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])

      if (finalPayload.photo) formData.append('photo', finalPayload.photo[0])

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiCreateBlog(formData)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
      if (response.success) {
        toast.success(response.mes)
        reset()
        setPayload({
          photo: ''
        })
      } else {
        toast.error(response.mes)
      }
    }
  }

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold border-b px-4">
        <span>Create New Blog</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateBlog)}>
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Title Blog"
              register={register}
              errors={errors}
              id="title"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
              placeholder="title of new blog"
            />
            <InputForm
              label="Caption"
              register={register}
              errors={errors}
              id="caption"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
              placeholder="Caption of new blog"
            />
            <InputForm
              label="Category"
              register={register}
              errors={errors}
              id="category"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
            />
            {/* <Select
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
            /> */}
          </div>

          <MartdownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="photo">
              Upload photo
            </label>
            <input
              type="file"
              id="photo"
              {...register('photo', { required: 'Need fill' })}
            />
            {errors['photo'] && (
              <small className="text-xs text-red-500 italic">
                {errors['photo']?.message}
              </small>
            )}
          </div>
          {preview.photo && (
            <div className="my-4">
              <img
                src={preview.photo}
                alt="photon"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="my-8">
            <Button type="submit">Create new blog</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog
