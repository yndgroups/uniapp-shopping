<template>
  <cn-layout
    ref="layout"
    head="下单"
    full
    hBgColor="linear-gradient(90deg, #FFCD1E, #FF8A18)"
  >
    <cn-sticky :offsetTop="state.offsetTop" :scrollTop="state.scrollTop">
      <uni-card
        @click="goSelect"
        spacing="0"
        padding="20rpx"
        margin="0 0 16rpx 0"
      >
        <view class="aera-card">
          <uni-icons
            type="location-filled"
            size="24"
            color="#007aff"
          ></uni-icons>
          <view class="aera-info">
            <view class="aera-name" v-if="selectAreas.addressId">
              {{ selectAreas.detail || "" }}
            </view>
            <view class="aera-name" v-else style="color: red">
              您还没有收货地址哦!
            </view>
            <view v-if="selectAreas.addressId" class="phone">
              {{
                (selectAreas.realName || "") + " " + (selectAreas.phone || "")
              }}
            </view>
          </view>
          <uni-icons type="right" size="24" color="#7a7a7a" />
        </view>
      </uni-card>
    </cn-sticky>
    <view class="content-box">
      <uni-card
        v-for="(item, index) in payList"
        :key="index"
        spacing="0"
        padding="20rpx"
        margin="20rpx"
      >
        <view class="goods-cart-box">
          <cn-img
            :src="item.image"
            width="140rpx"
            height="140rpx"
            large
            :options="{
              background: '#eeeeee',
              margin: '10rpx',
              padding: '10rpx',
            }"
            mode="widthFix"
          />
          <view class="info-box">
            <view class="productName">{{ item.productName }}</view>
            <view class="price-num">
              <text class="price">
                <text class="fh">¥</text>
                <text>{{ item.price }}</text>
              </text>
              <text>X {{ item.quantity }}</text>
            </view>
          </view>
        </view>
        <template #actions>
          <view class="card-actions">
            <cn-cell title="配送服务" value="快递 包邮"></cn-cell>
          </view>
        </template>
      </uni-card>
      <view style="margin: 20rpx;">
        <uni-easyinput
          v-model="state.userMark"
          placeholder="订单备注"
          type="textarea"
        />
      </view>
    </view>
    <view class="uni-goods-nav-box">
      <cn-goods-nav
        :options="[]"
        :fill="true"
        :button-group="state.buttonGroup"
        @buttonClick="buttonClick"
      >
        <view class="totol-box">
          <text>共 {{ payList.length }} 件</text>
          <view class="totol">
            <text>合计 :</text>
            <text class="price">
              <text class="fh">¥</text>
              <text>{{ totol }}</text>
            </text>
          </view>
        </view>
      </cn-goods-nav>
    </view>
    <!-- <cn-pay-type
      v-model:show="state.show"
      @confirm="confirmType"
      :money="state.money"
      :price="totol"
    ></cn-pay-type> -->
    <!-- <cn-pay-word
      v-model:show="state.showPass"
      @confirm="confirm"
      :money="totol"
      @cancel="cancelPass"
      payInfo="零钱支付"
    ></cn-pay-word> -->
  </cn-layout>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { onShow } from "@dcloudio/uni-app";
import { reactive, ref, nextTick, computed, onBeforeMount } from "vue";
import { payOrder } from "@/utils/payOrder";
import { addition, multiplication } from "@/utils/operation";
import getConfId from "@/utils/getConfID";
// import encode from '@/utils/setEncode'
import api from "@/serve/api";
import http from "@/serve/http";
// const { proxy }: any = getCurrentInstance()
const store = useStore();
const payList = computed<any>(() => {
  return store.payGoods.payList || [];
});
const selectAreas = computed(() => {
  return store.selectArea.selectArea;
});
const layout: any = ref(null);
const state = reactive({
  scrollTop: 0,
  offsetTop: 0,
  userMark: "",
  buttonGroup: [
    {
      text: "提交订单",
      backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
      color: "#fff",
    },
  ],
  show: false,
  orderId: "",
  showPass: false,
  money: 0,
});

const totol = computed(() => {
  let num: number = 0;
  let totols: number = 0;
  let arr: number[] = payList.value.map((item: any) => {
    return multiplication(item.price, item.quantity);
  });
  if (arr.length) {
    totols = arr.reduce(function (pre: number, curr: number) {
      num = Number(addition(pre, curr));
      return num;
    });
  }
  return totols;
});

function buttonClick() {
  if (payList.value && payList.value.length) {
    if (selectAreas.value && selectAreas.value.addressId) {
      pay();
    } else {
      uni.showToast({ title: "您没有收获地址！", icon: "error" });
    }
  } else {
    uni.showToast({ title: "没有下单商品！", icon: "error" });
  }
}

