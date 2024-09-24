import Taro from "@tarojs/taro";

const config = {
  // wx: {
  //   dev: {
  //     appid: "wx4fa1b29d25262470",
  //     BASE_URL: "https://video.weiyantj.cn/api/7jj5DfGG/",
  //     WEB_VIEW: "https://video.weiyantj.cn/api/"
  //   },
  //   test: {
  //     appid: "wx4fa1b29d25262470",
  //     BASE_URL: "https://video.weiyantj.cn/api/7jj5DfGG/",
  //     WEB_VIEW: "https://video.weiyantj.cn/api/"
  //   },
  //   prod: {
  //     appid: "wx4fa1b29d25262470",
  //     BASE_URL: "https://video.weiyantj.cn/api/7jj5DfGG/",
  //     WEB_VIEW: "https://video.weiyantj.cn/api/"
  //   },
  // },
  wx: {
    dev: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.videoshare.pctop.cc/api/2hkLBfsk/",
      WEB_VIEW: "http://www.videoshare.pctop.cc/api/"
    },
    test: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.videoshare.pctop.cc/api/2hkLBfsk/",
      WEB_VIEW: "http://www.videoshare.pctop.cc/api/"
    },
    prod: {
      appid: "wx4fa1b29d25262470",
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
