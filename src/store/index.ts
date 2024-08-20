import { Pinia, createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { userInfoStore } from "./modules/userInfo";
import { areaStore } from "./modules/area";
import { payGoodsStore } from "./modules/payGoods";
import { selectAreaStore } from "./modules/selectArea";
const pinia: Pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
export function useStore() {
  return {
    userInfo: userInfoStore(),
    area: areaStore(),
    payGoods: payGoodsStore(),
    selectArea: selectAreaStore(),
  };
}
export default pinia;
