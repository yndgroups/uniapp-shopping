<template>
  <view>
    <scroll-view
      class="layout"
      @scroll="scroll"
      @scrolltolower="scrolltolower"
      scroll-y
      :style="{
        '--pt':
          full && !checkIsWechatBrowser()
            ? nabar.navHeight * 2 + 'rpx'
            : '0rpx',
      }"
      :class="layoutClass"
    >
      <view
        v-if="head && !checkIsWechatBrowser()"
        class="head"
        :style="{
          '--height': nabar.navHeight + 'px',
          background: hBgColor,
        }"
      >
        <view
          class="head-title"
          :style="{
            color: titleColor,
            height: nabar.navigationBarHeight * 2 + 'rpx',
            marginTop: nabar.statusBarHeight + 'px',
          }"
        >
          <slot name="head">
            <view class="left">
              <uni-icons
                v-if="backs"
                :type="pages.length > 1 ? 'left' : 'home'"
                size="24"
                :color="titleColor"
                @click="back"
              ></uni-icons>
            </view>
            <view style="flex: 1"> {{ head }}</view>
            <!-- 占位 -->
            <view style="flex: 1"></view>
          </slot>
        </view>
      </view>
      <slot></slot>
      <uni-load-more v-if="more" v-bind="$attrs"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { checkIsWechatBrowser } from "@/utils/isWeChat";
const nabar = computed(() => {
  // 状态栏高度
  // #ifdef MP-WEIXIN
  let statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
  let custom: any = uni.getMenuButtonBoundingClientRect();
  // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
  let navigationBarHeight = custom.height + (custom.top - statusBarHeight) * 2;
  // 总体高度 = 状态栏高度 + 导航栏高度
  let navHeight = navigationBarHeight + statusBarHeight;
  return {
    statusBarHeight: statusBarHeight || 0, // 状态导航栏高度
    navHeight: navHeight || 0, // 总体高度
    navigationBarHeight: navigationBarHeight || 0, // 导航栏高度(标题栏高度)
    IsWechatWeb: false,
  };
  // #endif
  // #ifdef H5
  return {
    statusBarHeight: 0, // 状态导航栏高度
    navHeight: 60, // 总体高度
    navigationBarHeight: 60, // 导航栏高度(标题栏高度)
    IsWechatWeb: checkIsWechatBrowser(), //是否是在微信浏览器中打开
  };
  // #endif
});

const props = defineProps({
  more: {
    type: Boolean,
    default: false,
  },
  titleColor: {
    type: String,
    default: "#fff",
  },
  head: {
    type: String,
    default: "",
  },
  backs: {
    type: Boolean,
    default: true,
  },
  hBgColor: {
    type: String,
    default: "",
  },
  full: {
    type: Boolean,
    default: false,
  },
  layoutClass: {
    type: String,
    default: "",
  },
});

const emits = defineEmits<{
  (e: "scroll", event: Event): void;
  (e: "scrolltolower", event: Event): void;
}>();
const pages = computed(() => {
  return getCurrentPages();
});
function scroll(e: Event) {
  emits("scroll", e);
}
function scrolltolower(e: Event) {
  emits("scrolltolower", e);
}

function back() {
  if (pages.value.length > 1) {
    uni.navigateBack({ delta: 1 });
  } else {
    uni.switchTab({ url: "/pages/index/index" });
  }
}
defineExpose({
  nabar,
});
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  background: #f5f5f5;
  // #ifdef H5
  height: calc(100vh - 100rpx - env(safe-area-inset-bottom) - var(--pt));
  // #endif
  // #ifdef !H5
  height: calc(100vh - var(--pt));
  // #endif
  padding-top: var(--pt);

  :deep(.uni-scroll-view::-webkit-scrollbar) {
    display: none !important;
  }

  .head {
    position: fixed;
    z-index: 11;
    width: calc(100% - 40rpx);
    height: calc(var(--height));
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    top: 0;

    .head-title {
      width: 100%;
      height: var(--navigationBarHeight);
      text-align: center;
      letter-spacing: 8rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        text-align: start;
        flex: 1;
      }
    }
  }
}

.layout::-webkit-scrollbar {
  display: none !important;
}
</style>
