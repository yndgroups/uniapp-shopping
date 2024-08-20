<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    title="发货"
    :mask="true"
  >
    <view class="cn-send-out-goods">
      <uni-forms ref="from" :rules="rules" v-model="forms" label-width="80px">
        <uni-forms-item label="物流编号" required name="expressNo">
          <uni-easyinput
            v-model="forms.expressNo"
            placeholder="请输入物流编号"
          />
        </uni-forms-item>
      </uni-forms>
      <button type="primary" @click="submit()">提 交</button>
    </view>
  </cn-popup>
</template>
<script lang="ts" setup>
import api from "@/serve/api";
import http from "@/serve/http";
import { reactive, computed, ref } from "vue";
const from = ref();
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: Number,
    default: 0,
  },
});
const rules = {
  expressNo: {
    rules: [
      {
        required: true,
        errorMessage: "物流编号不能为空！",
      },
    ],
  },
};
const emit = defineEmits(["update:show", "callback"]);
let forms = reactive({
  //   expressCode: "",
  expressNo: "",
  orderId: 0,
});
const shows = computed({
  get() {
    return props.show;
  },
  set(data) {
    emit("update:show", data);
  },
});
function open() {}
function close() {
  emit("update:show", false);
  forms.expressNo = "";
  forms.orderId = 0;
}
// 提交
function submit() {
  from.value.validate().then(() => {
    let info = {
      expressNo: forms.expressNo || "",
      orderId: props.orderId || 0,
    };

    http("POST", api.updateExpressInfo, info).then(() => {
      emit("callback");
      shows.value = false;
    });
  });
}
</script>

<style lang="scss" scoped>
.cn-send-out-goods {
  padding-top: 60rpx;
  height: 20vh;
}
</style>
