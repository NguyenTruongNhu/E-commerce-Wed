import React, { memo, useState } from 'react'
import { Button, Loading } from '../../components'
import { useNavigate, useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { showModal } from 'store/app/appSlice'
import path from 'ultils/path'
const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const { token } = useParams()
  const handleResetPassword = async () => {
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
    const response = await apiResetPassword({ password, token })
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' })
      navigate(`/${path.LOGIN}`)
    } else {
      toast.info(response.mes, { theme: 'colored' })
    }
  }
  return (
    <div className="absolute animate-slice-right top-0 left-0 bottom-0 right-0 bg-white flex items-center  flex-col py-8 z-10">
      <div className="flex flex-col gap-4">
        <label htmlFor="email">Enter your new password:</label>
        <input
          type="text"
          id="email"
          className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
          placeholder="Type here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center justify-end w-full gap-4">
          <Button handleOnclick={handleResetPassword}>Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default memo(ResetPassword)
