export default defineAppConfig({
  __usePrivacyCheck__: true,
  pages: [
    "pages/index/index",
    "pages/index/cate/index",
    "pages/index/hot/index",
    "pages/index/new/index",
    "pages/index/popular/index",
    "pages/index/search/index",
    "pages/list/index",
    "pages/mine/index",
    "pages/mine/wallet/index",
    "pages/mine/wallet/recharge/index",
    "pages/mine/code/index",
    "pages/mine/hobby/index",
    "pages/mine/system/index",
    "pages/mine/info/index",
    "pages/mine/info/edit/index",
    "pages/mine/wallet/wllt/index",
    "pages/hot/index",
    "pages/hot/cate/index",
    "pages/hot/theater/index",
    "pages/video/index",
    "pages/video_up/index",
    "pages/mine/system/user/index",
    "pages/mine/system/pro/index",
  ],
  window: {
    navigationStyle: "custom",
    navigationBarBackgroundColor: "#ffffff",
    backgroundTextStyle: "light",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: false,
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/list/index",
        text: "追剧",
      },
      {
        pagePath: "pages/hot/index",
        text: "热播",
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
      },
    ],
    color: "#b2b5bc",
    selectedColor: "#fbffff", // 选中状态下的文本颜色
    backgroundColor: "#1e212a", // 背景颜色
    borderStyle: "black", // 边框样式
  },
});
