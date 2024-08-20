<template>
  <cn-layout head="个人中心" :backs="false">
    <mine-logo />
    <mine-grid />
    <view class="cell-item-box">
      <cn-cell
        v-if="btnIsShow('app:order:admin')"
        title="订单管理"
        @click="goaAminOrder"
      ></cn-cell>
      <cn-cell title="地址管理" @click="goArea"></cn-cell>
      <cn-cell title="退出登录" @click="outLogin"></cn-cell>
    </view>
  </cn-layout>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import MineLogo from "./components/mine-logo.vue";
import MineGrid from "./components/mine-grid.vue";
const store = useStore();

/* 退出用户登陆 */
function outLogin() {
  uni.showModal({
    title: "提示",
    content: "您确定要退出登录吗?",
    success: function (res: any) {
      if (res.confirm) {
        store.userInfo.setToken("");
        store.userInfo.setPermissions("");
        store.userInfo.setUserInfo({});
        store.userInfo.setNmToken("");
      }
    },
  });
}

function goaAminOrder() {
  uni.navigateTo({
    url: "/pages/admin-order/index",
  });
}
function goArea() {
  uni.navigateTo({
    url: "/pages/aera/index",
  });
}
function btnIsShow(authKey: string): boolean {
  return store.userInfo.permissions.includes(authKey);
}
</script>

<style lang="scss" scoped>
.cell-item-box {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
