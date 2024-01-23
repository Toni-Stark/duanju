import Taro from "@tarojs/taro";

const config = {
  wx: {
    dev: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "https://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
    },
    test: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "https://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
    },
    prod: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "https://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
    },
  },
  tt: {
    dev: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "http://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
    },
    test: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "http://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
    },
    prod: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "http://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
    },
  },
};
// 微信小程序
// export const env = envConf[Taro.getAccountInfoSync().miniProgram.envVersion];
// 抖音小程序
export const env = config["wx"]["dev"];
