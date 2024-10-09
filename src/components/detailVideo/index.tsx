import {Image, Video, View} from "@tarojs/components";

import "./index.less";
import {memo, useMemo} from "react";
import CurrentVideoPlayer from "@/components/newPlayer";

export const CurrentViewVideo = memo(({ind, index,controls,currentInfo,ENV,dataInfo,startPlay,setControls,onEnded,stopPlay}) => {
  let bool = index === ind && currentInfo?.url;
  const useVideo = useMemo(()=>{
    if(!bool)return null;
    return (
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
    )
  }, [bool,dataInfo,currentInfo,onEnded,startPlay])
  return (
    <>
      {useVideo}
      { !bool?
        <Image className="center_video_img" mode={"aspectFill"} src={dataInfo?.img} style={{opacity: bool ? 0 : 1}}/>
        :!controls?
          <View className="center_video_view" onClick={()=>{
            setControls(true)
          }} />:null
      }
    </>
  )
})
