import { View } from '@tarojs/components';
import {useEffect} from "react";

const CurrentVideoPlayer = ({albumId,episodeId,id,img,url,onError, onPlay, onEnded}) => {
  const handleVideoError = (event) => {
    const { detail } = event; // 获取错误事件的详细信息
    // 在这里处理错误，比如显示提示信息
    onError(detail)
  };
  const handleVideoSource = (event) => {
    console.log(event,'handleVideoSource')
  }
  const handleVideoEnded = (event) => {
    console.log(event,'handleVideoEnded')
    const { detail } = event; // 获取错误事件的详细信息
    // 在这里处理错误，比如显示提示信息
    onEnded(detail)
  }
  const handleVideoPlay = (event) => {
    const { detail } = event; // 获取错误事件的详细信息
    // 在这里处理错误，比如显示提示信息
    onPlay(detail)
  }
  useEffect(()=>{
    setTimeout(()=>{
      let videoContext = tt.createVideoContext("123456");
      console.log('videoContext', videoContext);
      videoContext.play();
    },500)
  },[])

  return (
    <View style={{width:'100%',height:'100%'}}>
      <video_player
        albumId={albumId}
        episodeId={episodeId}
        id="123456"
        autoplay={false}
        cloudType={1}
        style="width:100%; height:100%;z-index: 1;"
        objectFit="fill"
        onError={handleVideoError} // 绑定错误事件
        onEnded={handleVideoEnded}
        onPlay={handleVideoPlay}
        onGetsource={handleVideoSource}
        version={1}
        posterSize="fill"
        // poster={img}
        url={url}
      />
    </View>
  );
}

export default CurrentVideoPlayer;
