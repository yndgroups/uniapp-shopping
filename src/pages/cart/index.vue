<template>
  <cn-layout :backs="false" hBgColor="linear-gradient(90deg, #FFCD1E, #FF8A18)">
    <!-- <cn-null v-if="!state.list.length"></cn-null> -->
    <checkbox-group @change="checkboxChange" class="content-box">
      <uni-card
        v-for="item in state.list"
        :key="item.productId"
        margin="10rpx 20rpx"
        spacing="0"
        shadow="0"
      >
        <view class="item-box">
          <checkbox
            :value="item.productId"
            @click="checkedAmount"
            :checked="item.checked"
            color="#2979ff"
          />
          <view class="goods-cart-box">
            <cn-img
              :src="item.image"
              width="140rpx"
              height="140rpx"
              large
              :options="{
                background: ' #eeeeee',
                margin: '10rpx',
                padding: '10rpx',
              }"
            />
            <view class="info-box">
              <view class="productName">{{ item.productAttrUnique }}</view>
              <view class="price-num">
                <text class="price">
                  <text class="fh">¥</text>
                  <text>{{ item.price }}</text>
                </text>
                <uni-number-box
                  @change="saveCartList(item)"
                  v-model="item.quantity"
                  :min="1"
                  :max="10000"
                />
              </view>
            </view>
          </view>
        </view>
      </uni-card>
    </checkbox-group>
    <view class="uni-goods-nav-box">
      <cn-goods-nav
        :button-group="state.buttonGroup"
        :fill="true"
        @buttonClick="buttonClick"
      >
        <template #head>
          <view v-if="state.selectList.length" class="btn-item-box">
            <view class="btn-item" @click="handelDel(1)"> 删除已选 </view>
            <view
              class="btn-item"
              @click="handelDel(2)"
              v-if="isShow(state.list)"
            >
              删除未选
            </view>
            <view class="btn-item" @click="handelDel(3)"> 删除所有 </view>
          </view>
        </template>
        <view class="all-select-box">
          <checkbox-group @change="handelAll">
            <checkbox
              value="cb"
              :checked="state.allSelect"
              color="#2979ff"
              style="transform: scale(1.1)"
              :disabled="!state.list.length"
            />
          </checkbox-group>
          <view class="totol-box">
            <text>已选择{{ state.selectList.length }}件</text>
            <view class="totol">
              <text>合计:</text>
              <text class="price">
                <text class="fh">¥</text>
                <text>{{ totol }}</text>
              </text>
            </view>
          </view>
        </view>
      </cn-goods-nav>
    </view>
  </cn-layout>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance, watch, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useStore } from "@/store";
import { mul, add } from "encjs/core/maths";
import http from "@/serve/http";
import api from "@/serve/api";
const { proxy }: any = getCurrentInstance();
const store = useStore();
const state: any = reactive({
  list: [],
  timerId: 0,
  buttonGroup: [
    {
      text: "结 算",
      backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
      color: "#fff",
    },
  ],
  allSelect: false,
  status: "more",
  selectList: [],
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
  },
});
// watch(
//   () => state.selectList,
//   (value: any) => {
//     let list = value.map((item: any) => {
//       return item.productId;
//     });
//     state.list.forEach((item: any) => {
//       if (!list.includes(item.productId)) {
//         item.checked = false;
//       }
//     });
//     state.allSelect =
//       value.length === state.list.length && state.list.length ? true : false;
//   }
// );

function checkedAmount() {
  state.selectList = state.list.filter((item: any) => item.checked);
  state.allSelect = state.list.every((item: any) => item.checked);
}

const totol = computed(() => {
  let totols: number = 0;
  state.list.map((item: any) => {
    if (item.checked) {
      let current = mul(item.price, item.quantity);
      totols = add(totols, current);
    }
  });
  return totols;
});

/**
 * 修改购物车中的商品输了呢
 *
 * @param num 商品数量
 * @param cartId 购物车id
 */
