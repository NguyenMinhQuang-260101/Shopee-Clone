const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
