<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    title="物流详细"
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
import api from "@/serve/api";
import http from "@/serve/http";
import { reactive, computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  num: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:show"]);
const state = reactive({
  loding: false,
  list: [],
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
  state.loding = true;
  http("POST", api.getkd100, { num: props.num })
    .then(({ data }: any) => {
      state.list = data
        ? data.map((item: any) => {
            return {
              name: item.status,
              time: item.time,
              isNow: 1,
              type: 1,
              desc: item.context,
            };
          })
        : [];
    })
    .finally(() => {
      state.loding = false;
    });
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
