//判断浏览器是否是微信浏览器
export function checkIsWechatBrowser(): boolean {
  // #ifdef H5
  let ua: any = navigator.userAgent.toLowerCase()
  return ua.match(/MicroMessenger/i) == 'micromessenger'
  // #endif
  // #ifdef !H5
  return false
  // #endif
}

export function isWeChat() {
  //#ifdef H5
  if (checkIsWechatBrowser()) {
    let pageNav: any = document.getElementsByTagName('uni-page-head')
    if (pageNav && pageNav[0]) {
      pageNav[0].style.display = 'none'
    }
  }
  //#endif
}
