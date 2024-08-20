<template>
  <web-view
    :src="urls"
    :update-title="false"
    @message="handleMessage"
    class="web-view-box"
  />
</template>

<script lang="ts" setup>
import { onLoad, onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
const urls = ref("");

function handleMessage(event: any) {
  if (event.detail.data[0].isClose) {
    uni.switchTab({ url: "/pages/mine/index" });
  }
}
onLoad(({ url }: any) => {
  urls.value = url || "";
});
onReady(() => {
  uni.setNavigationBarColor({
    backgroundColor: "#ffffff",
    frontColor: "#000000",
  });
});
</script>

<style lang="scss" scoped>
.web-view-box {
  width: 100%;
  height: 100vh;
}
</style>
