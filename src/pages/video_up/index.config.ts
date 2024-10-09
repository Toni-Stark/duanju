let env = process.env.npm_lifecycle_event.indexOf('build:tt')>=0;
let ttComponent = env?{
  "video_player":"ext://industry/video-player"
}:{}
export default definePageConfig({
  navigationBarTitleText: "   ",
  enableShareAppMessage: true,
  usingComponents: ttComponent
});
