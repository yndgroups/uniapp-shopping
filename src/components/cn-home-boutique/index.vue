<template>
  <view class="cn-home-boutique">
    <r-section title="精品推荐" type="line">
      <cn-goods-list :list="list" />
    </r-section>
  </view>
</template>
<script lang="ts" setup>
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

function handleItem(item: any) {
  uni.navigateTo({
    url: "/pages/goods-details/index",
  });
}
</script>
<style lang="scss" scoped>
.cn-home-boutique {
  width: calc(100% - 40rpx);
  margin: 20rpx auto;
}
</style>
