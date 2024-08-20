<template>
  <view style="padding: 0 10px" class="grid-box">
    <uni-grid :column="3" :show-border="false" :square="false" @change="change">
      <uni-grid-item
        v-for="(item, index) in state.list"
        :index="index"
        :key="index"
        style="border-radius: 10px"
      >
        <view class="grid-item-box" :class="'grid-item-box' + index">
          <image class="image" :src="item.url" mode="aspectFill" />
          <text class="text">{{ item.text }}</text>
          <view v-if="item.badge" class="grid-dot">
            <uni-badge
              v-if="Number(item.badge) >= 1"
              :text="item.badge"
              type="error"
            />
          </view>
        </view>
      </uni-grid-item>
    </uni-grid>
  </view>
</template>

<script setup lang="ts">
import http from "@/serve/http";
import { reactive, computed, watch } from "vue";
import { useStore } from "@/store";
import { onShow } from "@dcloudio/uni-app";
import api from "@/serve/api";
const store = useStore();

type Data = {
  list: any[];
};
const token = computed(() => {
  return store.userInfo.token || null;
});
const state = reactive<Data>({
  list: [
    {
      url: "/static/icons/gwc.png",
      text: "购物车",
      badge: 0,
    },
    {
      url: "/static/icons/dfh.png",
      text: "待发货",
      badge: 0,
    },
    {
      url: "/static/icons/dsh.png",
      text: "待收货",
      badge: 0,
    },
  ],
});
function getCartCount() {
  http("GET", api.getCartCount).then((res: any) => {
    state.list[0].badge = res || 0;
  });
}

watch(
  () => token.value,
  (val) => {
    if (val) {
      getCartCount();
    } else {
      state.list[0].badge = 0;
    }
  }
);
function change({ detail }: any): void {
  if (detail.index === 0) {
    uni.switchTab({ url: "/pages/cart/index" });
  } else {
    uni.navigateTo({ url: `/pages/order/index?index=${detail.index}` });
  }
}
onShow(() => {
  if (token.value) {
    getCartCount();
  }
});
</script>

<style lang="scss" scoped>
.grid-item-box {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  background: #fff;

  .grid-dot {
    position: absolute;
    top: 10rpx;
    right: 40rpx;
  }

  .text {
    font-size: 28rpx;
    margin-top: 10rpx;
  }

  .image {
    width: 60rpx;
    height: 60rpx;
  }
}

.grid-item-box0 {
  border-top-left-radius: 20rpx !important;
}

.grid-item-box2 {
  border-top-right-radius: 20rpx !important;
}

.grid-box {
  margin-top: -60rpx;
}

.grid-item-box:active {
  background: #f1f1f1;
}
</style>
