import React from 'react'
import avatar from 'assets/avatarDefault.jpg'
import { FiMessageSquare, FiEdit2, FiTrash } from 'react-icons/fi'
import CommentForm from './CommentForm'
const Comment = ({
  comment,
  logginedUserId,
  setAffectedComment,
  affectedComment,
  deleteComment,
  addComment,
  parentId = null,
  updateComment,
  replies
}) => {
  const islogginedUserId = Boolean(logginedUserId)
  const commentBelongsToUser = logginedUserId === comment.user._id
  const isReplying =
    affectedComment &&
    affectedComment.type === 'replying' &&
    affectedComment._id === comment._id
  const isEditing =
    affectedComment &&
    affectedComment.type === 'editing' &&
    affectedComment._id === comment._id
  const repliedCommentId = parentId ? parentId : comment._id
  const replyOnUserId = comment.user._id

  return (
    <div className="flex flex-nowrap items-start gap-x-3 bg-[#F2F4F5] p-3 rounded-lg">
      <img
        src={comment?.user?.avatar}
        alt="user profile"
        className="w-9 h-9 object-cover rounded-full"
      />
      <div className="flex-1 flex flex-col">
        <h5 className="font-bold text-dark-hard text-xs lg:text-sm">
          {`${comment.user.firstname} ${comment.user.lastname}`}
        </h5>
        <span className="text-xs text-dark-light">
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit'
          })}
        </span>
        {!isEditing && (
          <p className="font-opensans mt-[10px] text-gray-500">
            {comment.desc}
          </p>
        )}
        {isEditing && (
          <CommentForm
            btnLabel="Update"
            formSubmitHanlder={(value) => updateComment(value, comment._id)}
            formCancelHandler={() => setAffectedComment(null)}
            initialText={comment.desc}
          />
        )}
        <div className="flex items-center gap-x-3 text-gray-500 font-roboto text-sm mt-3 mb-3">
          {islogginedUserId && (
            <button
              onClick={() =>
                setAffectedComment({ type: 'replying', _id: comment._id })
              }
              className="flex items-center space-x-2"
            >
              <FiMessageSquare className="w-4 h-auto" />
              <span>Reply</span>
            </button>
          )}
          {commentBelongsToUser && (
            <>
              <button
                onClick={() =>
                  setAffectedComment({ type: 'editing', _id: comment._id })
                }
                className="flex items-center space-x-2"
              >
                <FiEdit2 className="w-4 h-auto" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteComment(comment._id)}
                className="flex items-center space-x-2"
              >
                <FiTrash className="w-4 h-auto" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
        {isReplying && (
          <CommentForm
            btnLabel="Reply"
            formSubmitHanlder={(value) =>
              addComment(value, repliedCommentId, replyOnUserId)
            }
            formCancelHandler={() => setAffectedComment(null)}
          />
        )}
        {replies.length > 0 && (
          <div>
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                addComment={addComment}
                affectedComment={affectedComment}
                setAffectedComment={setAffectedComment}
                comment={reply}
                deleteComment={deleteComment}
                logginedUserId={logginedUserId}
                replies={[]}
                updateComment={updateComment}
                parentId={comment._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment
