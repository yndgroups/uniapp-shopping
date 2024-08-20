<template>
  <view class="home-gard-box">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="item-box"
      :class="item.bounce ? 'animationItemClass' : ''"
      @click="handelItem(item)"
      :style="{ filter: item.disabled ? 'grayscale(100%)' : '' }"
    >
      <img :src="item.icon" alt="" style="width: 60rpx; height: 60rpx" />
      <text>{{ item.lable }}</text>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
const list = reactive([
  {
    icon: "/static/icons/jrsx.png",
    lable: "个人中心",
    value: 0,
    bounce: false,
  },
  {
    icon: "/static/icons/qg.png",
    lable: "特产求购",
    value: 1,
    bounce: true,
    disabled: true,
  },
  {
    icon: "/static/icons/gdfl.png",
    lable: "更 多",
    value: 2,
    bounce: false,
  },
]);
function handelItem(item: any) {
  // activity
  switch (item.value) {
    case 0:
      uni.switchTab({
        url: "/pages/mine/index",
      });
      break;
    case 1:
      uni.showToast({
        title: "暂未开放",
        icon: "error",
      });
      // uni.navigateTo({
      //   url: "/pages/want-to-buy/index",
      // });
      break;
    default:
      // uni.switchTab({ url: "/pages/classify/index" });
      uni.navigateTo({
        url: "/pages/search/index",
      });
      break;
  }
}
</script>
<style lang="scss" scoped>
.home-gard-box {
  width: calc(100% - 68rpx);
  height: 120rpx;
  margin: auto;
  border-radius: 10rpx;
  background-color: #ffffff;
  position: relative;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10rpx;
  margin-top: -75rpx;

  .item-box {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 24rpx;
    color: #525252d2;
  }
}

.animationItemClass {
  animation: move 1.5s infinite;
  animation-timing-function: ease-in;
}

@keyframes move {
  0% {
    transform: translateY(0);
  }

  /* 初始状态，y轴位移为0 */
  50% {
    transform: translateY(-5px);
  }

  /* y轴向上平移20像素 */
  100% {
    transform: translateY(0);
  }

  /* 结束状态，返回原始位置 */
}
</style>
