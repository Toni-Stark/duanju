const config = {
  wx: {
    dev: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "https://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
      // BASE_URL: "https://video.test.jixuejima.com/api/dskafdsl/",

    },
    test: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "https://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
      // BASE_URL: "https://video.test.jixuejima.com/api/dskafdsl/",
    },
    prod: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "https://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
      // BASE_URL: "https://video.test.jixuejima.com/api/dskafdsl/",
    },
  },
  tt: {
    dev: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "http://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
      // BASE_URL: "https://video.test.jixuejima.com/api/dskafdsl/",
    },
    test: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "http://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
      // BASE_URL: "https://video.test.jixuejima.com/api/dskafdsl/",
    },
    prod: {
      appid: "wx529fadf983b0b19e",
      BASE_URL: "http://video.hbcyszw.cn/api/axRb5g1ZQNjlqpBM/",
      // BASE_URL: "https://video.test.jixuejima.com/api/dskafdsl/",
    },
  },
};
// 抖音小程序
export const env = config["wx"]["dev"];
