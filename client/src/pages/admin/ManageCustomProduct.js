import { apiGetProducts, apiGetUsers } from 'apis'
import { InputForm } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import useDebounce from 'hooks/useDebounce'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
const ManageCustomProduct = ({ navigate, location }) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm()
  const [params] = useSearchParams()
  const [productCus, setProductCus] = useState(null)
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
  const queryDebounce = useDebounce(watch('q'), 800)
  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString()
      })
    } else
      navigate({
        pathname: location.pathname
      })
  }, [queryDebounce])
  useEffect(() => {
    const pr = Object.fromEntries([...params])
    fetchAll(pr)
  }, [params])
  return (
    <div className="w-full relative px-4">
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        User Custom Product
      </header>
      <div className="flex w-full justify-end items-center px-4">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullwidth
            placeholder="Search products by title, description,..."
          />
        </form>
      </div>
      <table className="table-auto w-full ">
        <thead>
          <tr className="border bg-sky-900 text-white border-white ">
            <th className="text-center py-2">#</th>
            <th className="text-center py-2">Product</th>
            <th className="text-center py-2">Name User</th>
            <th className="text-center py-2 w-[650px]">Note</th>
            <th className="text-center py-2">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {productCus?.map((el, index) => (
            <tr className="border-b" key={index}>
              <td className="text-center py-2">
                {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  index +
                  1}
              </td>
              <td className="text-center py-2 max-w-[500px]">
                <span className="grid  grid-cols-1 gap-4">
                  {el.userCustomProduct?.map((item, index) => (
                    <span
                      key={index}
                      className="flex col-span-1 items-center gap-2"
                    >
                      <img
                        src={item.product.thumb}
                        alt="thumb"
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="flex flex-col">
                        <span className="text-main text-sm">
                          {item.product.title}
                        </span>
                        <span className="flex items-center text-xs gap-2">
                          <span>Quantity:</span>
                          <span className="text-main">
                            {item.product.quantity}
                          </span>
                        </span>
                      </span>
                    </span>
                  ))}
                </span>
              </td>

              <td className="text-center py-2">{`${el.firstname} ${el.lastname}`}</td>
              <td className="text-center py-2">
                {el.userCustomProduct?.map((item, index) => (
                  <span key={index} className="flex gap-2 justify-center p-2">
                    <span className="text-main">{`${item.product.title}:`}</span>
                    <span className="flex">{item.note}</span>
                  </span>
                ))}
              </td>

              <td className="text-center py-2">
                {moment(el.updatedAt)?.format('DD/MM/YYYY')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default withBaseComponent(ManageCustomProduct)
