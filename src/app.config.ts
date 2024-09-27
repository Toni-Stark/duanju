console.log(process.env, 'process')
let env = process.env.npm_lifecycle_event.indexOf('build:tt')>=0;
let window = env?{}:{
  navigationStyle: "custom",
  navigationBarBackgroundColor: "#ffffff",
  backgroundTextStyle: "light",
  navigationBarTitleText: "WeChat",
  navigationBarTextStyle: "black",
};
let permission = env?{
}:{
  makePhoneCall: {
    desc: "你的电话将用于拨打客服电话"
  }
}
export default defineAppConfig({
  __usePrivacyCheck__: true,
  pages: [
    "pages/index/index",
    "pages/index/cate/index",
    "pages/index/hot/index",
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
    "pages/video_up/index",
    "pages/playlet/playlet",
    "pages/mine/system/user/index",
    "pages/mine/system/pro/index",
    "pages/mine/system/pay/index",
    "pages/mine/system/member/index",
  ],
  window:window,
  permission:permission,
  // NOTE 需要编译成native的组件，并且需要配套的wrapper组件接受props（参考components/player-wrapper）
  tabBar: {
    custom: false,
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        selectedIconPath: './static/tabbar/home-f.png',
        iconPath: './static/tabbar/home-g.png'
      },
      {
        pagePath: "pages/list/index",
        text: "追剧",
        selectedIconPath: './static/tabbar/star-f.png',
        iconPath: './static/tabbar/star-g.png'
      },
      {
        pagePath: "pages/hot/index",
        text: "热播",
        selectedIconPath: './static/tabbar/hot-f.png',
        iconPath: './static/tabbar/hot-g.png'
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        selectedIconPath: './static/tabbar/mine-f.png',
        iconPath: './static/tabbar/mine-g.png'
      },
    ],
    color: "#b2b5bc",
    selectedColor: "#fbffff", // 选中状态下的文本颜色
    backgroundColor: "#1e212a", // 背景颜色
    borderStyle: "black", // 边框样式
  },

});
