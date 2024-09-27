export default definePageConfig({
  // @ts-ignore
  extends: "ext://industry/playlet-plugin", // 使用的插件
  // @ts-ignore
  isPageExtension: true, // 是否为页面Extension
  navigationBarTitleText: "首页",
  usingComponents: {
    // NOTE 接收props而使用wrapper组件
    player: '../../components/player-wrapper/player',
    charge: '../../components/charge-wrapper/charge'
  }
});

