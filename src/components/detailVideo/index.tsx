import {Image, Video, View} from "@tarojs/components";

import "./index.less";
import {memo} from "react";
import CurrentVideoPlayer from "@/components/newPlayer";

export const CurrentViewVideo = memo(({ind, index,controls,currentInfo,ENV,dataInfo,startPlay,setControls,onEnded,stopPlay}) => {
  // let bool = index === ind && currentInfo?.url;
  let bool = index === ind && currentInfo?.url;
  return (
    <>
      {bool ?
        <CurrentVideoPlayer
          albumId={dataInfo.drama_id}
          episodeId={currentInfo.task_id}
          id={dataInfo.id}
          img={dataInfo.img}
          url={currentInfo?.url}
          onError={(e)=>{
            console.log('视频播放出错:', e);
          }}
          onEnded={onEnded}
          onPlay={startPlay}
        />
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
