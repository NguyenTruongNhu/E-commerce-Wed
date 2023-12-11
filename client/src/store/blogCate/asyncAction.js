import { createAsyncThunk } from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const getCateBlog = createAsyncThunk(
  'blogCate/categorriesBlog',
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetBlogCategories()
    if (!response.success) return rejectWithValue(response)
    return response.blogCategories
  }
)
