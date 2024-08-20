import { defineStore } from "pinia";

export const userInfoStore = defineStore("userInfo", {
  state() {
    return {
      token: uni.getStorageSync("token") || "",
      nmToken: uni.getStorageSync("nmToken") || "",
      userInfo: uni.getStorageSync("userInfo") || "",
      permissions: uni.getStorageSync("permissions") || "",
    };
  },

  actions: {
    setToken(data: string) {
      uni.setStorageSync("token", data);
      this.token = data;
    },
    setNmToken(data: string) {
      uni.setStorageSync("nmToken", data);
      this.nmToken = data;
    },
    setUserInfo(data: any) {
      uni.setStorageSync("userInfo", data);
      this.userInfo = data;
    },
    setPermissions(data: string) {
      if (data) {
        let list = data.split(",");
        uni.setStorageSync("permissions", list);
        this.permissions = list;
      } else {
        uni.setStorageSync("permissions", []);
        this.permissions = [];
      }
    },
  },
  // 小程序中不支持永久化存储
  persist: true,
});
