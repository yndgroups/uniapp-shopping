<template>
  <cn-layout
    ref="layout"
    head="订单"
    hBgColor="linear-gradient(90deg, #FFCD1E, #FF8A18)"
    full
    layoutClass="layout-box"
    more
    :status="state.status"
    :style="{ '--nav-height': state.offsetTop * 2 + 'rpx' }"
    @scrolltolower="scrolltolower"
  >
    <cn-sticky :offsetTop="state.offsetTop" :scrollTop="state.scrollTop">
      <uni-segmented-control
        :current="state.current"
        :values="state.items.map((tab:any)=>tab.text)"
        @clickItem="onClickItem"
        styleType="text"
        activeColor="#007aff"
      />
    </cn-sticky>
    <uni-card
      v-for="(item, index) in state.list"
      :key="index"
      margin="30rpx 20rpx 0 20rpx"
      spacing="0"
    >
      <view class="info-title-box">商品信息</view>
      <view
        v-for="(product, i) in item.childDetail"
        class="content-box"
        :key="i"
      >
        <cn-img :src="product.image" width="200rpx" height="200rpx" large />
        <view class="info-box">
          <view class="title" style="color: #7e7e7e">
            {{ product.productName || "" }}
          </view>
          <view class="price">
            <text>X {{ product.quantity }}</text>
            <text class="num-box"
              >￥<text class="num">{{ product.price }}</text></text
            >
          </view>
        </view>
      </view>
      <view
        class="oder-info"
        :style="{
          height: item.show ? 'auto' : '60rpx',
          overflow: item.show ? 'auto' : 'hidden',
          transition: 'all 3.0s',
        }"
      >
        <view class="info-title-box" @click="item.show = !item.show">
          <text>订单信息</text>
          <text style="color: #007aff">{{
            item.show ? "收 起" : "展 开"
          }}</text>
        </view>
        <cn-info label="订单编号" :info="item.orderNo || '--'" />
        <cn-info label="物流编号" :info="item.expressNu || '--'" />
        <cn-info label="商品数量" :info="item.totalQuantity || '0'" />
        <cn-info
          label="订单总金额"
          :info="(item.totalPrice || '0.00') + '元'"
          infoColor="#ff6200"
        />
        <cn-info label="下单时间" :info="item.createTime || '--'" />
        <view class="info-title-box">收货人信息</view>
        <cn-info label="收货人姓名" :info="item.realName || '--'" />
        <cn-info label="收货人电话" :info="item.userPhone || '--'" />
        <cn-info label="收货人地址" :info="item.userAddress || '0'" />
        <cn-info label="收货人备注" :info="item.userMark || '--'" />
        <!-- userMark -->
      </view>
      <view class="btm-box">
        <button
          @contact="contact"
          open-type="contact"
          show-message-card
          :send-message-img="item.image"
          send-message-title="农品万联客服"
          plain
          class="btm-item btm-item-button"
          style="--color: #007aff"
        >
          <view>联系商家</view>
        </button>
        <view
          v-for="(btn, b) in btnList"
          :key="b"
          class="btm-item"
          @click="btn.events(item)"
          :style="{ '--color': btn.color }"
          v-show="btn.show(item)"
          >{{ btn.text }}
        </view>
      </view>
    </uni-card>
    <cn-logistics v-model:show="logisticsShow" :num="state.num" />
    <cn-send-out-goods
      v-model:show="outGoodsShow"
      :orderId="state.orderId"
      @callback="getOrderPageList()"
    />
    <cn-refund
      v-model:show="refundShow"
      @callback="getOrderPageList()"
      :refund="state.refund"
    />
    <!-- 退款进度 -->
    <cn-refund-steps v-model:show="refundStepsShow" :list="state.stepsList" />
  </cn-layout>
</template>

