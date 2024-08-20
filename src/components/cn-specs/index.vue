<template>
  <uni-popup ref="popup" :type="type" @maskClick="close" :safe-area="safearea">
    <view class="popup-content">
      <view class="contents">
        <view class="title">{{ state.title }}</view>
        <uni-section
          :title="`规格分离  ( ${list.length || 0} ) `"
          type="line"
          class="titles"
        />
        <view class="item-box">
          <view
            class="item"
            v-for="(item, index) in list"
            :key="index"
            :class="item.skuId === value.skuId && 'active'"
            @click="
              item.skuId === value.skuId
                ? (value = { num: value.num })
                : (value = item)
            "
          >
            <view class="img" @click.stop>
              <cn-img :src="item.image" width="100%" height="100%" mode="" large/>
            </view>
            <view class="name-box">
              <view class="name">{{ item.skuName }}</view>
              <view class="price">
                <text class="fh">¥</text>
                {{ item.price }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="uni-goods-nav-box">
        <cn-goods-nav
          :button-group="state.buttonGroup"
          :fill="true"
          @buttonClick="buttonClick"
        >
          <view class="number-box">
            <text class="number-box-label">数量：</text>
            <uni-number-box v-model="value.num" :min="1" :max="1000" />
          </view>
        </cn-goods-nav>
      </view>
    </view>
  </uni-popup>
</template>
<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
const props: any = defineProps({
  modelValue: {
    type: Object as () => any,
    default: { productId: "", num: 1 },
  },
  type: {
    type: String,
    default: "bottom",
  },
  show: {
    type: Boolean,
    default: false,
  },
  safearea: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array as () => any,
    default: [],
  },
});
const emit = defineEmits([
  "update:show",
  "update:modelValue",
  "addCard",
  "pay",
]);
const value: any = computed({
  get() {
    return props.modelValue;
  },
  set(data) {
    emit("update:modelValue", { ...data, num: props.modelValue.num });
  },
});
const state = reactive({
  itemData: {
    ...props.modelValue,
  },
  buttonGroup: [
    {
      text: "加入购物车",
      backgroundColor: "linear-gradient(90deg, #FFCD1E, #FF8A18)",
      color: "#fff",
    },
    {
      text: "立即购买",
      backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
      color: "#fff",
    },
  ],
  title: "请选择规格",
});

const popup: any = ref(null);
watch(
  () => props.show,
  (val) => {
    val
      ? popup.value.open(props.type)
      : (popup.value.close(), emit("update:show", false));
  }
);
const close = () => {
  emit("update:show", false);
};
function buttonClick(res: any) {
  if (res.index) {
    emit("pay");
  } else {
    emit("addCard");
  }
}
</script>

<style lang="scss" scoped>
.popup-content {
  height: 60vh;
  background: #fff;
  border-top-right-radius: 20rpx;
  border-top-left-radius: 20rpx;
  padding: 20rpx;

  .uni-goods-nav-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    left: 0;
    right: 0;

    .number-box {
      padding-right: 10rpx;
      display: flex;
      align-items: center;

      .number-box-label {
        color: #0108187c;
        font-size: 28rpx;
      }
    }
  }

  .contents {
    width: 100%;
    height: calc(100% - 200rpx);

    .title {
      text-align: center;
      line-height: 60rpx;
      background: #fff;
    }

    .item-box {
      height: calc(100% - 80rpx);
      box-sizing: border-box;
      background: #ececec;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20rpx;
      display: flex;
      flex-direction: column;

      .item {
        padding: 20rpx;
        background: #ffffff;
        position: relative;
        border-radius: 10rpx;
        display: flex;
        margin-bottom: 20rpx;
        border: 2rpx #fff solid;
      }

      .name-box {
        width: calc(100% - 160rpx);
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          padding-bottom: 20rpx;
          font-size: 28rpx;
        }

        .price {
          color: #ff0000;
          font-weight: bold;
        }
      }

      .img {
        width: 230rpx;
        height: 160rpx;
      }

      .active {
        background-color: #ffe6e6;
        border: 2rpx #ffa0a0 solid;
      }
    }
  }
}
</style>
