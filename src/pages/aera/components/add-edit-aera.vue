<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    :title="type === 1 ? '新增' : type === 2 ? '修改' : '详情'"
    :mask="true"
  >
    <uni-forms
      ref="from"
      :rules="rules"
      v-model="state.formData"
      label-width="80px"
    >
      <uni-forms-item label="姓名" required name="realName">
        <uni-easyinput
          v-model="state.formData.realName"
          placeholder="请输入收货人姓名"
        />
      </uni-forms-item>
      <uni-forms-item label="联系电话" required name="phone">
        <uni-easyinput
          v-model="state.formData.phone"
          placeholder="请输入收货人手机号"
          type="number"
        />
      </uni-forms-item>
      <uni-forms-item label="地区" required name="areaCode">
        <uni-data-picker
          v-model="state.formData.areaCode"
          @change="handelCode"
          :localdata="state.list"
          popup-title="请选择地区"
          :map="{ text: 'areaName', value: 'areaCode' }"
        />
      </uni-forms-item>
      <uni-forms-item label="详细地址" required name="detail">
        <uni-easyinput
          v-model="state.formData.detail"
          placeholder="请输入详细地址"
        />
      </uni-forms-item>
      <uni-forms-item label="邮政编码" name="postCode">
        <uni-easyinput
          v-model="state.formData.postCode"
          placeholder="请输入邮政编码"
          type="number"
        />
      </uni-forms-item>
      <uni-forms-item label="默认地址" name="isDefault">
        <switch
          :checked="state.formData.isDefault === 1"
          @change="changeSwitch"
        />
      </uni-forms-item>
    </uni-forms>
    <view class="button-boxs">
      <button type="primary" plain @click="close" :disabled="type === 3">
        重 置
      </button>
      <button type="primary" @click="submit()" :disabled="type === 3">
        提 交
      </button>
    </view>
  </cn-popup>
</template>

<script setup lang="ts">
import http from "@/serve/http";
import { computed, reactive, watch, ref } from "vue";
import { treeFilter } from "@/utils/treeFilter";
import api from "@/serve/api";
let from = ref();
let Data = {
  addressId: "",
  areaCode: "",
  detail: "",
  isDefault: 0,
  phone: "",
  postCode: "",
  realName: "",
  //
  areaName: "", //辅助属性
};
const props: any = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Number,
    default: 1,
  },
  row: {
    type: Object,
    default: {},
  },
  getData: {
    type: Function,
    default: () => {},
  },
});
const emit = defineEmits(["update:show"]);
const shows = computed({
  get() {
    return props.show;
  },
  set(data) {
    emit("update:show", data);
  },
});
const state: any = reactive({
  list: [],
  formData: {
    ...Data,
  },
  areaName: "",
});
const rules = {
  realName: {
    rules: [
      {
        required: true,
        errorMessage: "请输入收货人姓名",
      },
    ],
  },
  phone: {
    rules: [
      {
        required: true,
        errorMessage: "请输入联系电话",
      },
      {
        pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        errorMessage: "请输入正确格式的手机号",
      },
    ],
  },
  areaCode: {
    rules: [
      {
        required: true,
        errorMessage: "请选择地区",
      },
    ],
  },
  detail: {
    rules: [
      {
        required: true,
        errorMessage: "请输入详细地址",
      },
    ],
  },
};
function getList() {
  let AeraList: any[] = uni.getStorageSync("AeraList");
  if (AeraList.length) {
    state.list = AeraList || [];
  } else {
    http("GET", api.getAeraList).then((res: any) => {
      uni.setStorageSync("AeraList", res);
      state.list = res || [];
    });
  }
}
function changeSwitch({ detail }: any) {
  if (detail.value) {
    state.formData.isDefault = 1;
  } else {
    state.formData.isDefault = 0;
  }
}
function handelCode({ detail }: any) {
  state.areaName = detail.value
    .map((item: any) => {
      return item.text || "";
    })
    .join("/");
}
function submit() {
  from.value
    .validate()
    .then(() => {
      let detail = state.areaName.split("/").join("") + state.formData.detail;
      http(props.type === 1 ? "POST" : "PUT", api.addUserAera, {
        ...state.formData,
        detail: detail,
      }).then(() => {
        uni.showToast({
          duration: 1000,
          title: props.type === 1 ? "新增成功" : "修改成功",
        });
        setTimeout(() => {
          emit("update:show", false);
        }, 600);
        props.getData();
      });
    })
    .catch(() => {});
}
watch(
  () => state.list,
  (val) => {
    if (props.type !== 1) {
      let list = treeFilter(
        val,
        (item: any) => item.areaCode && item.areaCode === props.row.areaCode,
        { text: "children" }
      );
      charAeraName(list);
    }
  }
);
function open() {
  getList();
  if (props.type !== 1) {
    for (let key in props.row) {
      if (key !== "noteType") {
        state.formData[key] = props.row[key];
      }
    }
  }
}
function close() {
  state.formData = { ...Data };
}
function charAeraName(list: any[]) {
  let names: string[] = [];
  function deep(Arr: any[]) {
    Arr.forEach((item: any) => {
      names.push(item.areaName);
      if (item.children) {
        deep(item.children);
      }
    });
  }
  deep(list);

  let keyName = names.join("");
  state.areaName = names.join("/");
  state.formData.detail = state.formData.detail.replace(keyName, "");
  console.log(state.formData.detail, keyName, "8888");
}
</script>

<style lang="scss" scoped>
.button-boxs {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 40rpx;

  button {
    width: 40%;
  }
}

.title {
  padding: 40rpx 0;
  text-align: center;
  color: #929292;
}
</style>
