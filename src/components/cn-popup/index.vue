<template>
  <uni-popup
    ref="popup"
    :type="type"
    :is-mask-click="mask"
    @maskClick="close"
    :safe-area="false"
  >
    <view
      class="popup"
      :style="{ '--radius': radius, '--height': height, '--bg': bg }"
      :class="safeArea ? 'safeArea' : ''"
    >
      <view class="title">
        {{ title }}
      </view>
      <view class="popup-content">
        <slot></slot>
      </view>
    </view>
  </uni-popup>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props: any = defineProps({
  type: {
    type: String,
    default: 'bottom',
  },
  show: {
    type: Boolean,
    default: false,
  },
  safeArea: {
    type: Boolean,
    default: true,
  },
  radius: {
    type: String,
    default: '20rpx',
  },
  height: {
    type: String,
    default: 'auto',
  },
  title: {
    type: String,
    default: '',
  },
  bg: {
    type: String,
    default: '#ffffff',
  },
  mask: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:show', 'open', 'close'])
const popup: any = ref(null)
watch(
  () => props.show,
  val => {
    val ? (popup.value.open(props.type), emit('open')) : (popup.value.close(), emit('update:show', false), emit('close'))
  },
)
const close = () => {
  if (props.mask) {
    emit('update:show', false)
  } else {
    return
  }
}
</script>

<style lang="scss" scoped>
.popup {
  background: var(--bg);
  border-top-right-radius: var(--radius);
  border-top-left-radius: var(--radius);
  height: var(--height);
  padding: 20rpx 20rpx;
}

.popup-content {
  height: calc(100% - 30rpx);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.safeArea {
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
}

.title {
  color: #6e6e6e;
  text-align: center;
  padding: 10rpx 0 20rpx 0;
}
</style>
