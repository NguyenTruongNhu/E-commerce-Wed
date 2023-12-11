import { apiGetUsers } from 'apis'
import { InputForm } from 'components'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const AllProduct = ({ setAllProduct, allProduct, render }) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [productCus, setProductCus] = useState(null)
  const [DetailCus, setDetailCus] = useState(null)
  const fetchAll = async (params) => {
    const response = await apiGetUsers({
      ...params,
      sort: '-userCustomProduct'
    })
    if (response.success)
      setProductCus(
        response?.users?.filter((el) => el.userCustomProduct.length > 0)
      )
  }
  useEffect(() => {
    setDetailCus(
      productCus
        ?.map((el) =>
          el.userCustomProduct.filter(
            (item) => item.product._id === allProduct._id
          )
        )
        .filter((e) => e.length)
    )
  }, [productCus])

  useEffect(() => {
    fetchAll()
  }, [])
  return (
    <div className="w-full flex flex-col gap-4 relative p-4">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b flex bg-gray-100 justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Product Specific Details
        </h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setAllProduct(null)}
        >
          Cancel
        </span>
      </div>
      <div className="px-4"></div>
      <h2 className="text-3xl font-semibold tracking-tight">
        Existing products
      </h2>
      <table className="table-auto ">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">Thumb</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Brand</th>
            <th className="text-center py-2">Category</th>
            <th className="text-center py-2">Price</th>
            <th className="text-center py-2">Quantity</th>
            <th className="text-center py-2">Sold</th>
            <th className="text-center py-2">Color</th>
            <th className="text-center py-2">Ratings</th>
            <th className="text-center py-2">CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b" key={allProduct._id}>
            <td className="text-center py-2">
              <img
                src={allProduct.thumb}
                alt="thumb"
                className="w-12 h-12 object-cover"
              />
            </td>
            <td className="text-center py-2">{allProduct.title}</td>
            <td className="text-center py-2">{allProduct.brand}</td>
            <td className="text-center py-2">{allProduct.category}</td>
            <td className="text-center py-2">{allProduct.price}</td>
            <td className="text-center py-2">{allProduct.quantity}</td>
            <td className="text-center py-2">{allProduct.sold}</td>
            <td className="text-center py-2">{allProduct.color}</td>
            <td className="text-center py-2">{allProduct.totalRatings}</td>
            <td className="text-center py-2">
              {moment(allProduct.createdAt).format('DD/MM/YYYY')}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="px-4"></div>
      <h2 className="text-3xl font-semibold tracking-tight">
        Product Variants
      </h2>
      <table className="table-auto ">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">Thumb</th>
            <th className="text-center py-2">Title</th>
            <th className="text-center py-2">Color</th>
            <th className="text-center py-2">Price</th>
            <th className="text-center py-2">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {allProduct &&
            allProduct?.variants?.map((el) => (
              <tr className="border-b" key={el._id}>
                <td className="text-center py-2 flex items-center justify-center">
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-12 h-12 object-cover"
                  />
                </td>

                <td className="text-center py-2">{el.title}</td>
                <td className="text-center py-2">{el.color}</td>
                <td className="text-center py-2">{el.price}</td>

                <td className="text-center py-2">
                  {moment(el.updatedAt)?.format('DD/MM/YYYY')}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="px-4"></div>
      <h2 className="text-3xl font-semibold tracking-tight">
        Product Custom from User
      </h2>
      <table className="table-auto w-full">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">Product</th>
            <th className="text-center py-2">Note</th>
            <th className="text-center py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {DetailCus?.map((el) =>
            el.map((i, index) => (
              <tr className="border-b" key={index}>
                <td className="text-center py-2 max-w-[500px]">
                  <span className="grid  grid-cols-1 gap-4">
                    <span className="flex col-span-1 items-center gap-2">
                      <img
                        src={i.product?.thumb}
                        alt="thumb"
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="flex flex-col">
                        <span className="text-main text-sm">
                          {i.product?.title}
                        </span>
                        <span className="flex items-center text-xs gap-2">
                          <span>Quantity:</span>
                          <span className="text-main">
                            {i.product?.quantity}
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </td>
                <td key={index} className="text-center py-2">
                  <span key={index} className="flex gap-2 justify-center p-2">
                    <span className="flex">{i.note}</span>
                  </span>
                </td>
                <td className="text-center py-2">{i.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AllProduct
