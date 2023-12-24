import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  Login,
  Home,
  Public,
  FAQ,
  Services,
  DetailProduct,
  Blog,
  Products,
  FinalRegister,
  ResetPassword,
  DetailCart
} from 'pages/public'
import {
  AdminLayout,
  ManageOrder,
  ManageProduct,
  ManageUser,
  CreateProduct,
  Dashboard,
  CreateBlog,
  ManageBlog,
  ManageCustomProduct,
  ManageVariant,
  ManageCategories,
  ManageBrand,
  CreateBrand,
  CreateCategory,
  ManageCateBlog,
  CreateCateBlog,
  ManageInventory,
  ManageInventoryVariant
} from 'pages/admin'
import {
  MemberLayout,
  Personal,
  History,
  MyCart,
  Wishlist,
  Checkout
} from 'pages/member'
import path from 'ultils/path'
import { getCategories } from 'store/app/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Cart, DetailBlog, Modal } from 'components'
import { showCart } from 'store/app/appSlice'
import { getNewBlogs } from 'store/blogs/asyncActions'
import { getCateBlog } from 'store/blogCate/asyncAction'

function App() {
  const dispatch = useDispatch()
  const { isShowModal, modalChildren, isShowCart } = useSelector(
    (state) => state.app
  )
  useEffect(() => {
    dispatch(getCategories())
    dispatch(getCateBlog())
    dispatch(getNewBlogs())
  }, [])

  return (
    <>
      <div className="font-main h-screen relative">
        {isShowCart && (
          <div
            onClick={() => dispatch(showCart())}
            className="absolute inset-0 bg-overlay z-50 flex justify-end "
          >
            <Cart />
          </div>
        )}
        {isShowModal && <Modal>{modalChildren}</Modal>}
        <Routes>
          <Route path={path.CHECKOUT} element={<Checkout />} />
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />} />
            <Route path={path.BLOGS} element={<Blog />} />
            <Route path={path.BLOGS__CATEGORY__BID} element={<DetailBlog />} />
            <Route
              path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE}
              element={<DetailProduct />}
            />
            <Route path={path.FAQ} element={<FAQ />} />
            <Route path={path.OUR_SERVICES} element={<Services />} />
            <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
            <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={path.ALL} element={<Home />} />
          </Route>
          <Route path={path.ADMIN} element={<AdminLayout />}>
            <Route path={path.DASHBOARD} element={<Dashboard />} />
            <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
            <Route path={path.MANAGE_PRODUCTS} element={<ManageProduct />} />
            <Route path={path.MANAGE_USER} element={<ManageUser />} />
            <Route path={path.MANAGE_CATEGORY} element={<ManageCategories />} />
            <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
            <Route path={path.MANAGE_BLOGS} element={<ManageBlog />} />
            <Route path={path.MANAGE_CATE_BLOG} element={<ManageCateBlog />} />
            <Route path={path.MANAGE_VARIANT} element={<ManageVariant />} />
            <Route path={path.MANAGE_INVENTORY} element={<ManageInventory />} />
            <Route
              path={path.MANAGE_INVENTORY_VARIANT}
              element={<ManageInventoryVariant />}
            />
            <Route path={path.CREATE_CATE_BLOG} element={<CreateCateBlog />} />
            <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
            <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
            <Route path={path.CREATE_BRAND} element={<CreateBrand />} />
            <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
            <Route
              path={path.MANAGE_CUSTOM_PRODUCT}
              element={<ManageCustomProduct />}
            />
          </Route>
          <Route path={path.MEMBER} element={<MemberLayout />}>
            <Route path={path.PERSONAL} element={<Personal />} />
            <Route path={path.MY_CART} element={<DetailCart />} />
            <Route path={path.WISHLIST} element={<Wishlist />} />
            <Route path={path.HISTORY} element={<History />} />
          </Route>
          <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
          <Route path={path.LOGIN} element={<Login />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
