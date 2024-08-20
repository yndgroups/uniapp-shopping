<template>
  <cn-layout
    head="商品详情"
    @scroll="scroll"
    :hBgColor="state.scrollTop > 100 ? '#01051660' : ''"
  >
    <view class="details-box">
      <cn-swiper
        :list="state.detail.sliderImage || []"
        pdbom="0"
        large
        height="500rpx"
      ></cn-swiper>
      <cn-goods-name :detail="state.detail"></cn-goods-name>
      <uni-card margin="10rpx 20rpx">
        <cn-cell
          title="选择"
          :value="
            state.detail.skuList && state.detail.skuList.length
              ? `共${state.detail.skuList.length}种规格可选`
              : '单规格商品，无需选择'
          "
          @click="
            state.detail.skuList && state.detail.skuList.length
              ? (state.show = true)
              : ''
          "
          :label="`已选择 ：${state.select.sukName || '无'}`"
          padding="20rpx 16rpx"
        />
        <cn-cell
          title="发货"
          value="请选择收获地址"
          padding="20rpx 16rpx"
          :label="`已选择 ：${
            selectAreas
              ? selectAreas.realName +
                '  ' +
                selectAreas.phone +
                '  ' +
                selectAreas.detail
              : '无'
          }`"
          @click="goAera"
        />
      </uni-card>
      <uni-card margin="10rpx 20rpx">
        <view class="content" v-html="state.detail.content"></view>
      </uni-card>
      <view class="uni-goods-nav-box">
        <cn-goods-nav
          :options="state.options"
          :fill="true"
          :button-group="state.buttonGroup"
          @click="handelItem"
          @buttonClick="buttonClick"
        />
      </view>
    </view>
    <cn-specs
      v-model:show="state.show"
      :list="state.detail.skuList || []"
      v-model="state.select"
      @addCard="addCard"
      @pay="pay"
    ></cn-specs>
  </cn-layout>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import http from "@/serve/http";
import { useStore } from "@/store";
import api from "@/serve/api";
// import apis from "@/serve/apis";
const store = useStore();
const selectAreas = computed(() => {
  return store.selectArea.selectArea;
});
const state: any = reactive({
  detail: { description: "" },
  options: [
    {
      icon: "chat",
      text: "客服",
      contact: true,
      sendMessageImg:
        "https://p3-aio.ecombdimg.com/obj/ecom-shop-material/v1_upeMONDU_70781134073537989120275_84b8ce27402b2b00e31b93fe24516d91_sx_3283741_www750-7383",
      sendMessageTitle: "客服小二",
    },
    {
      icon: "cart",
      text: "购物车",
      info: 0,
    },
  ],
  buttonGroup: [
    {
      text: "加入购物车",
      backgroundColor: "linear-gradient(90deg, #FFCD1E, #FF8A18)",
      color: "#fff",
    },
    {
      text: "立即购买",
      backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
      color: "#fff",
    },
  ],
  show: false,
  select: { num: 1 },
  scrollTop: 0,
});

/**
 * 获取token
 */
const token = computed(() => {
  //   return store.getters["getToken"] || null;
  return store.userInfo.token;
});

/**
 * 获取商品
 *
 * @param productId 商品id
 */
function getGoodsDetails(productId?: string) {
  http("GET", api.getProductDetails + `${productId}`).then((res: any) => {
    res.sliderImage = res.sliderImage
      ? res.sliderImage.split(",").map((item: string) => {
          return { imageUrl: item };
        }) || []
      : [];
    res.content = res.content
      ? res.content
          .replace(
            /<img([^>]*)>/g,
            "<img $1 style='' mode='widthFix' class='rich-img'/>"
          )
          .replace(
            /style="display: block; margin-left: auto; margin-right: auto;"/g,
            ""
          )
          .replace(/\<h1/g, '<h1  class="rich-h1"')
          .replace(/\<p/g, '<p  class="rich-p"')
      : "";
    state.detail = res || {};
  });
}

function buttonClick(res: any) {
  if (res.index) {
    subscribe()
    pay();
  } else {
    addCard();
  }
}

function subscribe() {
  uni.getSetting({
    withSubscriptions: true,
    success(res) {
      console.log(res, 'getSetting - success')
      uni.requestSubscribeMessage({
        tmplIds: [
          "rc-r-FZ6gwiq2tvkWwJeFckWRkU-RmReKyeFfkfFQLs",
          "aZHCMNQEVOQjF5SSYuPI_eV0tuBj7R7-UQYuQ9FQWx4",
        ],
        success(res) {
          console.log(res, "订阅成功");
        },
        fail(err) {
          console.log(err, "订阅失败");
        },
      });
    },
    fail(res) {
      console.log(res, "设置授权失败");
    },
  });
}

function handelItem(res: any) {
  if (res.index === 1) {
    goCart();
  }
}

function addCard() {
  let data = {
    // bargainId: null,
    // groupBuyId: null,
    image: `${state.detail.image}`,
    // presaleId: null,
    productAttrUnique: state.detail.productName,
    productId: `${state.detail.productId}`,
    productName: state.detail.productName,
    quantity: 1,
    // seckillId: null,
    specType: state.detail.specType,
    status: 1,
  };
  if (state.detail.specType > 1) {
    // 多规格
    if (state.select.skuId) {
      data.productId = state.select.skuId;
      data.quantity = state.select.num;
      // return
      setCart(data);
    } else {
      uni.showToast({
        title: "请选择规格",
        icon: "none",
        mask: true,
        duration: 1500,
      });
      setTimeout(() => {
        state.show = true;
      }, 500);
    }
  } else {
    setCart(data);
  }
}

/**
 * 支付
 */
function pay() {
  if (state.detail.specType === 2) {
    // 多规格
    if (state.select.skuId) {
      let selectList = {
        ...state.select,
        thumbnail: state.select.image,
        productName: state.detail.productName,
        quantity: state.select.num,
        specType: state.detail.specType,
        skuName: state.detail.productName,
      };
      store.payGoods.setPayList([selectList]);
      uni.navigateTo({ url: "/pages/pay/index" });
      uni.setStorageSync("backPath", {
        path: `/pages/details/index?productId=${state.detail.productId}`,
        type: 2,
      });
    } else {
      uni.showToast({
        title: "请选择规格",
        icon: "none",
        mask: true,
        duration: 1500,
      });
      setTimeout(() => {
        state.show = true;
      }, 500);
    }
  } else {
    let selectList = state.detail;
    selectList.thumbnail = selectList.image || "";
    selectList.productName = selectList.productName || "";
    selectList.quantity = 1;
    selectList.specType = selectList.specType;
    store.payGoods.setPayList([selectList]);
    uni.navigateTo({ url: "/pages/pay/index" });
    uni.setStorageSync("backPath", {
      path: `/pages/details/index?productId=${state.detail.productId}`,
      type: 2,
    });
  }
}

/**
 *
 * @param data 购物车添加
 */
function setCart(data: object) {
  http("POST", api.addcart, data).then(() => {
    uni.showToast({
      title: "加入购物车成功",
    });
    getCartCount();
    state.select = { num: 1 };
    state.show = false;
  });
}

function getCartCount() {
  http("GET", api.getCartCount).then((res) => {
    state.options[1].info = res || 0;
  });
}
function goCart() {
  uni.switchTab({ url: "/pages/cart/index" });
}
function goAera() {
  uni.navigateTo({
    url: "/pages/aera/index",
  });
}
function scroll({ detail }: any) {
  state.scrollTop = detail.scrollTop;
}
onLoad(({ productId }: any) => {
  getGoodsDetails(productId);
  if (token.value) {
    getCartCount();
  }
});
</script>

<style lang="scss" scoped>
.details-box {
  padding: 0 16rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
  width: calc(100% - 32rpx);
  :deep(.content) {
    width: 100%;

    .rich-img {
      width: 100%; /* 设置图片宽度 */
      height: auto; /* 高度自动以保持宽高比 */
      display: block; /* 去除图片底部的空白，如果是内联元素的话 */
      margin: 0 auto; /* 水平居中图片（如果需要的话） */
      border-radius: 10rpx;
    }

    .rich-h1 {
      line-height: 80rpx;
    }

    .rich-p {
      line-height: 80rpx;
    }
  }

  .uni-goods-nav-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    background: #ffffff;
    // background: #01051660;
  }
}
</style>
