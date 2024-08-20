import { defineStore } from "pinia";

export const payGoodsStore = defineStore("payGoods", {
  state() {
    return {
      payList: [],
    };
  },
  actions: {
    setPayList(data: any) {
      this.payList = data;
    },
    getPayList() {
      return this.payList;
    },
  },
});
