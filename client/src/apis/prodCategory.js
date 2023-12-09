import axios from '../axios'

export const apiCreateCategory = (data) =>
  axios({
    url: '/prodcategory/',
    method: 'post',
    data
  })
export const apiUpdateCategory = (data, pcid) =>
  axios({
    url: '/prodcategory/' + pcid,
    method: 'put',
    data
  })
export const apiCreateBrand = (data) =>
  axios({
    url: '/prodcategory/brand',
    method: 'post',
    data
  })
export const apiUpdateBrand = (data, pcid) =>
  axios({
    url: '/prodcategory/updateBrand/' + pcid,
    method: 'put',
    data
  })

export const apiDeleteCategory = (pcid) =>
  axios({
    url: '/prodcategory/' + pcid,
    method: 'delete'
  })
export const apiDeleteAllBrand = (pcid) =>
  axios({
    url: '/prodcategory/deleteAllBrand/' + pcid,
    method: 'delete'
  })
export const apiDeleteOneBrand = (data, pcid) =>
  axios({
    url: '/prodcategory/deleteOneBrand/' + pcid,
    method: 'delete',
    data
  })