<script lang="ts" setup>
import api from "@/serve/api";
import http from "@/serve/http";
import { onShow } from "@dcloudio/uni-app";
import { nextTick, reactive, ref } from "vue";
// import { useStore } from "@/store";
import { computed } from "vue";
import { checkTime } from "@/utils/checkTime";
import { payOrder } from "@/utils/payOrder";
// const store = useStore();
const layout: any = ref(null);
const logisticsShow = ref(false);
const outGoodsShow = ref(false);
const refundShow = ref(false);
const refundStepsShow = ref(false);
// 订单状态(1:待付款[默认] 2:待发货 3:已发货 4:待收货 5:已收货 6:待评价 7:订单关闭)
const state: any = reactive({
  items: [
    { text: "待付款", value: 1 },
    { text: "待发货", value: 2 },
    { text: "已发货", value: 3 },
    { text: "已收货", value: 5 },
    { text: "已完成", value: 7 },
    { text: "退款", value: 8 },
  ],
  offsetTop: 0,
  scrollTop: 0,
  status: "more",
  num: "",
  orderId: 0,
  refund: {},
  list: <any>[],
  stepsList: [],
  current: 0,
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    params: {
      status: 1,
    },
  },
});

const btnList = computed<any[]>(() => {
  return [
    {
      text: "查看物流",
      show: (item: any): boolean => ![1, 2, 7].includes(item.status),
      events: (potions: any) => handleLogisticsShow(potions),
      color: "#4cd964",
    },
    {
      text: "立即支付",
      show: (item: any): boolean =>
        [1].includes(item.status) && checkTime(item.createTime),
      events: (potions: any) => pay(potions),
      color: "#4cd964",
    },
    {
      text: "申请退款",
      show: (item: any): boolean => {
        if (![1, 7, 8].includes(item.status)) {
          return true;
        } else if (item.status === 8 && item.refundStatusType === 3) {
          return true;
        } else {
          return false;
        }
      },
      events: (potions: any) => handelRefundShow(potions),
      color: "#f0ad4e",
    },
    {
      text: "退款详情",
      show: (item: any): boolean => [8].includes(item.status),
      events: (potions: any) => {
        state.stepsList = potions.refunds || [];
        refundStepsShow.value = true;
      },
      color: "#4cd964",
    },
    {
      text: "确认收货",
      color: "#f0ad4e",
      show: (item: any): boolean => [3, 4].includes(item.status),
      events: (potions: any) => handleReceivingGoods(potions),
    },
    {
      text: "删 除",
      color: "#dd524d",
      show: (item: any): boolean => ![1, 2, 3, 8].includes(item.status),
      events: (potions: any) => handleDeletItems(potions),
    },
  ];
});
function onClickItem({ currentIndex }: any) {
  let value = state.items[currentIndex].value;
  state.pageInfo.params.status = value;
  state.pageInfo.pageIndex = 1;
  state.pageInfo.pageSize = 10;
  state.pageInfo.totalCount = 0;
  getOrderPageList();
}
/**
 * 立即支付
 */
function pay(payData: any) {
  payOrder(payData.tradeNo);
}
function scrolltolower() {
  if (
    state.pageInfo.pageIndex * state.pageInfo.pageSize <
    state.pageInfo.totalCount
  ) {
    state.pageInfo.pageIndex += 1;
    getOrderPageList(1);
  } else {
    state.status = "no-more";
  }
}
/**
 * handelRefundShow 申请退款
 * @param type
 */
function handelRefundShow(options: any) {
  state.refund = options || {};
  refundShow.value = true;
}
function getOrderPageList(type?: number) {
  state.status = "loading";
  http("POST", api.getOderList, state.pageInfo)
    .then((res: any) => {
      state.pageInfo.pageIndex = res.pageIndex;
      state.pageInfo.totalCount = res.totalCount;
      res.list = res.list.map((item: any) => {
        item.show = false;
        if (item.refunds && item.refunds.length) {
          item.refundStatusType = item.refunds[0].refundStatus || 0;
        }
        return item;
      });
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
      if (
        state.pageInfo.pageIndex * state.pageInfo.pageSize >=
        state.pageInfo.totalCount
      ) {
        state.status = "no-more";
      }
    })
    .catch(() => {
      state.status = "no-more";
    });
}
/**
 * 确认收货
 */
