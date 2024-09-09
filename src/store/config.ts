import Taro from "@tarojs/taro";

const config = {
  wx: {
    dev: {
      appid: "wx00068c582abf3769",
      BASE_URL: "https://niubojc.com/api/bSEjdA13/",
      WEB_VIEW: "https://niubojc.com/api/"
    },
    test: {
        appid: "wx00068c582abf3769",
      BASE_URL: "https://niubojc.com/api/bSEjdA13/",
      WEB_VIEW: "https://niubojc.com/api/"
    },
    prod: {
      appid: "wx00068c582abf3769",
      BASE_URL: "https://niubojc.com/api/bSEjdA13/",
      WEB_VIEW: "https://niubojc.com/api/"
    },
  },
};
// 抖音小程序
export const env = config["wx"]["dev"];

export const commonSetting = {
  coinName: '牛币'
}
