<template>
  <cn-layout
    more
    @scrolltolower="scrolltolower"
    @scroll="scroll"
    ref="layout"
    :status="state.status"
    head=" "
  >
    <template #head>
      <view class="search-box" @click="handleSearch">
        <uni-icons type="search" size="60rpx" color="#ffffff" />
        <text>搜索商品</text>
      </view>
    </template>

    <cn-sticky :offsetTop="state.offsetTop" :scrollTop="state.scrollTop">
      <cn-home-ad :list="state.adList" />
      <cn-home-gard></cn-home-gard>
    </cn-sticky>
    <cn-home-boutique :list="state.list" />
  </cn-layout>
</template>

<script setup lang="ts">
import api from "@/serve/api";
import http from "@/serve/http";
import { useStore } from "@/store";
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
const layout = ref();
const store = useStore();
const state: any = reactive({
  scrollTop: 0,
  offsetTop: 0,
  status: "no-more",
  list: [],
  adList: [],
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
function scroll(e: any) {
  const { scrollTop } = e.detail;
  state.scrollTop = scrollTop;
}

function handleSearch() {
  uni.navigateTo({ url: "/pages/search/index" });
}

function getGoodsList(type?: number) {
  state.status = "loading";
  http("POST", api.getProductList, state.pageInfo)
    .then((res: any) => {
      state.pageInfo.pageIndex = res.pageIndex;
      state.pageInfo.totalCount = res.totalCount;
      if (type === 1) {
        let list = state.list;
        list.push(...res.list);
        state.list = list;
      } else {
        state.list = res.list || [];
      }
    })
    .finally(() => {
      state.status = "more";
    })
    .catch(() => {
      state.list = [];
      state.status = "no-more";
    });
}

function getAdList() {
  http("GET", api.getAdList).then(({ content }: any) => {
    state.adList = content || [];
  });
}

onLoad(() => {
  state.pageInfo.pageIndex = 1;
  state.pageInfo.pageSize = 10;
  state.pageInfo.totalCount = 0;
  getGoodsList();
  getAdList();

  /* let data = {"appId":"wx46e069e7cc0d56f4","nonceStr":"53D8BB4EE0CD4353AFF5DD5EB1AA1FD7","package":"prepay_id=wx12193526235701bc9a808ba9018ae20000","paySign":"zMmBj3cEAE9Z/4v9vDGmo1D9egeqaVyjkBAG8VIr/UPh5egCj9ylay4pmEEEj+/qp8NZBXv5orK2yh/Fv0Xea2HC3oDreeHsnMalNo3dmVyYMYRZdwA/8DAVBYEsC170h5g56xOA0Gv5I6S02xj5UYc3e/BgW4+xH49n9iMPQGF5Prc189+yYR3zs70Fy0/aX61fyDw4rCDrEiCipQ3ftmnW+rcWV3C2uA2XhiDLdqlCv+TCC+MWW1b10Npk/wyWWu+DbfNp2sG5zvdt+5Kbo9kSdKLDBhVIppjr3md6mse1gsmkjHdeMZmijtuyw+zveYnoO9o1s9rHrCGHw1hzpQ==","prepayId":"wx12193526235701bc9a808ba9018ae20000","signType":"RSA","timeStamp":"1718192139"}
  // 小程序支付
  uni.requestPayment(<any>{
      provider: "wxpay",
      ...data,
      success(res: any) {
        uni.showToast({ title: "支付成功" });
        uni.reLaunch({ url: "/pages/success/index" });
      },
      fail(e: any) {
        uni.showToast({ title: "支付失败", icon: "error", duration: 1300 });
      },
      complete() {
        setTimeout(() => {
          uni.hideLoading();
        }, 1300);
      },
    }); */
});
</script>

<style lang="scss" scoped>
.content-box {
  padding: 20rpx;
}

.search-box {
  width: 70%;
  // #ifdef H5
  width: 100%;
  // #endif
  height: 65rpx;
  background-color: #cacaca31;
  border-radius: 40rpx;
  border: 1rpx #ffffff solid;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  gap: 20rpx;
}
</style>
