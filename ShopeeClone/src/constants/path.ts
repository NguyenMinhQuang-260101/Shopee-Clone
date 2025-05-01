const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/profile',
  productDetail: '/product/:id',
  cart: '/cart',
  orderHistory: '/order-history',
  orderDetail: '/order/:id',
  search: '/search',
  category: '/category/:id'
} as const

export default path
