<template>
  <cn-layout ref="layout" head="特产求购" full hBgColor="#fff" titleColor="#7A7E83">
    <cn-sticky :offsetTop="state.offsetTop" :scrollTop="state.scrollTop">
      <view class="tabs-box">
        <view class="tabs-item"></view>
        <view class="tabs-item"></view>
      </view>
    </cn-sticky>
  </cn-layout>
</template>

<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import { nextTick, reactive, ref } from "vue";
const layout = ref();
const state: any = reactive({
  offsetTop: 0,
  scrollTop: 0,
});

onShow(() => {
  nextTick(() => {
    state.offsetTop = layout.value.nabar.navHeight || 0;
  });
});
</script>

<style lang="scss" scoped>
.tabs-box {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 40rpx;
  .tabs-item {
    flex: 1;
    background-color: #ffffff;
    border-radius: 10rpx;
    height: 160rpx;
  }
}
</style>
