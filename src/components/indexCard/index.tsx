import { Image, Text, View } from "@tarojs/components";

import "./index.less";
import Taro from "@tarojs/taro";
import { Loading } from "@/components/loading";
import right from "@/static/icon/right.png";
import {getIndexActRecord} from "@/common/interface";

type Props = {
  data: any;
  loading: boolean;
};

export const IndexCard = (props: Props) => {
  const { loading, data } = props;
  const naviToList = (title, id) => {
    getIndexActRecord({frame: '1', act: '2', target_id: id});
    Taro.navigateTo({
      url: "./hot/index?title=" + title + "&id=" + id,
    });
  };
  const naviToVideo = (id) => {
    Taro.navigateTo({
      url: "../video/index?id=" + id,
    });
  };
  if (!loading) {
    return (
      <View className="loading_lar">
        <Loading size={40} />
      </View>
    );
  } else {
    if (data?.video_list <= 0) {
      return null;
    }
    return (
      <>
        <View className="ssview-lar">
          <Text className="ssview-lar-text">{data.intro}</Text>
          <View
            className="ssview-lar-link"
            onClick={() => {
              naviToList(data.name, data.id);
            }}
          >
            热门独播
            <Image
              mode="widthFix"
              className="ssview-lar-link-icon"
              src={right}
            />
          </View>
        </View>
        <View className="ssview-list">
          {data?.video_list.map((item) => {
            return (
              <View
                className="ssview-list-item"
                onClick={() => naviToVideo(item.id)}
              >
                <Image className="image" src={item.img} />
                <Text className="text">{item.name}</Text>
                <Text className="eval">{item.describe}</Text>
              </View>
            );
          })}
        </View>
      </>
    );
  }
};
