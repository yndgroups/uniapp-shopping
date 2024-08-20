<template>
  <cn-layout
    ref="layout"
    head="搜索"
    full
    hBgColor="#fff"
    titleColor="#000"
    more
    :status="state.status"
    layoutClass="layout-box"
    :style="{ '--nav-height': state.offsetTop * 2 + 'rpx' }"
    @scrolltolower="scrolltolower"
  >
    <cn-sticky
      :offsetTop="state.offsetTop"
      :scrollTop="state.scrollTop"
      style="background: #fff"
    >
      <uni-search-bar
        placeholder="请输入商品名称"
        clearButton="auto"
        bgColor="#FFFFFF"
        radius="20"
        v-model="state.pageInfo.params.productName"
      />
    </cn-sticky>
    <cn-goods-list :list="state.goodsList"></cn-goods-list>
  </cn-layout>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch } from "vue";
import { onLoad, onReady } from "@dcloudio/uni-app";
import http from "@/serve/http";
import api from "@/serve/api";

const layout: any = ref(null);
const state: any = reactive({
  scrollTop: 0,
  offsetTop: 0,
  search: "",
  status: "more",
  goodsList: [],
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    params: {
      productName: "",
    },
  },
  times: null,
});
watch(
  () => state.pageInfo.params.productName,
  () => {
    if (state.times) {
      clearTimeout(state.times);
    }
    state.times = setTimeout(() => {
      state.pageInfo.pageIndex = 1;
      state.pageInfo.pageSize = 10;
      state.pageInfo.totalCount = 0;
      getGoodsList();
      //调用接口
    }, 600);
  }
);

function scrolltolower(): void {
  if (
    state.pageInfo.pageIndex * state.pageInfo.pageSize <
    state.pageInfo.totalCount
  ) {
    state.pageInfo.pageIndex += 1;
    getGoodsList(1);
  } else {
    state.status = "no-more";
  }
}

function getGoodsList(type?: number) {
  state.status = "loading";
  http("POST", api.getProductList, state.pageInfo)
    .then((res: any) => {
      state.pageInfo.pageIndex = res.pageIndex;
      state.pageInfo.totalCount = res.totalCount;
      if (type === 1) {
        let list = state.goodsList;
        list.push(...res.list);
        state.goodsList = list;
      } else {
        state.goodsList = res.list || [];
      }
    })
    .finally(() => {
      state.status = "more";
    })
    .catch(() => {
      state.goodsList = [];
      state.status = "no-more";
    });
}

onReady(() => {
  uni.setNavigationBarColor({
    backgroundColor: "#ffffff",
    frontColor: "#000000",
  });
});
onLoad(() => {
  nextTick(() => {
    state.offsetTop = layout.value.nabar.navHeight || 0;
  });
  state.pageInfo.pageIndex = 1;
  state.pageInfo.pageSize = 10;
  state.pageInfo.totalCount = 0;
  getGoodsList();
});
</script>

<style lang="scss" scoped>
:deep(.layout-box) {
  height: calc(
    100vh - env(safe-area-inset-bottom) - var(--nav-height) - 20rpx
  ) !important;
  // #ifdef H5
  height: calc(100vh - env(safe-area-inset-bottom) - 20rpx) !important;
  // #endif
}

:deep(.uni-searchbar) {
  background: #f5f5f5 !important;
}
</style>
