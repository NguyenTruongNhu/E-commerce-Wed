import axios from '../axios'

export const apiCreateCateBlog = (data) =>
  axios({
    url: '/blogcategory/',
    method: 'post',
    data
  })
export const apiGetCateBlog = (params) =>
  axios({
    url: '/blogcategory/admin',
    method: 'get',
    params
  })
export const apiGetBlogCategories = () =>
  axios({
    url: '/blogcategory/',
    method: 'get'
  })
export const apiUpdateCateBlog = (data, bcid) =>
  axios({
    url: '/blogcategory/' + bcid,
    method: 'put',
    data
  })
export const apiDeleteCateBlog = (bcid) =>
  axios({
    url: '/blogcategory/' + bcid,
    method: 'delete'
  })
