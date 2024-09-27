import { useDidShow ,useReady ,useLoad} from "@tarojs/taro";
// @ts-ignore
const { PlayletExtension ,getPlayletManager} = tt;

export default  PlayletExtension(()=>{
  const pm = getPlayletManager();
  useLoad((res)=>{
    console.log('页面完成Load pm options', pm,res);
    pm.setConfig({
      shareParam: { // 分享数据
        title: '测试小程序测试短剧', // 这是要转发的小程序标题
        desc: '这是默认的转发文案，用户可以直接发送，也可以在发布器内修改',
        path: `page/shortDramaMarket/playlet-plugin/index?tt_album_id=${res.albumId}&tt_episode_id=${res.episodeId}`, // ?后面的参数会在转发页面打开时传入onLoad方法
        imageUrl: 'https://n.sinaimg.cn/sinakd20220105s/289/w945h944/20220105/d698-6b9d8808d51527dc9656b35e12b486ae.jpg', // 支持本地或远程图片，默认是小程序 icon
        templateId: '这是开发者后台设置的分享素材模板id'
      }
    });
    pm.setConfig({
      activityInfo: [{
        icon: 'https://img95.699pic.com/xsj/0c/1m/7e.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast',
        title: '开辅助',
      }]
    });
    pm.setCatalog({
      freeList: [{
        start_episode_no: 1,
        end_episode_no: 2
      }],
      // unlockList: [
      //   {
      //     start_episode_no: 16,
      //     end_episode_no: 20
      //   },
      // ],
      // lockList: [{
      //     start_episode_no: 11,
      //     end_episode_no: 15
      //   },
      //   {
      //     start_episode_no: 21,
      //     end_episode_no: 76
      //   },
      // ],
    });
  });
  useReady(()=>{
    console.log(pm,'pm ready')
  });
  useDidShow(() => {
    console.log("show");
  });
});
