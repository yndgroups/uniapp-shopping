<template>
  <uni-card margin="20rpx" shadow="0">
    <view class="pay-box">
      <view class="title-box">
        <image src="@/static/icons/lq.png" class="image" mode="scaleToFill" />
        <text class="title">零钱余额：</text>
        <span>
          <text class="num-icon">¥</text>
          <text class="num">{{ money }}</text>
        </span>
      </view>
      <view class="pay-button-box">
        <button
          style="width: 40%"
          size="mini"
          type="primary"
          plain="true"
          @click="goRecharge"
        >
          充 值
        </button>
        <button
          style="width: 40%"
          size="mini"
          type="primary"
          plain="true"
          @click="goBill"
        >
          流水账单
        </button>
      </view>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { useStore } from "@/store";
import { onShow } from "@dcloudio/uni-app";
const store = useStore();
const money: number | any = ref(0);
const token = computed(() => {
  // return store.getters['getToken'] || null
});

function findBalance() {}
//
function goRecharge() {
  uni.navigateTo({ url: "/pages/recharge/index" });
}
function goBill() {
  uni.navigateTo({ url: "/pages/bill/index" });
}
</script>

<style lang="scss" scoped>
.pay-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 180rpx;
}

.title-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .image {
    width: 54rpx;
    height: 54rpx;
    margin-right: 16rpx;
  }

  .title {
    font-size: 34rpx;
    color: #00a14e;
    font-family: 楷体;
    font-weight: 600;
  }

  .num {
    font-size: 42rpx;
    color: #ffc506;
    font-weight: 650;
    letter-spacing: 2rpx;
    font-family: 楷体;
  }

  .num-icon {
    color: #ffc506;
    font-size: small;
    margin-top: 6rpx;
    margin-right: 10rpx;
    font-size: 30rpx;
  }
}

.pay-button-box {
  display: flex;
  justify-content: space-between;
}
</style>
