import { createSlice } from '@reduxjs/toolkit'
import { getCateBlog } from './asyncAction'

export const blogCateSlice = createSlice({
  name: 'blogCate',
  initialState: {
    categorriesBlog: null
  },
  reducers: {},
  // Code logic xử lý async action
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(getCateBlog.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true
    })

    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(getCateBlog.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false
      state.categorriesBlog = action.payload
    })

    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(getCateBlog.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false
      state.errorMessage = action.payload.message
    })
  }
})

// export const {  } = blogCateSlice.actions
export default blogCateSlice.reducer
