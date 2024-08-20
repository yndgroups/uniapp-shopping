<template>
  <uni-card margin="10rpx 20rpx">
    <view class="price">
      <text>
        <text class="fh">¥</text>
        <text>{{ detail.price || 0 }}</text>
        <text class="unitName">/{{ detail.unitName || "" }}</text>
      </text>
      <text class="methr-num"> 库存：{{ detail.stock }} </text>
      <text class="methr-num">{{ detail.sales || 0 }}人付款</text>
    </view>
    <view class="name">
      {{ detail.productName || "--" }}
    </view>
  </uni-card>
</template>
  <script setup lang="ts">
defineProps({
  detail: {
    type: Object,
    default: {},
  },
});
</script>
  <style lang="scss" scoped>
.price {
  color: red;
  font-size: 44rpx;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  // font-weight: 550;
  letter-spacing: 2rpx;
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  padding: 16rpx;
  .fh {
    font-size: 32rpx;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    margin-right: 6rpx;
  }
  .methr-num {
    color: #9c9c9c;
    font-family: serif;
    font-size: 28rpx;
  }
  .unitName {
    font-size: 24rpx;
    color: #9c9c9c;
    letter-spacing: 4rpx;
    margin-left: 4rpx;
  }
}
.name {
  font-size: 30rpx;
  color: #6e6e6e;
  font-family: 宋;
  font-weight: 500;
  display: flex;
  line-height: 40rpx;
  background: #ffffff;
  margin-bottom: 10rpx;
  padding: 16rpx;
}
</style>
  