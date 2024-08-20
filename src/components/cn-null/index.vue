<template>
  <view class="null-box">
    <img class="img" src="@/static/images/null.png" alt="" />
    <text class="text">{{ text || "" }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: "外星人偷走了所有的数据！",
  },
});
</script>
<style lang="scss" scoped>
.null-box {
  height: 60%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    height: 100%;
    width: 100%;
  }

  .text {
    color: #cacaca;
    font-size: 36rpx;
    letter-spacing: 6rpx;
    font-family: 仿宋;
  }
}
</style>
