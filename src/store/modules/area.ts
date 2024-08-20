import { defineStore } from 'pinia';

export const areaStore = defineStore('area', {
  state() {
    return {
      areaName: "",
      areaCode: "",
      areaType: 1,
      chidring: [{ areaCode: "", areaName: "", areaType: 1 }],
    };
  },
});
