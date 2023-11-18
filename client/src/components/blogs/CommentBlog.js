import React, { memo, useState } from 'react'
import CommentForm from './CommentForm'
import Comment from './Comment'
import { useMutation } from 'react-query'
import { apiCreateComment, deleteComment, updateComment } from 'apis/comment'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'ultils/path'
import { createSearchParams } from 'react-router-dom'
import withBaseComponent from 'hocs/withBaseComponent'
const CommentBlog = ({
  className,
  logginedUserId,
  comments,
  slug,
  rerender,
  navigate,
  location
}) => {
  const { token } = useSelector((state) => state.user)
  const [affectedComment, setAffectedComment] = useState(null)
  const { current } = useSelector((state) => state.user)

  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
    useMutation({
      mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
        return apiCreateComment({ token, desc, slug, parent, replyOnUser })
      },
      onSuccess: () => {
        toast.success('Your comment is created successfully')
        rerender()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ token, desc, commentId }) => {
      return updateComment({ token, desc, commentId })
    },
    onSuccess: () => {
      toast.success('Your comment is updated successfully')
      rerender()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: ({ token, desc, commentId }) => {
      return deleteComment({ token, commentId })
    },
    onSuccess: () => {
      toast.success('Your comment is deleted successfully')
      rerender()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
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

    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: token,
      slug: slug
    })
    setAffectedComment(null)
  }
  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({
      token: token,
      desc: value,
      commentId
    })
    setAffectedComment(null)
  }
  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({ token: token, commentId })
  }

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        formSubmitHanlder={(value) => addCommentHandler(value)}
        loading={isLoadingNewComment}
      />
      <div className="space-y-4 mt-8">
        {comments?.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  )
}

export default withBaseComponent(memo(CommentBlog))
