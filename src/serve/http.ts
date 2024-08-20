// import { store } from "@/store";
import { createAnonymityToken } from "@/utils/createAnonymityToken";
import { stringify } from "encjs/core/urls";
import { onReady } from "@dcloudio/uni-app";
import apis from "./api";
import { useStore } from "@/store";

// 请求方式枚举
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  HEAD = "HEAD",
}

interface AnyObj {
  [key: string]: any;
}

// http请求体
interface HttpRequest {
  params?: any;
  data?: any;
  headers?: any;
}

// http 返回体
interface HttpResponse {
  code: number;
  data: AnyObj;
  msg: string;
}

/**
 * get请求
 *
 * @param url 请求地址
 * @param params 请求参数
 *
 * @returns Promise<HttpResponse>
 * author: yangdaqiong
 */
export const getJSON = async (url: string, params?: HttpRequest) => {
  return request(url, HttpMethod.GET, params);
};

/**
 * post请求
 *
 * @param url 请求地址
 * @param params 请求参数
 *
 * @returns Promise<HttpResponse>
 * @author: yangdaqiong
 */
export const postJSON = async (url: string, params?: HttpRequest) => {
  return request(url, HttpMethod.POST, params);
};

/**
 * put请求
 *
 * @param url 请求地址
 * @param params 请求参数
 *
 * @returns Promise<HttpResponse>
 * @author: yangdaqiong
 */
export const putJSON = async (url: string, params?: HttpRequest) => {
  return request(url, HttpMethod.PUT, params);
};

/**
 * delete 请求
 *
 * @param url 请求地址
 * @param params 请求参数
 *
 * @returns Promise<HttpResponse>
 * @author: yangdaqiong
 */
export const deleteJSON = async (url: string, params?: HttpRequest) => {
  return request(url, HttpMethod.DELETE, params);
};

/**
 * 请求方法统一封装
 *
 * @param url 请求地址
 * @param method 请求方法
 * @param params 请求参数
 *
 * @returns Promise<HttpResponse>
 * @author: yangdaqiong
 */
export async function request(
  url: string,
  method: HttpMethod,
  params?: HttpRequest
): Promise<HttpResponse> {
  const store = useStore();
  const token: string = store.userInfo.token;
  let nmToken: string = store.userInfo.nmToken;
  // const token: string = store.getters["getToken"] || "";
  // let nmToken: string = store.getters["getnmToken"] || "";
  let headers: AnyObj = {};
  if (token) {
    headers.accessToken = "Bearer " + token;
  } else if (nmToken) {
    headers.accessToken = "Bearer " + store.userInfo.nmToken || "";
  } else {
    await createAnonymityToken().then(({ data }: any) => {
      store.userInfo.setNmToken(data.data);
      headers.accessToken = "Bearer " + data.data;
    });
  }
  // 扩展自定义请求头
  if (params?.headers) {
    headers = { ...headers, ...params.headers };
  }
  if (params?.params) {
    url += stringify(params.params, url);
  }
  return await new Promise(function (resolve, reject) {
    const store = useStore();
    // const token: string = store.userInfo.token;
    // let nmToken: string = store.userInfo.nmToken;
    uni.request({
      url: url,
      method: method,
      data: params?.data,
      header: headers,
      timeout: 60000,
      success: (res: AnyObj) => {
        const { code, data, msg } = res.data;
        console.log(code, "xxxxx");
        switch (code) {
          case 0:
            uni.showToast({
              title: msg || "操作失败",
              icon: "none",
              duration: 1300,
            });
            reject(res);
            break;
          case 1:
            return resolve(data);
          case 401:
            uni.clearStorageSync();
            store.userInfo.token = "";
            reject();
            uni.showToast({
              title: msg || "登录过期",
              icon: "none",
              duration: 1300,
            });
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/mine/index",
              });
            }, 1300);
            break;
          case 40102:
            pageReload();
            break;
          default:
            uni.showToast({
              title: msg || "请求失败",
              icon: "none",
              duration: 1300,
            });
            reject(res.data);
            break;
        }
      },
      complete() {
        return reject();
      },
    });
  });
}

// 权限变更处理
const pageReload = () => {
  getJSON(apis.refreshPermissions + "?reload=1").then(({ code, data }) => {
    if (code === 1) {
      uni.setStorageSync("powerSign", data);
      onReady(() => {
        console.log("权限值刷新");
      });
    }
  });
};

/**
 * 请求方法统一封装
 *
 * @param method 请求方式
 * @param url 请求地址
 * @param params 请求参数
 * @param headers 请求头
 *
 * @returns Promise
 * @author: yangmengtao
 */
export async function http(
  method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE",
  url: string,
  params?: any,
  headers = <AnyObj>{}
) {
  const store = useStore();
  const token: string = store.userInfo.token;
  let nmToken: string = store.userInfo.nmToken;
  if (token) {
    headers.accessToken = "Bearer " + token;
  } else if (nmToken) {
    headers.accessToken = "Bearer " + store.userInfo.nmToken || "";
  } else {
    await createAnonymityToken().then(({ data }: any) => {
      store.userInfo.setNmToken(data.data);
      headers.accessToken = "Bearer " + data.data;
    });
  }
  return await new Promise(function (resolve, reject) {
    uni.request({
      url: url,
      method: method,
      data: params,
      header: headers,
      timeout: 10000,
      success: (res: any) => {
        const { code, data, message } = res.data;

        switch (code) {
          case 1:
            return resolve(data);
          case 401:
            uni.clearStorageSync();
            store.userInfo.setToken("");
            store.userInfo.setPermissions("");
            reject();
            uni.showToast({
              title: message || "登录过期",
              icon: "none",
              duration: 1300,
            });
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/mine/index",
              });
            }, 1300);
            break;
          case 403:
            uni.showModal({
              title: "温馨提示",
              content: "您还没有登录呢，完成登录后可使用全部功能！是否去登录？",
              success: function (res) {
                if (res.confirm) {
                  uni.clearStorageSync();
                  store.userInfo.setToken("");
                  store.userInfo.setPermissions("");
                  reject();
                  setTimeout(() => {
                    uni.reLaunch({
                      url: "/pages/mine/index",
                    });
                  });
                } else if (res.cancel) {
                  reject();
                }
              },
            });
            break;
          default:
            uni.showToast({
              title: message || "请求失败",
              icon: "none",
              duration: 1300,
            });
            reject(res.data);
            break;
        }
      },
      complete() {
        return reject();
      },
    });
  });
}

export default http;
