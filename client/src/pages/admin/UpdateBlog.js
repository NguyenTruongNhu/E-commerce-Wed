import React, { memo, useState, useCallback, useEffect } from 'react'
import { InputForm, Select, Button, MartdownEditor, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { validate, getBase64 } from 'ultils/helper'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { apiUpdateBlog } from 'apis'
import { showModal } from 'store/app/appSlice'

const UpdateBlog = ({ editBlog, render, setEditBlog }) => {
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

  useEffect(() => {
    reset({
      title: editBlog?.title || '',
      caption: editBlog?.caption || '',
      category: editBlog?.category || ''
    })
    setPayload({
      description:
        typeof editBlog?.description === 'object'
          ? editBlog?.description?.join(', ')
          : editBlog?.description
    })
    setPreview({
      photo: editBlog?.photo || ''
    })
  }, [editBlog])
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
    if (watch('photo') instanceof FileList && watch('photo').length > 0) {
      handlePreviewPhoto(watch('photo')[0])
    }
  }, [watch('photo')])

  const handleUpdateBlog = async (data) => {
    const invalids = validate(payload, setInvalidFields)
    if (invalids === 0) {
      const finalPayload = { ...data, ...payload }
      finalPayload.photo =
        data?.photo?.length === 0 ? preview.photo : data.photo[0]

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiUpdateBlog(finalPayload, editBlog._id)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))

      if (response.success) {
        toast.success(response.mes)
        render()
        setEditBlog(null)
        setPayload({
          photo: ''
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
        <h1 className="text-3xl font-bold tracking-tight">Update blog</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditBlog(null)}
        >
          Cancel
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateBlog)}>
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
            value={payload.description}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="photo">
              Upload photo
            </label>
            <input type="file" id="photo" {...register('photo')} />
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
                alt="photonail"
                className="w-[200px] object-contain"
              />
            </div>
          )}

          <div className="my-8">
            <Button type="submit">Update new blog</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(UpdateBlog)
