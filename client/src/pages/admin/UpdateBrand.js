import { Button, InputForm, Select } from 'components'
import React from 'react'
import { useForm } from 'react-hook-form'

const UpdateBrand = ({ setEditBrand, editBrand, render }) => {
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm()
  const handleUpdateBrand = (data) => {
    console.log(data)
  }
  return (
    <div className="w-full  flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Update Brand</h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditBrand(null)}
        >
          Back
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateBrand)}>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Brand"
              options={editBrand?.brand?.map((el, index) => ({
                code: el.toLowerCase(),
                value: el
              }))}
              register={register}
              id="brand"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              errors={errors}
              fullwidth
            />
            <InputForm
              label="Edit Brand"
              register={register}
              errors={errors}
              id="editBrand"
              style="flex-auto"
              validate={{
                required: 'Need fill this field'
              }}
              fullwidth
            />
          </div>
          <div className="my-8">
            <Button type="submit">Update brand</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateBrand
