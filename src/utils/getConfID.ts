export function getConfId(): string {
  // #ifdef H5
  return import.meta.env.VITE_H5_CONFID
  // #endif

  // #ifdef MP-WEIXIN
  return import.meta.env.VITE_WX_CONFID
  // #endif
}

export default getConfId
