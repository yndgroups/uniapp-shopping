<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    title="退款详情"
    :mask="true"
  >
    <view class="cn-logistics" :class="state.loding ? 'cn-logistics1' : ''">
      <cn-steps v-if="!state.loding" :list="state.list" colors="#007aff" />
      <view v-else class="spinner-cycle-box">
        <uni-icons type="spinner-cycle" size="100"></uni-icons>
      </view>
    </view>
  </cn-popup>
</template>
<script lang="ts" setup>
import { reactive, computed, ref } from "vue";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:show"]);
const state = reactive({
  loding: false,
  list: <any>[],
});
const shows = computed({
  get() {
    return props.show;
  },
  set(data) {
    emit("update:show", data);
  },
});
function open() {
  state.list = props.list
    ? props.list.map((item: any) => {
        return {
          name:
            item.refundStatus === 1
              ? "待审核"
              : item.refundStatus === 2
              ? "已退款"
              : item.refundStatus === 3
              ? "已拒绝"
              : "--",
          time: item.createTime,
          isNow: 1,
          type: 1,
          desc: `${item.refundReason}  退款金额：${item.refundPrice}元`,
        };
      })
    : [];
  state.loding = true;
  setTimeout(() => {
    state.loding = false;
  }, 1500);
}
function close() {
  emit("update:show", false);
}
</script>

<style lang="scss" scoped>
.cn-logistics {
  padding: 20rpx;
  height: 65vh;
  overflow-y: auto;
}
.cn-logistics1 {
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner-cycle-box {
  height: max-content;
  width: max-content;
  animation: spin 2s linear infinite; /* 无限循环的旋转动画 */
  display: flex;
  justify-content: center;
  align-items: center;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
