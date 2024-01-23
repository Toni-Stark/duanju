import { Video, View } from "@tarojs/components";

import "./index.less";
import Taro from "@tarojs/taro";

type Props = {
  height: any;
  data: any;
};

export const IndexVideo = (props: Props) => {
  const { data, height } = props;

  const naviToVideo = (id) => {
    Taro.navigateTo({
      url: "../video/index?id=" + id,
    });
  };
  return (
    <View className="vvview-large" onClick={() => naviToVideo(data.id)}>
      <Video
        className="vvview-large-video"
        style={{ height: height + "px" }}
        src={data.url}
        poster={data.img}
        initialTime={0}
        controls={false}
        autoplay
        loop
        muted
        objectFit="cover"
      />
      <text className="vvview-large-desc">{data.describe}</text>
    </View>
  );
};
