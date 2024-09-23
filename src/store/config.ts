import Taro from "@tarojs/taro";

const config = {
  tt: {
    dev: {
      appid: "ttd8c0ae7d47f7595601",
      BASE_URL: "http://192.168.10.221:8821/api/dskafdsl/",
      // BASE_URL: "https://video.weiyantj.cn/api/LHGFgM3UNjEzUvP0/",
      WEB_VIEW: "https://6a6c-106-91-6-61.ngrok-free.app/api/"
      // WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
    test: {
      appid: "ttd8c0ae7d47f7595601",
      BASE_URL: "http://192.168.10.221:8821/api/dskafdsl/",
      // BASE_URL: "https://video.weiyantj.cn/api/LHGFgM3UNjEzUvP0/",
      WEB_VIEW: "https://6a6c-106-91-6-61.ngrok-free.app/api/"
      // WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
    prod: {
      appid: "ttd8c0ae7d47f7595601",
      BASE_URL: "http://192.168.10.221:8821/api/dskafdsl/",
      // BASE_URL: "https://video.weiyantj.cn/api/LHGFgM3UNjEzUvP0/",
      WEB_VIEW: "https://6a6c-106-91-6-61.ngrok-free.app/api/"
      // WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
  },
  wx: {
    dev: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "https://video.weiyantj.cn/api/7jj5DfGG/",
      WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
    test: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "https://video.weiyantj.cn/api/7jj5DfGG/",
      WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
    prod: {
      appid: "wx4fa1b29d25262470",
      BASE_URL: "https://video.weiyantj.cn/api/7jj5DfGG/",
      WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
  },
};
// 抖音小程序ENV
const GE = ()=>{
  let env = Taro.getEnv();
  if (env === "TT") return 'tt';
  if (env === "WEAPP") return 'wx';
}
let status = process.env.NODE_ENV === "development"?"dev":"prod";
export const env = config[GE()][status];

export const commonSetting = {
  coinName: '牛币'
}

