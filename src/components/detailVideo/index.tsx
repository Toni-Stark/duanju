import {Image, Video, View} from "@tarojs/components";

import "./index.less";
import {memo} from "react";

export const CurrentViewVideo = memo(({ind, index,controls,currentInfo,ENV,dataInfo,startPlay,setControls,onEnded,stopPlay}) => {
  // let bool = index === ind && currentInfo?.url;
  let bool = index === ind && currentInfo?.url;
  return (
    <>
      {bool ?
        // <Video
        //   className="center_video_large"
        //   src={currentInfo?.url}
        //   poster={ENV?null:dataInfo?.img}
        //   style={{opacity: bool ? 1 : 0, zIndex:500}}
        //   initialTime={0}
        //   controls={true}
        //   onControlsToggle={()=>{console.log(234234324)}}
        //   onPlay={startPlay}
        //   onPause={stopPlay}
        //   onEnded={onEnded}
        //   showPlayBtn={controls}
        //   showBottomProgress={controls}
        //   vslideGesture={false}
        //   showFullscreenBtn={false}
        //   pageGesture={false}
        //   enableProgressGesture={false}
        //   vslideGestureInFullscreen={false}
        //   autoplay={true}
        //   enablePlayGesture
        //   showCenterPlayBtn
        //   playBtnPosition="center"
        //   loop={false}
        //   objectFit="cover"
        // />
        <video-player
          style={`width:100%;height:100%;opacity: ${bool ? 1 : 0}, zIndex:500`}
          object-fit="cover"
          autoplay={true}
          id={dataInfo.id}
          // albumId={dataInfo.drama_id}
          // episodeId={currentInfo.task_id}
          albumId="7419982094979301938"
          episodeId="7419982110981636671"
          cloudType="1"
          bindplay={startPlay}
          bindpause={stopPlay}
          bindended={onEnded}
          poster={ENV?null:dataInfo?.img}
          version="1"
          loop={false}
          test="test" />
        : null}
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
