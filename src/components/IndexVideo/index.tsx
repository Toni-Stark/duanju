import { Video, View } from "@tarojs/components";

import "./index.less";
import Taro from "@tarojs/taro";

type Props = {
  height: any;
  data: any;
};

export const IndexVideo = (props: Props) => {
  const { data, height, id } = props;

  const naviToVideoUp = (id) => {
    Taro.navigateTo({
      url: "../video_up/index?id=" + id,
    });
  };
  return (
    <View className="mini-view-large" onClick={() => naviToVideoUp(data.id)}>
      <Video
        className="mini-view-large-video"
        style={{ height: height + "px" }}
        src={data.url}
        poster={data.img}
        initialTime={0}
        controls={false}
        enable-progress-gesture={false}
        autoplay={false}
        loop
        muted
        objectFit="cover"
        id={id}
      />
      <text className="mini-view-large-desc">{data.describe}</text>
    </View>
  );
};
