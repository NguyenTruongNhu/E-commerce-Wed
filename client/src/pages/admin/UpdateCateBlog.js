import { apiUpdateCategory } from 'apis'
import { apiUpdateCateBlog } from 'apis/blogCategory'
import { Button, InputForm, Loading } from 'components'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import { getBase64 } from 'ultils/helper'

const UpdateCateBlog = ({ setEditCategory, editCategory, render }) => {
  const {
    register,
    formState: { errors },
    watch,
    reset,
    handleSubmit
  } = useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    reset({
      title: editCategory?.title
    })
  }, [editCategory])

  const handleEditCategory = async (data) => {
    const finalPayload = { ...data }

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiUpdateCateBlog(finalPayload, editCategory._id)
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
        <h1 className="text-3xl font-bold tracking-tight">
          Update Category Blog
        </h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditCategory(null)}
        >
          Back
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleEditCategory)}
        className="p-4 w-full flex flex-col "
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
        <div className="my-8">
          <Button type="submit">Updated Category</Button>
        </div>
      </form>
    </div>
  )
}

export default UpdateCateBlog
