import { useCallback } from "react";
import { useReady } from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import "./player.scss";
// @ts-ignore
const {  getPlayletManager } = tt;
export default (args) => {
  const {ssss } = args;
  const log = useCallback(() => {
    console.log("this is a log",ssss, args);
  }, [args, ssss]);
   useReady(()=>{
    const pm = getPlayletManager();
    pm.onPlay((e) => {
      console.log("触发开始播放onPlay回调:", JSON.stringify(e, null, 2))
    });
    pm.onPause((e) => {
      console.log("触发暂停播放onPause回调:", JSON.stringify(e, null, 2))
    })
    pm.onEnded((e) => {
      console.error("触发播放到末尾onEnded回调",e)
    })
    // pm.onError((e) => {
    //   console.error('触发onError回调,请确认2', e)
    //   tt.showModal({
    //     title: '触发onError回调,请确认',
    //     content: JSON.stringify(e),
    //     showCancel: false
    //   });
    //   console.log("触发onError回调:", JSON.stringify(e, null, 2))
    // })
    // 播放进度变化时
    // pm.onTimeUpdate((e) => {
    //   // 播放进度变化时触发，返回当前播放时间点及视频总时长，单位：秒(s)。event.detail = { currentTime, duration }。
    //   console.log("触发播放进度变化onTimeUpdate回调:", JSON.stringify(e, null, 2))
    // })
    pm.onWaiting((e) => {
      console.log("触发视频出现缓冲onWaiting回调:", JSON.stringify(e, null, 2))
    })
    pm.onPlayBackRateChange((e) => {
      console.log("触发视频倍速改变onPlayBackRateChange回调:", JSON.stringify(e, null, 2))
    })
    pm.onLoadedMetaData((e) => {
      console.log("触发视频元数据加载完成onLoadedMetaData回调:", JSON.stringify(e, null, 2))
    })
    pm.onSeekComplete((e) => {
      console.log("触发seek完成onSeekComplete回调:", JSON.stringify(e, null, 2))
    })
    pm.onMuteChange((e) => {
      console.log("触发静音状态改变onMuteChange回调:", JSON.stringify(e, null, 2))
    })
    pm.onControlTap((e) => {
      console.log("触发点击控件onControlTap回调:", JSON.stringify(e, null, 2))
    })
    pm.onOpenCatalog((e) => {
      console.log("触发点击选集onOpenCatalog回调:", JSON.stringify(e, null, 2))
    })
  // 推荐位使用简单示例
  pm.onChangeEpisode((e) => {
    console.log("触发选集切换onChangeEpisode回调:", e);
    pm.setRecommendConfig({
    entryType: 1,
    switchStatus: true,
    data: 
    {
        albumId: "7349101834553786889",
        seq: 1,
      }
  });
  if(e.albumId==='7349101834553786889'){
    pm.setCatalog({
    freeList: [
      {
        start_episode_no: 1,
        end_episode_no: 10,
      },
    ],
  });
  }
  });
    pm.onClickUnlock((e) => {
      console.log("player解锁", JSON.stringify(e, null, 2))
      pm.toggleCustomDialog();
    })
    pm.onTapCustomIcon((e) => {
      console.log("触发点击自定义组件onTapCustomIcon回调:", JSON.stringify(e, null, 2))
    })
    pm.onTapShare(() => {
      return { // 分享数据
        title: '测试小程序测试短剧onTapShare', // 这是要转发的小程序标题
        desc: `这是默认的转发文案，用户可以直接发送，也可以在发布器内修改,分享的episodeId是 ${''}`,
        path: `page/shortDramaMarket/playlet-plugin/index?tt_album_id=${''}&tt_episode_id=${''}`, // ?后面的参数会在转发页面打开时传入onLoad方法
        imageUrl: 'https://n.sinaimg.cn/sinakd20220105s/289/w945h944/20220105/d698-6b9d8808d51527dc9656b35e12b486ae.jpg', // 支持本地或远程图片，默认是小程序 icon
        templateId: '这是开发者后台设置的分享素材模板id'
      }
    })
    pm.onShareSuccess((res) => {
      console.log("分享成功onShareSuccess回调:", JSON.stringify(res, null, 2))
    })
    pm.onShareFail((res) => {
      console.log("分享失败onShareSuccess回调:", JSON.stringify(res, null, 2))
    })
  });
  return (
    <View className="box">
      <Text>Hello world!</Text>
      <Button onClick={log}>打log</Button>
    </View>
  );
};
