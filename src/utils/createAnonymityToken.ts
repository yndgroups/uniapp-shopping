import api from "@/serve/api";
export async function createAnonymityToken() {
  console.log("创建匿名token");
  return await uni.request({
    url: api.createAnonymityToken + import.meta.env.VITE_APP_APPID,
  });
}
