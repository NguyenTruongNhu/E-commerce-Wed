import React, { useCallback, useState, useEffect } from "react";
import { InputForm, Select, Button, MartdownEditor } from "components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { validate, getBase64 } from "ultils/helper";
import { toast } from "react-toastify";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { apiCreateProduct } from "apis";

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm();

  const [payload, setPayload] = useState({
    description: "",
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [hoverElm, setHoverElm] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    if (imagesPreview.length > 0)
      setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);
  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category)
        data.category = categories?.find(
          (el) => el._id === data.category
        )?.title;
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);

      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append("images", image);
      }
      const response = await apiCreateProduct(formData);
      console.log(response);
    }
  };

  // const handleRemoveImage = (name) => {
  //   const files = [...watch("images")];
  //   reset({
  //     images: files?.filter((el) => el.name !== name),
  //   });
  //   if (preview.images?.some((el) => el.name === name))
  //     setPreview((prev) => ({
  //       ...prev,
  //       images: prev.images?.filter((el) => el.name !== name),
  //     }));
  // };

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold border-b px-4">
        <span>Create New Product</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label="Name Product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
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
                required: "Need fill this field",
              }}
              style="flex-auto"
              placeholder="Price of new product"
              type="number"
            />
            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantiy"
              style="flex-auto"
              validate={{
                required: "Need fill this field",
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
                required: "Need fill this field",
              }}
              fullwidth
              placeholder="Color of new product"
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id="category"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              errors={errors}
              fullwidth
            />
            <Select
              label="Brand (Optional)"
              options={categories
                ?.find((el) => el._id === watch("category"))
                ?.brand?.map((el) => ({ code: el, value: el }))}
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
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: "Need fill" })}
            />
            {errors["thumb"] && (
              <small className="text-xs text-red-500 italic">
                {errors["thumb"]?.message}
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
            <input
              type="file"
              id="products"
              {...register("images", { required: "Need fill" })}
              multiple
            />
            {errors["images"] && (
              <small className="text-xs text-red-500 italic">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preview.images?.map((el, index) => (
                <div
                  onMouseEnter={() => setHoverElm(el.name)}
                  onMouseLeave={() => setHoverElm(null)}
                  key={index}
                  className="w-fit relative"
                >
                  <img
                    src={el.path}
                    alt="products"
                    className="w-[200px] object-contain"
                  />
                  {/* {hoverElm === el.name && (
                    <div
                      className="absolute cursor-pointer inset-0 bg-overlay flex items-center justify-center"
                      onClick={() => handleRemoveImage(el.name)}
                    >
                      <RiDeleteBin2Fill size={24} color="white" />
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
          <div className="my-8">
            <Button type="submit">Create new product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
