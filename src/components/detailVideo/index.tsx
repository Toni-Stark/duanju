import {Image, Video, View} from "@tarojs/components";

import "./index.less";
import {memo} from "react";

export const CurrentViewVideo = memo(({ind, index,controls,currentInfo,ENV,dataInfo,startPlay,setControls,onEnded,stopPlay}) => {
  let bool = index === ind && currentInfo?.url;
  return (
    <>
      {bool ?
        <Video
          className="center_video_large"
          src={currentInfo?.url}
          poster={ENV?null:dataInfo?.img}
          style={{opacity: bool ? 1 : 0, zIndex:500}}
          initialTime={0}
          controls={true}
          onControlsToggle={()=>{console.log(234234324)}}
          onPlay={startPlay}
          onPause={stopPlay}
          onEnded={onEnded}
          showPlayBtn={controls}
          showBottomProgress={controls}
          vslideGesture={false}
          showFullscreenBtn={false}
          pageGesture={false}
          enableProgressGesture={false}
          vslideGestureInFullscreen={false}
          autoplay={true}
          enablePlayGesture
          showCenterPlayBtn
          playBtnPosition="center"
          loop={false}
          objectFit="cover"
        /> : null}
      { !bool
        ?
        <Image className="center_video_img" mode={"aspectFill"} src={dataInfo?.img} style={{opacity: bool ? 0 : 1, zIndex: bool ? 0 : 10000}}/>
        :!controls?
          <View className="center_video_view" onClick={()=>{
            setControls(true)
          }} />:null
      }
    </>
  )
})
