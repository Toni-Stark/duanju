import { Image, Text, View } from "@tarojs/components";

import img from "../../static/source/none.png";

import "./index.less";

export const NoneView = ({ text = "这里空空如也" }) => {
  return (
    <View className="none_view">
      <Image mode="widthFix" className="none_view_img" src={img} />
      {text ? <Text className="none_view_text">{text}</Text> : null}
    </View>
  );
};
