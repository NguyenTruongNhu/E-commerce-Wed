import { createSlice } from '@reduxjs/toolkit'
import { getNewBlogs } from './asyncActions'

export const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    newBlogs: null
  },
  reducers: {},
  // Code logic xử lý async action
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(getNewBlogs.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true
    })

    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(getNewBlogs.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false
      state.newBlogs = action.payload
    })

    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(getNewBlogs.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false
      state.errorMessage = action.payload.message
    })
  }
})

// export const {  } = blogSlice.actions
export default blogSlice.reducer
