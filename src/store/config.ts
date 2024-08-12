import Taro from "@tarojs/taro";

const config = {
  wx: {
    dev: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.dev.videoshare.cn/api/7jj5DfGG/",
      WEB_VIEW: "http://www.dev.videoshare.cn/api/"
    },
    test: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.dev.videoshare.cn/api/7jj5DfGG/",
      WEB_VIEW: "http://www.dev.videoshare.cn/api/"
    },
    prod: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.dev.videoshare.cn/api/7jj5DfGG/",
      WEB_VIEW: "http://www.dev.videoshare.cn/api/"
    },
  },
  tt: {
    dev: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.dev.videoshare.cn/api/7jj5DfGG/",
      WEB_VIEW: "https://video.hbcyszw.cn/api/"
    },
    test: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.dev.videoshare.cn/api/7jj5DfGG/",
      WEB_VIEW: "https://video.hbcyszw.cn/api/"
    },
    prod: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "http://www.dev.videoshare.cn/api/7jj5DfGG/",
      WEB_VIEW: "https://video.hbcyszw.cn/api/"
    },
  },
};
// 抖音小程序
export const env = config["wx"]["dev"];
