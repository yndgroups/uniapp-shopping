import { onReady } from "@dcloudio/uni-app";

<template>
  <cn-layout head="支付成功" full hBgColor="#fff" titleColor="#000">
    <view class="content-box">
      <view class="icon-box">
        <img class="img" src="@/static/icons/cg.png" alt="" />
        <text class="title">支付成功</text>
      </view>
    </view>
    <view class="button-item-box">
      <button
        class="button-item"
        plain
        type="primary"
        @click="back('/pages/index/index')"
      >
        返回首页
      </button>
      <button
        class="button-item"
        plain
        type="primary"
        @click="back('/pages/mine/index')"
      >
        个人中心
      </button>
    </view>
  </cn-layout>
</template>

<script setup lang="ts">
import { onReady } from "@dcloudio/uni-app";
function back(url: string): void {
  if (url === "/pages/index/index") {
    uni.switchTab({ url: url });
  } else {
    uni.reLaunch({ url: url });
  }
}
onReady(() => {
  uni.setNavigationBarColor({
    backgroundColor: "#ffffff",
    frontColor: "#000000",
  });
});
</script>

<style lang="scss" scoped>
.content-box {
  //   padding: 0rpx 0rpx calc(env(safe-area-inset-bottom) + 60rpx) 0rpx;
  height: 40%;
  border-radius: 0 0 300rpx 300rpx/0 0 40rpx 40rpx;
  background: #ffffff;
  //   border: 20rpx #4cd964 solid;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .icon-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: #4cd964;

    .img {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 8%;
    }

    .title {
      font-size: 44rpx;
      font-family: 仿宋;
      font-weight: bold;
      text-shadow: 10rpx 6rpx 6rpx rgb(218, 218, 218);
    }
  }
}

.button-item-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10%;
  .button-item {
    width: 46%;
  }
}
</style>
