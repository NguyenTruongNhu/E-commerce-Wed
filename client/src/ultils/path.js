const path = {
  PUBLIC: '/',
  HOME: '',
  ALL: '*',
  LOGIN: 'login',
  PRODUCTS__CATEGORY: ':category',
  BLOGS: 'blogs',
  BLOGS__CATEGORY__BID: 'blogs/:category/:bid',
  OUR_SERVICES: 'services',
  FAQ: 'faqs',
  DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
  FINAL_REGISTER: 'finalregister/:status',
  RESET_PASSWORD: 'reset-password/:token',
  DETAIL_CART: 'my-cart',
  CHECKOUT: 'checkout',
  PRODUCTS: 'products',

  //Admin
  ADMIN: 'admin',
  DASHBOARD: 'dashboard',
  MANAGE_USER: 'manage-user',
  MANAGE_PRODUCTS: 'manage-products',
  MANAGE_CATEGORY: 'manage-category',
  MANAGE_BRAND: 'manage-brand',
  MANAGE_BLOGS: 'manage-blogs',
  MANAGE_ORDER: 'manage-order',
  MANAGE_VARIANT: 'manage-variant',
  MANAGE_CUSTOM_PRODUCT: 'manage-custom-product',
  MANAGE_INVENTORY: 'manage-inventory',
  MANAGE_CATE_BLOG: 'manage-cate-blog',
  MANAGE_INVENTORY_VARIANT: 'manage-inventory-variant',
  CREATE_CATE_BLOG: 'create-cate-blog',
  CREATE_PRODUCT: 'create-product',
  CREATE_BLOG: 'create-blog',
  CREATE_CATEGORY: 'create-category',
  CREATE_BRAND: 'create-brand',

  //Member
  MEMBER: 'member',
  PERSONAL: 'personal',
  MY_CART: 'my-cart',
  HISTORY: 'buy-history',
  WISHLIST: 'wishlist'
}

export default path
