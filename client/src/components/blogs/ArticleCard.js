import React, { memo } from 'react'
import withBaseComponent from 'hocs/withBaseComponent'
import { BsCheckLg } from 'react-icons/bs'
import DOMPurify from 'dompurify'

const ArticleCard = ({ dispatch, blogData, bid, navigate }) => {
  return (
    <div
      onClick={(e) =>
        navigate(`/blogs/${blogData?.category?.toLowerCase()}/${blogData?._id}`)
      }
    >
      <div className="flex flex-col w-[380px] border p-2 rounded-md">
        <img
          src={blogData.photo}
          alt=""
          className="w-[380px] h-full object-cover cursor-pointer"
        />
        <div className="flex flex-col px-4 pt-2">
          <span className="text-center cursor-pointer hover:text-main font-semibold text-lg">
            {blogData.caption}
          </span>

          {blogData?.description?.length === 1 && (
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blogData?.description[0])
              }}
              className="text-sm line-clamp text-gray-500 text-center mt-4"
            ></span>
          )}

          <div className="flex justify-between flex-nowrap items-center mt-6">
            <div className="flex items-center gap-x-2">
              <img
                src={blogData.user?.avatar}
                alt="avatar"
                className="w-16 h-16 object-cover rounded-l-full rounded-r-full"
              />
              <div className="flex flex-col">
                <h4 className="font-bold italic text-sm">{`${blogData.user?.firstname} ${blogData.user?.lastname}`}</h4>
                <div className="flex items-center gap-x-2">
                  <span className="bg-gray-500 w-fit bg-opacity-20 p-1.5 rounded-full">
                    <BsCheckLg className="text-[#36B37E]" />
                  </span>
                  <span className="italic text-gray-500 text-xs">
                    {+blogData.user?.role === 2005 && 'Admin'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-x-2">
              <span className="text-sm text-gray-500">
                {new Date(blogData.createdAt).getDate()}{' '}
                {new Date(blogData.createdAt).toLocaleString('default', {
                  month: 'long'
                })}
              </span>
              <span className="text-sm text-gray-500">{`${
                blogData?.comments?.length || 0
              } comment`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(ArticleCard))