function saveCartList(item: any) {
  // console.log(num, "getChangeQuantity", cartId);
  if (state.timerId) {
    clearTimeout(state.timerId);
  }
  state.timerId = setTimeout(() => {
    http("PUT", api.addcart, item).then(() => {
      getCartList();
    });
  }, 1000);
}

function buttonClick() {
  if (state.selectList.length) {
    let selectLists = state.selectList.map((item: any) => {
      console.log(item,'xxxxxxxx')
      return {
        ...item,
        thumbnail: item.image,
        productName: item.productAttrUnique,
        quantity: item.quantity,
        price:item.price,
        specType: item.specType,
        skuName: item.productAttrUnique,
      };
    });
    store.payGoods.setPayList(selectLists);
    uni.navigateTo({ url: "/pages/pay/index" });
    uni.setStorageSync("backPath", { path: "/pages/cart/index", type: 1 });
  } else {
    uni.showToast({
      icon: "error",
      title: "请选择商品",
    });
  }
}
function handelAll({ detail }: any) {
  if (detail.value.length) {
    setSelectList(true);
  } else {
    setSelectList(false);
  }
}
function checkboxChange({ detail }: any) {
  let ids = detail.value || [];
  state.list = state.list.map((item: any) => {
    item.checked = ids.includes(String(item.productId));
    return item;
  });
}

function getCartList() {
  http("POST", api.getCartfindPageList, state.pageInfo)
    .then((data: any) => {
      let list = data.list || [];
      state.list =
        list.map((item: any) => {
          item.checked = false;
          return item;
        }) || [];
      setSelectList(state.allSelect);
    })
    .catch(() => {
      setSelectList(false);
      state.list = [];
    });
}
function setSelectList(type: boolean) {
  state.list.forEach((item: any) => {
    item.checked = type;
  });
  state.allSelect = type;
  state.selectList = type ? state.list : [];
}
function handelDel(type: number) {
  let ids: string[] = [];
  if (type === 1) {
    ids = state.selectList.map((item: any) => {
      return item.cartId;
    });
  } else {
    state.list.forEach((item: any) => {
      if (type === 3) {
        ids.push(item.cartId);
      } else {
        if (!item.checked) {
          ids.push(item.cartId);
        }
      }
    });
  }

  uni.showModal({
    title: "温馨提示",
    content: `您将要删除${ids.length}条数据`,
    success: function (res) {
      if (res.confirm) {
        http("DELETE", api.addcart, ids).then(() => {
          uni.showToast({
            title: "操作成功",
          });
          getCartList();
        });
      }
    },
  });
}

function isShow(list: any[]): boolean {
  let arr = list.filter((item: any) => {
    return !item.checked;
  });
  return arr.length ? true : false;
}
onShow(() => {
  getCartList();
});
</script>

<style lang="scss" scoped>
.uni-goods-nav-box {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  // #ifdef H5
  bottom: calc(100rpx + env(safe-area-inset-bottom));
  // #endif
  // #ifdef !H5
  bottom: 0;
  // #endif
  z-index: 2;

  .all-select-box {
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    width: 400rpx;

    .totol-box {
      color: #7e7e7e;
      font-size: 28rpx;
      padding: 0 20rpx;
      flex: 1;

      .totol {
        font-size: 32rpx;
        letter-spacing: 2rpx;
      }
    }
  }
}

.content-box {
  // background: #099;
  padding-bottom: 240rpx;
  padding-top: 20rpx;
  display: flex;
  flex-direction: column;

  .item-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: auto;

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
      }
    }
  }
}

.price {
  color: red;
  font-size: 40rpx;

  .fh {
    font-size: 28rpx;
    margin-right: 6rpx;
  }
}

.btn-item-box {
  display: flex;
  background: #fff;
  padding: 10rpx 20rpx;

  .btn-item {
    border: 2rpx #dd524d solid;
    padding: 10rpx;
    margin-right: 20rpx;
    border-radius: 10rpx;
    font-size: 28rpx;
    color: #dd524d;

    &:active {
      background: #ebebeb;
    }
  }
}
</style>
