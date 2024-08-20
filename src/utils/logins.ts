async function logins(then?: any) {
  let myUrl = import.meta.env.VITE_WECHAT;
  let appid = import.meta.env.VITE_APPID;
  // 获取用户信息
  // #ifdef MP-WEIXIN
  uni.getUserProfile({
    desc: "获取您的用户信息",
    lang: "zh_CN",
    success: function (data: any) {
      uni.login({
        provider: "weixin",
        success: function ({ code }) {
          data.userInfo.wxCode = code;
          // 微信登录方式（1:小程序登录 2：公众号登录）
          data.userInfo.loginType = 1;
          then(data.userInfo);
        },
      });
    },
  });
  // #endif
  // #ifdef H5
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${myUrl}&response_type=code&scope=snsapi_userinfo&state=123&forcePopup=true&forceSnapShot=true&connect_redirect=1#wechat_redirect`;
  location.replace(url);
  // #endif
}

export default logins;
