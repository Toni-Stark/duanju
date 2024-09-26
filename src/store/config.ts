import Taro from "@tarojs/taro";

const config = {
  tt: {
    dev: {
      appid: "tta19ad7273eae33dd01",
      BASE_URL: "https://niubojc.com/api/OUsfvUNWzIADyGmH/",
      // BASE_URL: "https://video.weiyantj.cn/api/LHGFgM3UNjEzUvP0/",
      WEB_VIEW: "https://niubojc.com/api/"
      // WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
    test: {
      appid: "tta19ad7273eae33dd01",
      BASE_URL: "https://niubojc.com/api/OUsfvUNWzIADyGmH/",
      // BASE_URL: "https://video.weiyantj.cn/api/LHGFgM3UNjEzUvP0/",
      WEB_VIEW: "https://niubojc.com/api/"
      // WEB_VIEW: "https://video.weiyantj.cn/api/"
    },
    prod: {
      appid: "tta19ad7273eae33dd01",
      BASE_URL: "https://niubojc.com/api/OUsfvUNWzIADyGmH/",
      // BASE_URL: "https://video.weiyantj.cn/api/LHGFgM3UNjEzUvP0/",
      WEB_VIEW: "https://niubojc.com/api/"
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

