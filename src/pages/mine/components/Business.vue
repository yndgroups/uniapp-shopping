<!-- <template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    :title="data.title"
    :mask="true"
  >
    <view class="business-box" :class="!data.content ? 'business-box1' : ''">
      <template v-if="data.content">
        <rich-text :nodes="data.content"></rich-text>
        <view class="btom-box">
          <uni-data-checkbox
            multiple
            v-model="state.checkbox"
            :localdata="state.hobby"
          ></uni-data-checkbox>
          <view class="but-box">
            <view class="quxiao" @click="cancel"> 取 消 </view>
            <view
              class="quedin"
              :class="
                state.date === 0 && state.checkbox.length ? '' : 'is-quedin'
              "
              @click="handleOk"
            >
              同 意
              <span v-if="state.date > 0">{{ state.date }}</span>
            </view>
          </view>
        </view>
      </template>
      <view v-else class="spinner-cycle-box">
        <uni-icons type="spinner-cycle" size="100"></uni-icons>
      </view>
    </view>
  </cn-popup>
</template>

<script lang="ts" setup>
import api from "@/serve/api";
import http from "@/serve/http";
import { reactive } from "vue";
import { computed, ref } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:show", "ok"]);
const state = reactive({
  checkbox: [],
  date: 0,
  hobby: [
    {
      text: "勾选则表示您已细致阅读并理解隐私协议的内容",
      value: 1,
    },
  ],
});
const shows = computed({
  get() {
    return props.show;
  },
  set(data) {
    emits("update:show", data);
  },
});
// getAgreement
let data = ref({
  content: "",
  title: "平台服务协议",
});
function open() {
  http("GET", api.getAgreement).then((res: any) => {
    // console.log(res.content)
    data.value = res;
  });
}
function close() {
  data.value = {
    content: "",
    title: "平台服务协议",
  };
  emits("update:show", false);
}

function handleOk() {
  if (state.checkbox.length && state.date === 0) {
    emits("ok");
  }
}
function cancel() {
  uni.showModal({
    title: "温馨提示",
    content: "将无法使用部分功能，确定继续吗？",
    success: function (res) {
      if (res.confirm) {
        shows.value = false;
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.business-box {
  height: 65vh;
  padding: 20rpx;
}
.business-box1 {
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
</style> -->

<template>
  <cn-popup
    v-model:show="shows"
    @open="open"
    @close="close"
    :title="data.title"
    :mask="true"
  >
    <view style="height: 70vh" class="content-box">
      <view v-if="data.content" v-html="data.content" class="content"></view>
      <view v-if="data.content" class="btom-box">
        <uni-data-checkbox
          multiple
          v-model="state.checkbox"
          :localdata="state.hobby"
        ></uni-data-checkbox>
        <view class="but-box">
          <view class="quxiao" @click="cancel"> 取 消 </view>
          <view
            class="quedin"
            :class="
              state.date === 0 && state.checkbox.length ? '' : 'is-quedin'
            "
            @click="handleOk"
          >
            同意并登录
            <span v-if="state.date > 0">{{ state.date }}</span>
          </view>
        </view>
      </view>
      <view v-else class="cycle-box">
        <view class="spinner-cycle-box">
          <uni-icons type="spinner-cycle" size="100"></uni-icons>
        </view>
      </view>
    </view>
  </cn-popup>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import api from "@/serve/api";
import http from "@/serve/http";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const state: any = reactive({
  date: 8,
  checkbox: [],
  hobby: [
    {
      text: "勾选则表示您已阅读、理解、同意隐私协议的内容",
      value: 1,
    },
  ],
  time: null,
});

let data = ref({
  content: "",
  title: "平台服务协议",
});
const emits = defineEmits(["update:show", "ok"]);

const shows = computed({
  get() {
    return props.show;
  },
  set(data: boolean) {
    emits("update:show", data);
  },
});

function open() {
  http("GET", api.getAgreement).then((res: any) => {
    // console.log(res.content)
    data.value = res;
    setTimes();
  });
}

function close() {
  state.date = 8;
  state.checkbox = [];
  emits("update:show", false);
  clearInterval(state.time);
  console.log(shows.value)
}

function setTimes() {
  state.time = setInterval(() => {
    if (state.date < 1) {
      clearInterval(state.time);
    } else {
      state.date -= 1;
    }
  }, 1000);
}
function handleOk() {
  if (state.checkbox.length && state.date === 0) {
    emits("ok");
  }
}
function cancel() {
  uni.showModal({
    title: "温馨提示",
    content: "将无法使用部分功能，确定继续吗？",
    success: function (res) {
      if (res.confirm) {
        shows.value = false;
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 200rpx);
  overflow-y: auto;
  line-height: 60rpx;
  padding-bottom: 60rpx;
}

.content-box {
  position: relative;
}

.btom-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 20rpx;
  background-color: #ffffff;
}

.but-box {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 50rpx;
  margin-top: 10rpx;

  .quxiao {
    flex: 1;
    border: 1rpx #d1d1d1 solid;
    border-radius: 10rpx;
    // height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    color: #999999;

    &:active {
      border: 1rpx #838383 solid;
    }
  }

  .quedin {
    flex: 1;
    background-color: #2273ff;
    border-radius: 10rpx;
    // height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    color: #ffffff;

    &:active {
      background-color: #2273ffbb;
    }
  }

  .is-quedin {
    border-radius: 10rpx;
    background-color: #2273ff93;
    color: #ffffffaf;
  }
}
.cycle-box {
  height: 70vh;
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
