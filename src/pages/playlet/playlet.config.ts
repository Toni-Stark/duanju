export default definePageConfig({
  // @ts-ignore
  extends: "ext://industry/playlet-plugin",
  // @ts-ignore
  isPageExtension: true,
  navigationBarTitleText: "首页",
  usingComponents: {
    player: '../../components/player/player',
    charge: '../../components/charge/charge'
  }
});
