<template>
  <!-- <cn-layout :backs="false" hBgColor="linear-gradient(90deg, #FFCD1E, #FF8A18)"> -->
  <view class="scroll-box">
    <view class="scroll-item">
      <view
        v-for="item in list"
        :key="item.id"
        class="left-item-box"
        @click="handleLeft(item)"
        :class="item.id === activeId ? 'left-active' : ''"
      >
        {{ item.productName }}
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll-item1">
      <cn-goods-list :list="chidList" class="classify-goods-box" />
    </scroll-view>
  </view>
  <!-- </cn-layout> -->
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { list } from "./data";
import { onShow } from "@dcloudio/uni-app";
const activeId = ref("");
const chidList = ref<any[]>([]);
function handleLeft(item: any) {
  activeId.value = item.id;
}
watch(
  () => activeId.value,
  (val) => {
    chidList.value =
      list.filter((i: any) => {
        return i.id === val;
      })[0].chid || [];
  }
);

onShow(() => {
  activeId.value = "id1";
});
</script>
<style lang="scss" scoped>
.scroll-box {
  height: 100vh;
  width: 100%;
  display: flex;
  .scroll-item {
    flex: 30%;
    background-color: #ffffff;
    color: #9ba0a9;
    overflow-y: auto;
    scrollbar-width: none !important;
    .left-item-box {
      font-size: 32rpx;
      line-height: 50rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      padding: 20rpx 0rpx 20rpx 10rpx;
      font-weight: 400;
      white-space: nowrap; /* 禁止文本换行 */
      overflow: hidden; /* 隐藏超出部分的内容 */
      text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
    }
  }
  .scroll-item1 {
    flex: 70%;
    background-color: #f8f8f9;
    padding: 10rpx;
  }
}

.left-active {
  background-color: #ffffff;
  color: #007aff;
  border-bottom: 2rpx #007aff solid !important;
}
::v-deep .classify-goods-box {
  .boutique-box {
    height: 100%;
    .item {
      border: 2rpx #d8e1e7 solid;
      margin-bottom: 10rpx;
    }
  }
}

.scroll-item::-webkit-scrollbar {
  width: 0 !important;
}
</style>