function handleReceivingGoods(item: any) {
  uni.showModal({
    title: "温馨提示",
    content: "您将确定收货?",
    success: function (res: any) {
      if (res.confirm) {
        uni.showLoading({ title: "确认收货中..." });
        http("GET", api.receivingGoods + `${item.orderId}`)
          .then(() => {
            getOrderPageList();
            uni.showToast({
              title: "祝您购物愉快!感谢！",
              icon: "none",
            });
          })
          .finally(() => {
            setTimeout(() => {
              uni.hideLoading();
            }, 1500);
          });
      }
    },
  });
}
/**
 * handleDeletItems
 * 删除
 */
function handleDeletItems(item: any) {
  console.log(item, "删除");

  // deleteOrder
  uni.showModal({
    title: "温馨提示",
    content: "您确定要删除这条订单记录吗?",
    success: function (res: any) {
      if (res.confirm) {
        http("DELETE", api.deleteOrder, [item.orderId])
          .then(() => {
            uni.showToast({
              title: "已删除",
              icon: "success",
            });
            getOrderPageList();
          })
          .finally(() => {
            setTimeout(() => {
              uni.hideLoading();
            }, 1500);
          });
      }
    },
  });
}
function handleLogisticsShow(item: any) {
  if (item.expressNu) {
    state.num = item.expressNu;
    logisticsShow.value = true;
  } else {
    uni.showToast({
      title: "物流状态异常，请联系商家处理",
      icon: "none",
      duration: 2000,
    });
  }
}
function contact(res: any) {
  console.log(res, "xxxxxxx");
}
onShow(() => {
  nextTick(() => {
    state.offsetTop = layout.value.nabar.navHeight || 0;
  });
  getOrderPageList();
});
</script>

<style lang="scss" scoped>
.content-box {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0 10rpx 20rpx;
  .info-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 20rpx;

    .price {
      display: flex;
      justify-content: space-between;

      .num-box {
        color: #ff6200;
        .num {
          font-size: 38rpx;
          font-weight: bold;
        }
      }
    }
  }
}

.title {
  font-size: 28rpx;
}

:deep(.layout-box) {
  height: calc(
    100vh - env(safe-area-inset-bottom) - var(--nav-height) - 20rpx
  ) !important;
  // #ifdef H5
  height: calc(100vh - env(safe-area-inset-bottom) - 20rpx) !important;
  // #endif
}

:deep(.segmented-control) {
  background: #ffffff !important;
  .segmented-control__item {
    .segmented-control__text {
      font-size: 32rpx !important;
    }
  }
}

.name {
  font-size: 28rpx;
  color: #9b9b9b;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden; //溢出内容隐藏
  text-overflow: ellipsis; //文本溢出部分用省略号表示
  display: -webkit-box; //特别显示模式
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical; //盒子中内容竖直排列
  line-height: 36rpx;
}

.btm-box {
  padding-top: 20rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 20rpx;
  .btm-item {
    flex: 1;
    max-width: 204rpx;
    min-width: 204rpx;
    line-height: 60rpx !important;
    color: var(--color) !important;
    text-align: center;
    border-radius: 10rpx;
    border: 1rpx var(--color) solid;
    letter-spacing: 2rpx;
    font-size: 26rpx;
    &:active {
      box-shadow: 1rpx 0rpx 20rpx 4rpx #bbbbbb52;
    }
  }
}

.btm-item-button {
  padding: 0 !important;
  font-size: 30rpx;
  margin: unset !important;
}

.info-title-box {
  margin-bottom: 15rpx;
  font-weight: 600;
  color: #646464;
  border-bottom: 1rpx #ececec dashed;
  padding-bottom: 10rpx;
  line-height: 80rpx;
  letter-spacing: 4rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
