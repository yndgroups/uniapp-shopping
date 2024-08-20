<template>
  <view
    class="cell-box"
    :style="{ padding: padding, '--bbm': bbm }"
    @click="emit('click')"
  >
    <view class="top-box">
      <view class="title-box">
        <slot name="left-icons" v-if="leftIcon">
          <uni-icons :type="leftIcon" size="24" color="#888888"></uni-icons>
        </slot>
        <slot name="title">
          <view class="title">{{ title }}</view>
        </slot>
      </view>
      <slot name="value">
        <view class="value-box">
          <view class="value">{{ value }}</view>
          <uni-icons
            v-if="isLink"
            type="right"
            color="#888888"
            size="18"
          ></uni-icons>
        </view>
      </slot>
    </view>
    <!--  -->
    <slot name="label">
      <view v-if="label" class="label">
        {{ label }}
      </view>
    </slot>
  </view>
</template>
<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: "左侧标题",
  },
  leftIcon: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  isLink: {
    type: Boolean,
    default: true,
  },
  mt: {
    type: Boolean,
    default: true,
  },
  padding: {
    type: String,
    default: "24rpx 20rpx",
  },
  bbm: {
    type: String,
    default: "2rpx",
  },
});
const emit = defineEmits(["click"]);
</script>
<style lang="scss" scoped>
.cell-box {
  // padding: 20rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: var(--bbm) #e4e4e4 solid;

  .top-box {
    display: flex;
    justify-content: space-between;

    .title-box {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        min-width: calc(100% / 2 - 20rpx);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 28rpx;
        color: #666666;
      }
    }

    .value-box {
      min-width: calc(100% / 2 - 20rpx);
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .value {
        // width: 400rpx;
        max-width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 28rpx;
        padding-right: 10rpx;
        color: #888888;
      }
    }
  }

  .label {
    font-size: 24rpx;
    color: #888888;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 2; //行数
    line-clamp: 2;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
  }
}
</style>
