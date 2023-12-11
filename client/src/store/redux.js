import { configureStore } from '@reduxjs/toolkit'
import appSlice from './app/appSlice'
import productSlice from './products/productSlice'
import storage from 'redux-persist/lib/storage'
import userSlice from './user/userSlice'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import blogSlice from './blogs/blogSlice'
import blogCateSlice from './blogCate/blogCateSlice'
const comomConfig = {
  storage
}
const userConfig = {
  ...comomConfig,
  whitelist: ['isLoggedIn', 'token', 'current', 'currentCart'],
  key: 'shop/user'
}
const productConfig = {
  ...comomConfig,
  whitelist: ['dealDaily'],
  key: 'shop/deal'
}

export const store = configureStore({
  reducer: {
    app: appSlice,
    blog: blogSlice,
    blogCate: blogCateSlice,

    products: persistReducer(productConfig, productSlice),
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