function pay() {
  state.orderId = "";
  uni.showLoading({ title: "正在下单", mask: true });
  let psgeInfo = {
    confId: getConfId(),
    productList: payList.value.map((item: any) => {
      return {
        // 多规格下单传skuId
        productId: item.specType === 1 ? item.productId: item.skuId,
        quantity: Number(item.quantity),
        specType: Number(item.specType),
      };
    }),
    addressId:  `${selectAreas.value.addressId || ''}`,
    userMark: state.userMark,
  };
  http("POST", api.createOrder, psgeInfo)
    .then(({ prepay_id }: any) => {
      // state.orderId = data;
      // 2微信支付,1零钱支付
      payOrder(prepay_id);
    })
    .catch(() => {
      uni.showToast({ title: "下单失败", icon: "error" });
    })
    .finally(() => {
      setTimeout(() => {
        uni.hideLoading();
      }, 1500);
    });
}

// function findBalance() {
//   apis.getJSON(apis.findBalance).then((data: number | any) => {
//     state.money = data || 0
//   })
// }

function goSelect() {
  uni.navigateTo({
    url: "/pages/aera/index",
  });
}

// 交易类型回调
// function confirmType(tradeType: number) {
//   state.show = false
//   if (tradeType === 2) {
//     payOrder(state.orderId, tradeType)
//   } else {
//     state.showPass = true
//   }
// }

// 零钱支付回调
// function confirm(val: any, then: Function) {
//   uni.showLoading({ title: '支付中' })
//   let payType = 2 //微信小程序
//   // #ifdef H5
//   payType = 1 // 公众号H5
//   // #endif
//   apis
//     .postJSON(apis.payOrder, {
//       data: {
//         orderId: state.orderId,
//         payType: payType,
//         tradeType: 1,
//         payPwd: encode(val.password),
//       },
//     })
//     .then(() => {
//       then('success')
//       uni.showToast({ title: '支付成功', icon: 'success', duration: 1300 })
//       setTimeout(() => {
//         uni.navigateTo({ url: '/pages/success/index' })
//       }, 1200)
//     })
//     .catch(error => {
//       then('error', error.data || error.message)
//     })
//     .finally(() => {
//       setTimeout(() => {
//         uni.hideLoading()
//       }, 1200)
//     })
// }

// function cancelPass() {
//   uni.showToast({ title: '取消支付', icon: 'error' })
// }
onBeforeMount(() => {
  const path = uni.getStorageSync("backPath");

  if (!payList.value.length) {
    if (path.type === 1) {
      setTimeout(() => {
        uni.switchTab({
          url: path.path,
          success: () => {
            uni.setStorageSync("backPath", {});
          },
        });
      }, 2000);
    } else {
      setTimeout(() => {
        uni.redirectTo({
          url: path.path,
          success: () => {
            uni.setStorageSync("backPath", {});
          },
        });
      }, 2000);
    }
  }
});
onShow(() => {
  nextTick(() => {
    // findBalance()
    state.offsetTop = layout.value.nabar.navHeight || 0;
  });
});
</script>

<style lang="scss" scoped>
.aera-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 180rpx;

  .aera-info {
    flex: 90%;
    padding: 0 20rpx;

    .aera-name {
      font-size: 28rpx;
      color: #0a0730;
      letter-spacing: 4rpx;
    }

    .phone {
      font-size: 28rpx;
      color: #686868;
      letter-spacing: 2rpx;
      margin-top: 5px;
    }
  }
}

.content-box {
  padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);

  .goods-cart-box {
    flex: 1;
    display: flex;
    align-items: center;

    .info-box {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      padding: 10rpx;
      height: 160rpx;

      .productName {
        font-size: 28rpx;
        color: #7e7e7e;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden; //溢出内容隐藏
        text-overflow: ellipsis; //文本溢出部分用省略号表示
        display: -webkit-box; //特别显示模式
        -webkit-line-clamp: 2; //行数
        line-clamp: 2;
        -webkit-box-orient: vertical; //盒子中内容竖直排列
        line-height: 36rpx;
      }

      .price-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .price {
        color: red;
        font-size: 40rpx;

        .fh {
          font-size: 28rpx;
          margin-right: 6rpx;
        }
      }
    }
  }

  .card-actions {
    padding: 0rpx 20rpx 20rpx 20rpx;
  }

  .radio-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .payType-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-box {
        display: flex;
        align-items: center;

        .img {
          width: 60rpx;
          height: 60rpx;
          padding: 20rpx 20rpx 20rpx 0;
        }

        .title {
          color: #7c7c7c;
          letter-spacing: 4rpx;
        }
      }
    }
  }
}

.uni-goods-nav-box {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;

  .totol-box {
    color: #7e7e7e;
    font-size: 28rpx;
    padding: 0 20rpx;
    display: flex;
    flex-direction: column;

    .totol {
      font-size: 32rpx;
      letter-spacing: 2rpx;
      display: flex;
      align-items: center;
    }

    text {
      letter-spacing: 4rpx;
    }

    .price {
      color: red;
      font-size: 40rpx;

      .fh {
        font-size: 28rpx;
      }
    }
  }
}
</style>
