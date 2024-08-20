<template>
  <view class="boutique-box">
    <view
      v-for="(item, index) in goodsLits"
      :key="index"
      class="item"
      @click="handleItem(item)"
      :class="listItemClass"
    >
      <image
        :src="getImgUrlHost(item.image)"
        mode="widthFix"
        class="image"
      ></image>
      <view class="info-box">
        <view class="name">{{ item.productName }}</view>
        <view class="price-box">
          <span class="fuhao">¥</span>
          <span class="yuan">{{ item.price }}</span>
          <span class="num">/{{ item.unitName }}</span>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import api from "@/serve/api";
import { computed, reactive } from "vue";
const props: any = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  listItemClass: {
    type: String,
    default: "",
  },
});
const goodsLits = computed(() => {
  return props.list;
});
function handleItem(item: any) {
  uni.navigateTo({
    url: `/pages/goods-details/index?productId=${item.productId}`,
  });
}

function getImgUrlHost(url: string) {
  if (url.includes("https://") || url.includes("http://")) {
    return url;
  } else {
    return api.imageViewHost + url;
  }
}
</script>
<style lang="scss" scoped>
.boutique-box {
  // height: auto;
  // background-color: #ececec;
  border-radius: 0 0 10rpx 10rpx;
  -moz-column-count: 2;
  -webkit-column-count: 2;
  column-count: 2;
  -moz-column-gap: 10rpx;
  -webkit-column-gap: 10rpx;
  column-gap: 10rpx;
  overflow: hidden;
  .item {
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    background: #fff;
    border-radius: 10rpx;
    padding: 10rpx;

    .image {
      width: 100%;
      max-height: 400rpx;
      border-radius: 10rpx 10rpx 0 0;
    }
  }

  .info-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 80rpx;
    padding: 5rpx;
    .name {
      font-size: 30rpx;
      color: #444444;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 2; //行数
      line-clamp: 2;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
      line-height: 40rpx;
      letter-spacing: 4rpx;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
        Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji,
        Segoe UI Symbol, Noto Color Emoji, BlinkMacSystemFont, Helvetica Neue,
        Arial, PingFang SC, PingFang TC, PingFang HK, Microsoft Yahei,
        Microsoft JhengHei !important;
    }
    .price-box {
      display: flex;
      align-items: flex-end;
      color: #ff6200;
      // margin-left: 10rpx;

      .fuhao {
        font-size: 26rpx;
      }

      .yuan {
        font-size: 32rpx;
        margin-left: 6rpx;
        margin-right: 2rpx;
        letter-spacing: 1.5rpx;
        font-weight: 600;
      }

      .num {
        color: #a1a1a1;
        font-size: 22rpx;
      }
    }
  }
}
</style>
