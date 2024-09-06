import Taro from "@tarojs/taro";

const config = {
  wx: {
    dev: {
      appid: "wx00068c582abf3769",
      BASE_URL: "http://www.videoshare.pctop.cc/api/2hkLBfsk/",
      WEB_VIEW: "http://www.videoshare.pctop.cc/api/"
    },
    test: {
      appid: "wx00068c582abf3769",
      BASE_URL: "http://www.videoshare.pctop.cc/api/2hkLBfsk/",
      WEB_VIEW: "http://www.videoshare.pctop.cc/api/"
    },
    prod: {
      appid: "wx00068c582abf3769",
      BASE_URL: "http://www.videoshare.pctop.cc/api/2hkLBfsk/",
      WEB_VIEW: "http://www.videoshare.pctop.cc/api/"
    },
  },
};
// 抖音小程序
export const env = config["wx"]["dev"];

export const commonSetting = {
  coinName: '牛币'
}
