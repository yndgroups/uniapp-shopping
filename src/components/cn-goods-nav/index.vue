<template>
  <slot name="head"></slot>
  <view class="uni-goods-nav">
    <!-- 底部占位 -->
    <!-- <view class="uni-tab__seat" /> -->
    <view class="uni-tab__cart-box flex">
      <view class="flex uni-tab__cart-sub-left">
        <slot>
          <template
            v-for="(item, index) in options"
            :key="index"
          >
            <button
              v-if="item.contact"
              @contact="contact"
              open-type="contact"
              show-message-card
              :send-message-img="item.sendMessageImg"
              :send-message-path="item.sendMessagePath"
              :session-from="item.sessionFrom"
              :send-message-title="item.sendMessageTitle"
              class="contact-box uni-tab__shop-cart flex uni-tab__cart-button-left uni-tab__shop-cart"
              plain
            >
              <uni-icons
                class="icons"
                :type="item.icon"
                size="20"
                color="#646566"
              ></uni-icons>
              <text class="uni-tab__text">{{ item.text }}</text>
              <view class="flex uni-tab__dot-box">
                <text
                  v-if="item.info"
                  :class="{ 'uni-tab__dots': item.info > 9 }"
                  class="uni-tab__dot"
                  :style="{
                    backgroundColor: item.infoBackgroundColor ? item.infoBackgroundColor : '#ff0000',
                    color: item.infoColor ? item.infoColor : '#fff',
                  }"
                >
                  {{ item.info }}
                </text>
              </view>
            </button>
            <view
              v-else
              class="flex uni-tab__cart-button-left uni-tab__shop-cart"
              @click="onClick(index, item)"
            >
              <view class="uni-tab__icon">
                <uni-icons
                  :type="item.icon"
                  size="20"
                  color="#646566"
                ></uni-icons>
                <!-- <image class="image" :src="item.icon" mode="widthFix" /> -->
              </view>
              <text class="uni-tab__text">{{ item.text }}</text>
              <view class="flex uni-tab__dot-box">
                <text
                  v-if="item.info"
                  :class="{ 'uni-tab__dots': item.info > 9 }"
                  class="uni-tab__dot"
                  :style="{
                    backgroundColor: item.infoBackgroundColor ? item.infoBackgroundColor : '#ff0000',
                    color: item.infoColor ? item.infoColor : '#fff',
                  }"
                >
                  {{ item.info }}
                </text>
              </view>
            </view>
          </template>
        </slot>
      </view>
      <view
        :class="{ 'uni-tab__right': fill }"
        class="flex uni-tab__cart-sub-right"
      >
        <view
          v-for="(item, index) in buttonGroup"
          :key="index"
          :style="{ background: item.backgroundColor, color: item.color }"
          class="flex uni-tab__cart-button-right"
          @click="buttonClick(index, item)"
        >
          <text
            :style="{ color: item.color }"
            class="uni-tab__cart-button-right-text"
          >
            {{ item.text }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { initVueI18n } from '@dcloudio/uni-i18n'
import messages from './i18n/index.js'
const { t } = initVueI18n(messages)
/**
 * GoodsNav 商品导航
 * @description 商品加入购物车、立即购买等
 * @tutorial https://ext.dcloud.net.cn/plugin?id=865
 * @property {Array} options 组件参数
 * @property {Array} buttonGroup 组件按钮组参数
 * @property {Boolean} fill = [true | false] 组件按钮组参数
 * @property {Boolean} stat 是否开启统计功能
 * @event {Function} click 左侧点击事件
 * @event {Function} buttonClick 右侧按钮组点击事件
 * @example <uni-goods-nav :fill="true"  options="" buttonGroup="buttonGroup"  @click="" @buttonClick="" />
 */
export default {
  name: 'UniGoodsNav',
  emits: ['click', 'buttonClick'],
  props: {
    options: {
      type: Array,
      default() {
        return [
          {
            icon: 'shop',
            text: t('uni-goods-nav.options.shop'),
          },
          {
            icon: 'cart',
            text: t('uni-goods-nav.options.cart'),
          },
        ]
      },
    },
    buttonGroup: {
      type: Array,
      default() {
        return [
          {
            text: t('uni-goods-nav.buttonGroup.addToCart'),
            backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
            color: '#fff',
          },
          {
            text: t('uni-goods-nav.buttonGroup.buyNow'),
            backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
            color: '#fff',
          },
        ]
      },
    },
    fill: {
      type: Boolean,
      default: false,
    },
    stat: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    contact(res) {
      this.$emit('contact', res)
    },
    onClick(index, item) {
      this.$emit('click', {
        index,
        content: item,
      })
    },
    buttonClick(index, item) {
      if (uni.report && this.stat) {
        uni.report(item.text, item.text)
      }
      this.$emit('buttonClick', {
        index,
        content: item,
      })
    },
  },
}
</script>

<style lang="scss">
.flex {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.uni-goods-nav {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: row;
}

.uni-tab__cart-box {
  flex: 1;
  height: 50px;
  background-color: #fff;
  z-index: 900;
}

.uni-tab__cart-sub-left {
  padding: 0 5px;
}

.uni-tab__cart-sub-right {
  flex: 1;
}

.uni-tab__right {
  margin: 5px 0;
  margin-right: 10px;
  border-radius: 100px;
  overflow: hidden;
}

.uni-tab__cart-button-left {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  // flex: 1;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 10px;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-tab__icon {
  width: 18px;
  height: 18px;
}

.image {
  width: 18px;
  height: 18px;
}

.uni-tab__text {
  margin-top: 3px;
  font-size: 12px;
  color: #646566;
}

.uni-tab__cart-button-right {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  flex: 1;
  justify-content: center;
  align-items: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-tab__cart-button-right-text {
  font-size: 14px;
  color: #fff;
}

.uni-tab__cart-button-right:active {
  opacity: 0.7;
}

.uni-tab__dot-box {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  position: absolute;
  right: -2px;
  top: 2px;
  justify-content: center;
  align-items: center;
  // width: 0;
  // height: 0;
}

.uni-tab__dot {
  // width: 30rpx;
  // height: 30rpx;
  padding: 0 4px;
  line-height: 15px;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  background-color: #ff0000;
  border-radius: 15px;
}

.uni-tab__dots {
  padding: 0 4px;
  // width: auto;
  border-radius: 15px;
}

.contact-box {
  height: 100rpx;
  border: 0 !important;
  line-height: 0 !important;
  text-align: initial !important;
  display: flex;
  position: relative !important;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  font-size: 24rpx;
  border-radius: 0;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin: 0 20rpx;
  text-decoration: dotted;
  box-sizing: initial;
  overflow: initial;

  .uni-tab__text {
    margin-top: 4rpx;
  }

  .icons {
    margin-top: 5rpx !important;
  }
}
</style>
