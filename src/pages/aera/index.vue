<template>
  <cn-layout head="地址管理" full hBgColor="#fff" titleColor="#7A7E83">
    <cn-null v-if="!state.list.length"></cn-null>

    <radio-group v-else class="content-box" @change="handelSelect">
      <uni-card v-for="(item, index) in state.list" :key="index">
        <view class="uni-body">
          <radio
            :value="JSON.stringify(item)"
            :checked="item.isDefault === 1"
            color="#2979ff"
          />
          <view class="info-box">
            <view class="name-box">
              <text>{{ item.realName }} {{ item.phone }}</text>
              <uni-tag text="默认" type="error" v-if="item.isDefault === 1" />
            </view>
            <view class="area">{{ item.detail }}</view>
          </view>
        </view>
        <template #actions>
          <view class="card-actions">
            <button
              type="primary"
              size="mini"
              plain
              @click="(state.type = 2), (state.row = item), (state.show = true)"
            >
              编 辑
            </button>
            <button
              type="primary"
              size="mini"
              plain
              @click="(state.type = 3), (state.row = item), (state.show = true)"
            >
              详 情
            </button>
            <button
              type="warn"
              size="mini"
              plain
              @click="delUserAddress(item.addressId)"
            >
              删 除
            </button>
          </view>
        </template>
      </uni-card>
    </radio-group>
    <view class="uni-goods-nav-box">
      <cn-goods-nav
        :options="[]"
        :fill="true"
        :button-group="buttonGroup"
        @buttonClick="buttonClick"
      />
    </view>
    <addEditAera
      v-model:show="state.show"
      :type="state.type"
      :row="state.row"
      :getData="getAeraList"
    />
  </cn-layout>
</template>

<script setup lang="ts">
import {  onShow } from "@dcloudio/uni-app";
import { computed, reactive, watch } from "vue";
import addEditAera from "./components/add-edit-aera.vue";
import http from "@/serve/http";
import { useStore } from "@/store";
import api from "@/serve/api";
import { ref } from "vue";
const store = useStore();
const state: any = reactive({
  checked: false,
  show: false,
  type: 1,
  row: {},
  list: [],
  select: {},
});
const pageInfo = reactive({
  pageIndex: 1,
  pageSize: 10,
  params: { orderNo: "", phone: "" },
});
watch(
  () => state.list,
  (val: any) => {
    if (!val.length) {
      state.select = {};
    } else {
      if (state.select && state.select.addressId) {
        let list: any[] = val.filter((item: any) => {
          return item.addressId === state.select.addressId;
        });
        if (!list.length && !list[0].addressId === state.select) {
          state.select = {};
        }
      }
    }
  }
);
const buttonGroup = computed(() => {
  return state.select && state.select.addressId
    ? [
        {
          text: "保 存",
          backgroundColor: "linear-gradient(90deg, #FFCD1E, #FF8A18)",
          color: "#fff",
        },
        {
          text: "新 增",
          backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
          color: "#fff",
        },
      ]
    : [
        {
          text: "新 增",
          backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
          color: "#fff",
        },
      ];
});
function buttonClick(res: any) {
  if (state.select && state.select.addressId ? res.index : res.index === 0) {
    state.type = 1;
    state.show = true;
  } else {
    // store.commit("setSelect", state.select);
    store.selectArea.setSelect(state.select)
    uni.showToast({
      title: "保存成功",
      duration: 1000,
      success() {
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 900);
      },
    });
  }
}
function getAeraList() {
  state.list = [];

  // let obj = store.getters["getSelect"] || {};
  let obj: any = {};

  http("POST", api.getUserAddress, pageInfo).then((res: any) => {
    if (obj && obj.addressId) {
      res.list.forEach((item: any) => {
        if (item.addressId === obj.addressId) {
          item.isDefault = 1;
          state.select = item;
        } else {
          item.isDefault = 0;
        }
      });
    } else {
      let arr = res.list.filter((item: any) => {
        return item.isDefault === 1;
      });
      state.select = arr[0];
    }
    state.list = res.list || [];
  });
}
function delUserAddress(id: string) {
  uni.showModal({
    title: "提示",
    content: "您将要删除这条数据，是否继续？",
    success: function (res) {
      if (res.confirm) {
        let ids = [id];
        http("DELETE", api.addUserAera, ids).then(() => {
          uni.showToast({
            title: "删除成功",
            duration: 1000,
          });
          getAeraList();
        });
      }
    },
  });
}
function handelSelect({ detail }: any) {
  state.select = JSON.parse(detail.value || "");
}
onShow(() => {
  getAeraList();
});
</script>

<style lang="scss" scoped>
.uni-goods-nav-box {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
}

.content-box {
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;

  .card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-top: 2rpx #e6e6e6 solid;
  }

  .uni-body {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .info-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 32rpx;
      color: #7e7e7e;
      padding-left: 20rpx;

      .name-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .area {
        font-size: 30rpx;
        color: #7e7e7e;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden; //溢出内容隐藏
        text-overflow: ellipsis; //文本溢出部分用省略号表示
        display: -webkit-box; //特别显示模式
        -webkit-line-clamp: 2; //行数
        line-clamp: 2;
        -webkit-box-orient: vertical; //盒子中内容竖直排列
        line-height: 50rpx;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
