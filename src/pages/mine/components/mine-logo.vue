<template>
  <view class="user-logo-box">
    <img
      class="bg-logo"
      :src="
        !store.userInfo.token
          ? '/static/images/user-bg.jpg'
          : store.userInfo.userInfo.gender === 0
          ? '/static/images/n.jpeg'
          : '/static/images/b.jpeg'
      "
    />
    <view class="user-box">
      <view v-if="store.userInfo.token" class="nameLog">
        <img
          class="img"
          :src="
            store.userInfo.userInfo.gender === 0
              ? '/static/images/n.jpeg'
              : '/static/images/b.jpeg'
          "
        />
        <text>{{ store.userInfo.userInfo.nickName }}</text>
      </view>
      <view class="button-box" v-else @click="business"> 登录 </view>
    </view>
    <Business v-model:show="show" @ok="handleOk" />
  </view>
</template>
<script setup lang="ts">
import { useStore } from "@/store";
import logins from "@/utils/logins";
import Business from "./Business.vue";
import http from "@/serve/http";
import api from "@/serve/api";
import { ref } from "vue";
const store = useStore();
const show = ref(false);
function handleOk() {
  uni.showLoading({
    title: "登录中...",
    mask: true,
  });
  show.value = false;
  login();
}
function login() {
  uni.showLoading({ title: "登录中..." });
  logins((result: any) => {
    console.log(result);
    http("POST", api.wechatLogin, result)
      .then((res: any) => {
        store.userInfo.setToken(res.token);
        store.userInfo.setUserInfo(result || {});
        store.userInfo.setPermissions(res.permissions || "");
      })
      .finally(() => {
        uni.hideLoading();
      });
  });
}

function business() {
  show.value = true;
}
</script>
<style lang="scss" scoped>
.user-logo-box {
  width: 100%;
  height: 450rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .bg-logo {
    width: 100%;
    height: 100%;
    filter: blur(20rpx);
  }

  .user-box {
    position: absolute;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 180rpx;

    .img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      border: 4rpx #fff solid;
    }

    text {
      margin-top: 20rpx;
    }

    .nameLog {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .u-button {
      margin-top: 20rpx;
    }
  }
}
</style>
