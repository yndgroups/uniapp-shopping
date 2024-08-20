import { defineStore } from "pinia";

export const selectAreaStore = defineStore("selectArea", {
  state() {
    return {
      selectArea: uni.getStorageSync("selectArea"),
    };
  },
  actions: {
    setSelect(data: any) {
      uni.setStorageSync("selectArea", data);
      this.selectArea = data;
    },
    getSelect() {
      return this.selectArea;
    },
  },
});
