<template>
  <view
    :style="{ borderRadius: radius, width: width, height: height, ...options }"
    class="image-box"
  >
    <image
      :src="getImgUrlHost(src)"
      @click="large && Large()"
      :mode="mode"
      :style="{ width: '100%', height: '100%', borderRadius: radius }"
      lazy-load
    />
  </view>
</template>
<script setup lang="ts">
import api from "@/serve/api";
const props = defineProps({
  src: { type: String, required: true, default: "" },
  mode: { type: String, default: "heightFix" },
  lazyLoad: { type: Boolean, default: false },
  fadeShow: { type: Boolean, default: true },
  width: { type: String, default: "100%" },
  height: { type: String, default: "100%" },
  large: { type: Boolean }, //是否开启预览
  radius: { type: String, default: "10rpx" },
  options: { type: Object as () => any, default: {} },
  previews: {
    type: Object,
    default: {
      urls: [],
      current: 0,
      indicator: "number",
      loop: true,
    },
  },
});
function Large() {
  props.previews.urls = props.previews.urls.map((item: any) => {
    return getImgUrlHost(item);
  });
  if (!props.previews.urls.length) {
    props.previews.urls[0] = getImgUrlHost(props.src);
  }
  props.previews.current = props.previews.urls.indexOf(
    getImgUrlHost(props.src)
  );
  uni.previewImage({
    urls: [],
    ...props.previews,
  });
}
function getImgUrlHost(url: string) {
  if (url.includes("https://") || url.includes("http://")) {
    return url;
  } else {
    return api.imageViewHost + url;
  }
}
</script>

<style lang="scss" scoped>
.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
