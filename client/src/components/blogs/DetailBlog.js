import React, { useCallback, useEffect, useRef, useState } from 'react'
import CommentBlog from './CommentBlog'
import SocialShareButtons from './SocialShareButtons'
import { apiDislikeBlog, apiGetBlog, apiLikeBlog } from 'apis'
import { createSearchParams, useParams } from 'react-router-dom'
import Breadcrumb from 'components/common/Breadcrumb'
import moment from 'moment'
import { useSelector } from 'react-redux'
import CustomSlider from 'components/common/CustomSlider'
import { SlLike, SlDislike } from 'react-icons/sl'
import { GoComment } from 'react-icons/go'
import { toast } from 'react-toastify'
import withBaseComponent from 'hocs/withBaseComponent'
import Swal from 'sweetalert2'
import path from 'ultils/path'
import DOMPurify from 'dompurify'

const DetailBlog = ({ dispatch, navigate, location }) => {
  const { category, bid } = useParams()
  const { current } = useSelector((state) => state.user)
  const titleRef = useRef()
  const [blogData, setBlogData] = useState(null)
  const [userData, setUserData] = useState(null)
  const { newBlogs } = useSelector((state) => state.blog)
  const fetchBlogData = async () => {
    const response = await apiGetBlog(bid)
    if (response.success) {
      setBlogData(response.mes)
      setUserData(response.mes.user)
    }
  }
  const rerender = useCallback(() => {
    fetchBlogData()
  }, [blogData?.comments])

  useEffect(() => {
    fetchBlogData()
    titleRef.current?.scrollIntoView({ block: 'start' })
    window.scrollTo(0, 0)
  }, [bid])
  const handleClickOptions = async (e, flag) => {
    if (!current)
      return Swal.fire({
        title: 'Almost...',
        text: 'Please login first!',
        icon: 'info',
        cancelButtonText: 'Not now!',
        showCancelButton: true,
        confirmButtonText: 'Go login page'
      }).then((rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname
            }).toString()
          })
      })
    if (flag === 'LIKE') {
      const response = await apiLikeBlog(bid)
      if (response.success) {
        toast.success(response.mes)
        rerender()
      } else toast.error(response.mes)
    }
    if (flag === 'DISLIKE') {
      const response = await apiDislikeBlog(bid)
      if (response.success) {
        toast.success(response.mes)
        rerender()
      } else toast.error(response.mes)
    }
  }
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 ref={titleRef} className="font-semibold">
            {blogData?.title}
          </h3>
          <Breadcrumb title={blogData?.title} category={category} />
        </div>
      </div>
      <div className="w-main mx-auto ">
        <div className="flex gap-2 my-2">
          <span>{`BY ${userData?.firstname} ${userData?.lastname}`}</span>
          <span>•</span>
          <span>{moment(blogData?.createdAt).format('DD/MM/YYYY')}</span>
          <span>•</span>
          <span>{`${blogData?.comments?.length || 0} COMMENTS`}</span>
          <span>•</span>
          <span>{`${blogData?.numberViews} Views`}</span>
        </div>

        <img src={blogData?.photo} alt="" className="w-full object-contain" />
        <div className="flex gap-5 mt-2 ">
          <span
            onClick={(e) => handleClickOptions(e, 'LIKE')}
            className="hover:text-main cursor-pointer"
          >
            <SlLike
              color={
                blogData?.likes?.some((i) => i._id === current?._id)
                  ? 'red'
                  : 'black'
              }
              size={20}
            />
          </span>
          <span
            onClick={(e) => handleClickOptions(e, 'DISLIKE')}
            className="hover:text-main cursor-pointer"
          >
            <SlDislike
              color={
                blogData?.dislikes?.some((i) => i._id === current?._id)
                  ? 'red'
                  : 'black'
              }
              size={20}
            />
          </span>
          <span className="hover:text-main cursor-pointer">
            <GoComment size={20} />
          </span>
        </div>
        <div className="flex flex-col gap-2 my-2">
          <span className="text-3xl font-semibold  text-center my-8">
            {blogData?.caption}
          </span>
          {blogData?.description?.length === 1 && (
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blogData?.description[0])
              }}
              className="text-base text-gray-500"
            ></span>
          )}
        </div>
        <div className="mt-7 flex items-center justify-center gap-10">
          <h2 className="font-medium w-[110px]  text-gray-500 mb-4 text-xl">
            Share on:
          </h2>
          <SocialShareButtons
            url={encodeURI(
              'https://digital-world-2.myshopify.com/blogs/news-1/these-are-the-5-best-phones-you-can-buy-right-now'
            )}
            title={encodeURIComponent(
              'THESE ARE THE 5 BEST PHONES YOU CAN BUY RIGHT NOW'
            )}
          />
        </div>
        <CommentBlog
          comments={blogData?.comments}
          className="mt-10"
          logginedUserId={current?._id}
          slug={blogData?.slug}
          rerender={rerender}
        />
      </div>

      <div className="w-main m-auto my-8">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main mb-8">
          LASTEST ARTICLE:
        </h3>

        <div className="w-full">
          <CustomSlider blogs={newBlogs} />
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(DetailBlog)
