import axios from '../axios'

export const apiGetBlogs = (params) =>
  axios({
    url: '/blog/',
    method: 'get',
    params
  })
export const apiGetBlog = (bid) =>
  axios({
    url: '/blog/' + bid,
    method: 'get'
  })
export const apiLikeBlog = (bid) =>
  axios({
    url: '/blog/likes/' + bid,
    method: 'put'
  })
export const apiDislikeBlog = (bid) =>
  axios({
    url: '/blog/dislike/' + bid,
    method: 'put'
  })
export const apiUpdateBlog = (data, bid) =>
  axios({
    url: '/blog/' + bid,
    method: 'put',
    data
  })
export const apiCreateBlog = (data) =>
  axios({
    url: '/blog/',
    method: 'post',
    data
  })
export const apiDeleteBlog = (bid) =>
  axios({
    url: '/blog/' + bid,
    method: 'delete'
  })
