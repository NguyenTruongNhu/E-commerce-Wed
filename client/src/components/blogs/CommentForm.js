import withBaseComponent from 'hocs/withBaseComponent'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import path from 'ultils/path'

const CommentForm = ({
  btnLabel,
  formSubmitHanlder,
  formCancelHandler = null,
  initialText = '',
  loading = false,
  navigate,
  location
}) => {
  const [value, setValue] = useState(initialText)

  const submitHandler = (e) => {
    e.preventDefault()
    formSubmitHanlder(value)
    setValue('')
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col items-end border border-primary rounded-lg p-4">
        <textarea
          className="w-full focus:outline-none bg-transparent"
          rows="5"
          placeholder="Leave your comment here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex flex-col-reverse gap-y-2 items-center gap-x-2 pt-2 min-[420px]:flex-row">
          {formCancelHandler && (
            <button
              onClick={formCancelHandler}
              className="px-6 py-2.5 rounded-lg border border-red-500 text-red-500"
            >
              Cancel
            </button>
          )}
          {value && (
            <button
              disabled={loading}
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-500
         text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {btnLabel}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default withBaseComponent(CommentForm)
