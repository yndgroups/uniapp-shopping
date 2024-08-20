<template>
  <view class="cn-info-box">
    <view class="label-box">{{ label }}：</view>
    <view class="info" :style="{ color: infoColor }">{{ info }}</view>
  </view>
</template>
<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  info: {
    default: "",
  },
  infoColor: {
    type: String,
    default: "#727272",
  },
});
</script>
<style lang="scss" scoped>
.cn-info-box {
  width: calc(100% - 20rpx);
  padding-left: 20rpx;
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  letter-spacing: 2rpx;
  padding-bottom: 10rpx;
  .label-box {
    width: 200rpx;
    color: #a1a1a1;
  }
  .info {
    width: calc(100% - 200rpx);
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
