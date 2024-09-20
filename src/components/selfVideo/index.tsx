import {Video, View} from "@tarojs/components";

import "./index.less";

export const SelfVideo = ({height,url,img,id,cla,callback}) => {
  return (
    <View className="none_view">
      <View className="none_view_position" onClick={()=>{callback(id)}} />
      <Video
        id="video"
        style={{height:height}}
        className={cla||"components-video-video"}
        src={url}
        poster={img}
        initialTime={0}
        controls={false}
        autoplay={true}
        enable-progress-gesture={false}
        muted
        loop
        objectFit="cover"
        showFullscreenBtn={false}
        enablePlayGesture={false}
        showCenterPlayBtn
        playBtnPosition="center"
      />
    </View>
  );
};
