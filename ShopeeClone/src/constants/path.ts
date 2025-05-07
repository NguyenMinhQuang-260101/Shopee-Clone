const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/profile',
  cart: '/cart',
  orderHistory: '/order-history',
  orderDetail: '/order/:id',
  search: '/search',
  category: '/category/:id',
  productDetail: ':nameId'
} as const

export default path
