<template>
  <view class="head-card-box">
    <view v-if="userInfo.token" class="user-info-box">
      <cn-img
        src="/static/logo.png"
        radius="50%"
        width="100rpx"
        height="100rpx"
      />
      <text>微信用户</text>
      <uni-icons type="compose" size="36rpx"></uni-icons>
    </view>
    <view v-else class="button-box" @click="login">登录</view>
  </view>
</template>
<script lang="ts" setup>
import { useStore } from "@/store";
import { computed } from "vue";
const store = useStore() as any;
const userInfo = computed((): UserInfo => store.userInfo);
function login() {
  uni.login({
    provider: "weixin",
    desc: "微信登录",
    success(result: UniApp.LoginRes) {
      store.userInfo.setToken(result.code);
      subscribe()
    },
  });
}

function subscribe() {
  uni.getSetting({
    withSubscriptions: true,
    success(res) {
      console.log(res, 'getSetting - success')
      uni.requestSubscribeMessage({
        tmplIds: [
          "rc-r-FZ6gwiq2tvkWwJeFckWRkU-RmReKyeFfkfFQLs",
          "aZHCMNQEVOQjF5SSYuPI_eV0tuBj7R7-UQYuQ9FQWx4",
        ],
        success(res) {
          console.log(res, "订阅成功");
        },
        fail(err) {
          console.log(err, "订阅失败");
        },
      });
    },
    fail(res) {
      console.log(res, "设置授权失败");
    },
  });
}
</script>
<style lang="scss" scoped>
.head-card-box {
  padding: 20rpx 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .user-info-box {
    display: flex;
    align-items: center;
    font-size: 32rpx;
    gap: 20rpx;
    font-weight: bold;
    color: #707070;
    width: 100%;
    border-bottom: 2rpx #099999 solid;
    margin-bottom: 20rpx;
  }
}
</style>
