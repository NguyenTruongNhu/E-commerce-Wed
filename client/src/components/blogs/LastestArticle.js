import React from 'react'
import { Link } from 'react-router-dom'

const LastestArticle = ({ blogs }) => {
  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap gap-3 justify-between cursor-pointer">
        {blogs?.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-5 w-[388px] shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg p-4   items-center"
          >
            <img
              className=" w-full object-cover rounded-lg"
              src={item.photo}
              alt={item.title}
            />
            <div className="text-sm font-roboto text-center  text-dark-hard font-medium">
              <h3 className="text-sm font-roboto text-dark-hard font-medium md:text-base lg:text-lg">
                <Link to={`/blog/${item.slug}`}>{item.title}</Link>
              </h3>
              <span className="text-xs opacity-60">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LastestArticle
