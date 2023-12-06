import axios from '../axios'

export const apiGetCategories = () =>
  axios({
    url: '/prodcategory/',
    method: 'get'
  })
export const apiGetCategoriesByAdmin = (params) =>
  axios({
    url: '/prodcategory/admin',
    method: 'get',
    params
  })
