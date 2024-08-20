// import api from '@/serve/apis'
// import { postJSON } from '@/serve/http'

// // trade_type  交易类型(1:余额 2:微信  3:支付宝)pay_type  支付类型(1:微信公众号 2:微信小程序 3:支付宝支付

// declare let WeixinJSBridge: any
// let documents: any = document
// export function payOrder(data: any, tradeType: number) {
//   let payType = 2 //微信小程序
//   // #ifdef H5
//   payType = 1 // 公众号H5
//   // #endif
//   postJSON(api.payOrder, {
//     data: {
//       orderId: data.orderNo,
//       payType: payType,
//       tradeType: tradeType,
//       payMark: data.payMark,
//     },
//   }).then((data: any) => {
//     uni.showLoading({ title: '正在发起支付' })
//     // #ifdef H5
//     webPay(data)
//     // #endif
//     // #ifdef MP-WEIXIN
//     wechat(data)
//     // #endif
//   })

//   // H5支付
//   function webPay(data: any) {
//     if (typeof WeixinJSBridge === 'undefined') {
//       if (documents.addEventListener) {
//         documents.addEventListener('WeixinJSBridgeReady', onBridgeReady(data), false)
//         onBridgeReady(data)
//       } else if (documents.attachEvent) {
//         documents.attachEvent('WeixinJSBridgeReady', onBridgeReady(data))
//         documents.attachEvent('onWeixinJSBridgeReady', onBridgeReady(data))
//         onBridgeReady(data)
//       }
//     } else {
//       onBridgeReady(data)
//     }
//   }

//   // 支付结果
//   function onBridgeReady(payData: any) {
//     WeixinJSBridge.invoke('getBrandWCPayRequest', payData, function (res: any) {
//       if (res.err_msg == 'get_brand_wcpay_request:ok') {
//         uni.hideLoading()
//         uni.reLaunch({ url: '/pages/success/index' })
//       } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
//         uni.hideLoading()
//         alert('已取消支付')
//       } else {
//         uni.hideLoading()
//         alert('支付失败')
//       }
//     })
//   }

//   // 小程序支付
//   function wechat(data: any) {
//     uni.requestPayment(<any>{
//       provider: 'wxpay',
//       ...data,
//       success(res: any) {
//         uni.showToast({ title: '支付成功' })
//         uni.reLaunch({ url: '/pages/success/index' })
//       },
//       fail(e: any) {
//         uni.showToast({ title: '支付失败', icon: 'error', duration: 1300 })
//       },
//       complete() {
//         setTimeout(() => {
//           uni.hideLoading()
//         }, 1300)
//       },
//     })
//   }
// }

// export default { payOrder }

import api from "@/serve/api";
import http from "@/serve/http";

declare let WeixinJSBridge: any;
let documents: any = document;
export function payOrder(prepay_id: any) {
  // let payType = 1;
  // #ifdef H5
  // payType = 3;
  // #endif
  http("POST", api.payOrder + `${prepay_id}`).then((data: any) => {
    uni.showLoading({ title: "正在发起支付" });
    // #ifdef H5
    webPay(data);
    // #endif
    // #ifdef MP-WEIXIN
    wechat(data);
    // #endif
  });

  // H5支付
  function webPay(data: any) {
    if (typeof WeixinJSBridge === "undefined") {
      if (documents.addEventListener) {
        documents.addEventListener(
          "WeixinJSBridgeReady",
          onBridgeReady(data),
          false
        );
        onBridgeReady(data);
      } else if (documents.attachEvent) {
        documents.attachEvent("WeixinJSBridgeReady", onBridgeReady(data));
        documents.attachEvent("onWeixinJSBridgeReady", onBridgeReady(data));
        onBridgeReady(data);
      }
    } else {
      onBridgeReady(data);
    }
  }

  function onBridgeReady(payData: any) {
    WeixinJSBridge.invoke("getBrandWCPayRequest", payData, function (res: any) {
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        uni.hideLoading();
        uni.reLaunch({ url: "/pages/success/index" });
      } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
        uni.hideLoading();
        alert("已取消支付");
      } else {
        uni.hideLoading();
        alert("支付失败");
      }
    });
  }

  // 小程序支付

  function wechat(data: any) {
    uni.requestPayment(<any>{
      provider: "wxpay",
      ...data,
      success(res: any) {
        uni.showToast({ title: "支付成功" });
        uni.reLaunch({ url: "/pages/success/index" });
      },
      fail(e: any) {
        uni.showToast({ title: "支付失败", icon: "error", duration: 1300 });
      },
      complete() {
        setTimeout(() => {
          uni.hideLoading();
        }, 1300);
      },
    });
  }
}

export default { payOrder };
