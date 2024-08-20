<template>
  <swiper
    class="swiper"
    :style="{ '--pdbom': pdbom, '--height': height }"
    circular
    indicator-dots
    autoplay
  >
    <swiper-item
      v-for="(item, index) in lists"
      :key="index"
      @click="change(item)"
    >
      <cn-img
        class="cn-img"
        :src="item.imageUrl"
        :large="large"
        width="100%"
        height="100%"
        mode="aspectFill"
        radius="0"
        :previews="{
          urls: urls(lists),
        }"
      ></cn-img>
      <view v-if="title" class="title">
        {{ item.title }}
      </view>
    </swiper-item>
  </swiper>
</template>
  <script setup lang="ts">
import { computed, onMounted } from "vue";
const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
  pdbom: {
    type: String,
    default: "20rpx",
  },
  large: {
    type: Boolean,
  },
  title: {
    type: Boolean,
  },
  height: {
    type: String,
    default: "400rpx",
  },
});
const emit = defineEmits(["change"]);
function change(e: any) {
  emit("change", e);
}
function urls(list: any[]): string[] {
  return list.map((item: any) => {
    return item.imageUrl;
  });
}
const lists: any = computed(() => {
  return props.list || [];
});
onMounted(() => {});
</script>
  <style lang="scss" scoped>
.swiper {
  width: 100%;
  height: var(--height);
  padding-bottom: var(--pdbom);
  background: #f5f5f5;
}

.swiper-item {
  width: 100%;
  height: 100%;
}

.title {
  width: calc(100% - 40rpx);
  padding: 0 20rpx;
  border-top: 20rpx #030f2700 solid;
  border-bottom: 20rpx #030f2700 solid;
  position: absolute;
  z-index: 5;
  bottom: 0;
  background: #030f277a;
  border-bottom-right-radius: 10rpx;
  border-bottom-left-radius: 10rpx;
  color: #fff;
  letter-spacing: 4rpx;
  font-size: 28rpx;
  font-family: 仿宋;
  line-height: 40rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden; //溢出内容隐藏
  text-overflow: ellipsis; //文本溢出部分用省略号表示
  display: -webkit-box; //特别显示模式
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical; //盒子中内容竖直排列
}
</style>
  