// pages/index/index.jsx
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

export const SeVideo = ({ text = "这里空空如也" }) => {
  return (
    <View>
    {Taro.getEnv() === "TT" ? (
      // <video-player style="height:100%;width:100%" src="http://cdn.niubojc.com/39/11.mp4?e=1727429575&token=S7ek4Rdg_yty7bPC6v2dDswga-u4MpUtx6aE7rH9:U8RO87F4E8t2LRhl92MBp_ZwBRY=" />
      <video-player
        bindtimeupdate="timeUpdateHandler"
        bindgetsource="getsourceHandler"
        enable-dark-water-mark="{{true}}"
        cloud-type="{{1}}"
        version="1"
        album-id="7418886688392348175"
        episode-id="7418886693673976354"
        id="39"
        autoplay="{{true}}"
        style="height:100%;width:100%"
        object-fit="contain"
        show-fullscreen-btn="{{false}}"
        show-play-btn="{{false}}"
        vslide-gesture-in-fullscreen="{{false}}"
        controls="{{false}}"
        bindended="nextVideo"
        binderror="error"
        src="http://cdn.niubojc.com/39/11.mp4?e=1727429575&token=S7ek4Rdg_yty7bPC6v2dDswga-u4MpUtx6aE7rH9:U8RO87F4E8t2LRhl92MBp_ZwBRY="
      >
      </video-player>
    ) : (
      <View>{text}</View>
    )}
    </View>
  )
}
