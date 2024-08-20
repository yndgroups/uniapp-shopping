/**
 *用户信息类型
 * @param {string} token 用户权限令牌
 * @param {string} nickName 用户名称
 */
interface UserInfo {
  token: string;
  nmToken: string;
  avatarUrl: string;
  nickName: string;
  gender: number;
  is_demote: boolean;
  sex: number;
  like: string[];
  loginType: number;
}

/**
 * 地区类型
 * @param {string} areaName 地区名称
 * @param {string} areaCode 地区编码
 * @param {number} areaType 地区类型
 * @param {Array<AreaInfo>} children 下级地区
 */
interface AreaInfo {
  areaName: string;
  areaCode: string;
  areaType: number;
  children?: Array<AreaInfo>;
}

/**
 *请求头
 */
interface HttpHeaders {
  [key: string]: any;
}
