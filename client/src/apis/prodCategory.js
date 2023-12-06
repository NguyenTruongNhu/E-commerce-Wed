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
