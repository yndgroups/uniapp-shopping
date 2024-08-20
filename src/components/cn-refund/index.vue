<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    title="申请退款/退货"
    :mask="true"
  >
    <uni-forms ref="formRef" :modelValue="formData" label-width="150rpx">
      <uni-forms-item label="申请类型" name="refundType" required>
        <uni-data-select
          v-model="formData.refundType"
          :localdata="state.range"
        ></uni-data-select>
      </uni-forms-item>
      <uni-forms-item label="退款金额" name="refundPrice" required>
        <uni-easyinput
          type="digit"
          v-model="formData.refundPrice"
          placeholder="请输入退款金额"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item label="联系电话" name="refundPhone" required>
        <uni-easyinput
          v-model="formData.refundPhone"
          placeholder="请输入联系电话"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item label="快递单号" name="refundExpressNo">
        <uni-easyinput
          v-model="formData.refundExpressNo"
          placeholder="请输入快递单号"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item label="退款原因" name="refundReason" required>
        <uni-easyinput
          type="textarea"
          autoHeight
          v-model="formData.refundReason"
          placeholder="请输入退款原因"
        ></uni-easyinput>
      </uni-forms-item>
    </uni-forms>
    <view class="info-box">
      注意：目前平台申请退款仅支持仅退款，退款之前最好通过点击<button
        open-type="contact"
        show-message-card
        send-message-title="联系客服"
        plain
        class="btm-item-button"
      >
        联系商家</button
      >与商家沟通，我们会继续努力,为您提供更好购物体验！
    </view>
    <view class="but-box">
      <button @click="shows = false" class="but-item">取 消</button>
      <button type="primary" @click="submitForm" class="but-item">提 交</button>
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
  refundReason: "",
  refundPrice: "",
  refundPhone: "",
  refundExpressNo: "",
  orderId: "",
  refundType: "",
});
const formRef = ref();
const emit = defineEmits(["update:show", "callback"]);
const state = reactive({
  loding: false,
  range: [
  { value: 1, text: "仅退款" },
    { value: 2, text: "退款退货", disable: true },
    { value: 3, text: "退换", disable: true },
  ],
  rules: {
    refundType: {
      rules: [
        {
          required: true,
          errorMessage: "请选择退款类型",
        },
      ],
    },
    refundPrice: {
      rules: [
        {
          required: true,
          errorMessage: "请输入退款金额",
        },
        {
          validateFunction: (rule, value, data, callback) => {
            console.log(value,'ccccccccccc')
            return new Promise((resolve, reject) => {
              if (Number(value) <= props.refund.totalPrice) {
                // 通过返回 resolve
                resolve(true);
              } else {
                // 不通过返回 reject(new Error('错误信息'))
                reject(new Error("退款金额不能大于订单金额"));
              }
            });
          },
        },
      ],
    },
    refundPhone: {
      rules: [
        {
          required: true,
          errorMessage: "请输入联系电话",
        },
        {
          validateFunction: (rule, value, data, callback) => {
            // 异步需要返回 Promise 对象
            const mobile =
              /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            return new Promise((resolve, reject) => {
              if (mobile.test(value)) {
                // 通过返回 resolve
                resolve(true);
              } else {
                // 不通过返回 reject(new Error('错误信息'))
                reject(new Error("请输入正确的联系电话"));
              }
            });
          },
        },
      ],
    },
    refundReason: {
      rules: [
        {
          required: true,
          errorMessage: "请输入退款原因",
        },
      ],
    },
  },
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
    http("POST", api.refund, formData).then(() => {
      uni.showToast({
        title: "申请已提交",
        icon: "none",
      });
      emit("callback");
      shows.value = false;
    });
  });
}
function open() {
  state.loding = true;
  formData.refundPrice = props.refund.totalPrice || 0;
  formData.orderId = props.refund.orderId || "";
  formData.refundPhone = props.refund.userPhone || "";
  formRef.value.setRules(state.rules);
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
