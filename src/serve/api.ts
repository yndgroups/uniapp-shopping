let BASE_URL = "";
let VITE_APP_IMG_VIEW_HOST = import.meta.env.VITE_APP_IMG_VIEW_HOST;
// #ifdef MP-WEIXIN
BASE_URL = import.meta.env.VITE_BASE_URL;

// #endif
export const api = {
  getAdList: `${BASE_URL}/m/sys/ad/findById/1`, //广告管理
  createAnonymityToken: `${BASE_URL}/m/sys/auth/createAnonymityToken/`, //创建匿名token
  refreshPermissions: `${BASE_URL}/m/sys/auth/refreshPermissions`,
  getFiles: `${BASE_URL}/m/sys/file/getFiles?fileId=`, //微信登录
  wechatLogin: `${BASE_URL}/m/sys/auth/weChatLogin`, //微信登录
  getProductList: `${BASE_URL}/m/store/product/findPageList`, //获取商品分页列表
  getProductDetails: `${BASE_URL}/m/store/product/findById/`, //获取商品详情
  // 地址管理
  getUserAddress: `${BASE_URL}/m/sys/userAddress/findPageList`, //收货地址列表查询
  getAeraList: `${BASE_URL}/m/sys/area/findTree`, //地区列表主要用于父级编码查询下级列表
  addUserAera: `${BASE_URL}/m/sys/userAddress`, //收货地址添加增删改
  // 购物车
  getCartCount: `${BASE_URL}/m/order/cart/findCount`, //查询用户的购物车数量
  addcart: `${BASE_URL}/m/order/cart`, //购车增删改查
  getCartfindPageList: `${BASE_URL}/m/order/cart/findPageList`,
  // 支付
  createOrder: `${BASE_URL}/m/order/wechat/createOrder`, //统一下单
  payOrder: `${BASE_URL}/m/order/wechat/paySign/`, //微信支付
  // 订单
  getOderList: `${BASE_URL}/m/order/order/findPageList`, //订单分页列表
  getOderDwtails: `${BASE_URL}/m/order/order/findById/`, //获取订单详情
  updateExpressInfo: `${BASE_URL}/m/order/order/updateExpressInfo`, //管理员手动发货
  receivingGoods: `${BASE_URL}/m/order/order/receivingGoods/`, //确认收货
  deleteOrder: `${BASE_URL}/m/order/order`, //删除订单记录
  findAdminPageList: `${BASE_URL}/m/order/order/findAdminPageList`, //管理员操作列表

  // 隐私协议
  getAgreement: `${BASE_URL}/m/sys/agreement/findById/202306180000001`,
  //w物流信息
  getkd100: `${BASE_URL}/m/express/kd100/findDetail`, //快递-快递100

  //退款
  refund: `${BASE_URL}/m/order/refund/apply`, //退款申请
  examine: `${BASE_URL}/m/order/refund/examine`, //退款审核

  // 图片地址
  imageViewHost: VITE_APP_IMG_VIEW_HOST,
};
export default api;
