<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    title="退款审核"
    :mask="true"
  >
    <uni-forms ref="formRef" :modelValue="formData" label-width="150rpx">
      <uni-forms-item
        label="审核类型"
        name="isAgree"
        required
        :rules="[
          {
            required: true,
            errorMessage: '请选择审核类型',
          },
        ]"
        ,
      >
        <uni-data-select
          v-model="formData.isAgree"
          :localdata="state.range"
        ></uni-data-select>
      </uni-forms-item>
      <uni-forms-item
        label="审核说明"
        name="refuseReason"
        :required="true"
        :rules="[
          {
            required: true,
            errorMessage: '请输入审核说明',
          },
        ]"
      >
        <uni-easyinput
          type="textarea"
          autoHeight
          v-model="formData.refuseReason"
          placeholder="请输入审核说明"
        ></uni-easyinput>
      </uni-forms-item>
    </uni-forms>
    <view class="but-box">
      <button @click="shows = false" class="but-item">取 消</button>
      <button
        :type="formData.isAgree === 1 ? 'primary' : 'warn'"
        @click="submitForm"
        class="but-item"
      >
        {{ formData.isAgree === 1 ? "退 款" : "拒 绝" }}
      </button>
    </view>
  </cn-popup>
</template>
<script lang="ts" setup>
import api from "@/serve/api";
import http from "@/serve/http";
import { reactive, computed, ref } from "vue";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  refund: {
    type: Object,
    default: () => {},
  },
});
const formData = reactive({
  isAgree: null,
  refundId: "",
  refuseReason: "",
});
const formRef = ref();
const emit = defineEmits(["update:show", "callback"]);
const state = reactive({
  loding: false,
  range: [
    { value: 1, text: "同意退款" },
    { value: 2, text: "拒绝退款" },
  ],
});
const shows = computed({
  get() {
    return props.show;
  },
  set(data) {
    emit("update:show", data);
  },
});
/**
 * submitForm 提交申请
 */
function submitForm() {
  formRef.value.validate().then(() => {
    http("POST", api.examine, formData).then(() => {
      uni.showToast({
        title: "审核成功",
        icon: "none",
      });
      emit("callback");
      shows.value = false;
    });
  });
}
function open() {
  formData.refundId = props.refund.refundId;
  state.loding = true;
}
function close() {
  emit("update:show", false);
}
</script>

<style lang="scss" scoped>
.info-box {
  font-size: 26rpx;
  line-height: 60rpx;
  color: #b3bac2;
  margin-bottom: 40rpx;
  .btm-item-button {
    display: inline;
    width: 200rpx;
    margin: inherit !important;
    border: 0 !important;
    color: $uni-color-primary;
    line-height: 40rpx;
    padding: 0;
  }
}
.but-box {
  display: flex;
  gap: 40rpx;
  justify-content: space-around;
  align-items: center;
  .but-item {
    flex: 1;
  }
}
</style>
