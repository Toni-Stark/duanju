import { View } from "@tarojs/components";

import "./index.less";

export const Loading = ({ text = "加载中", size = 50 }) => {
  return (
    <View className="loading_view">
      <View
        style={{ width: size, height: size }}
        className="loading_view_content"
      />
      <View className="loading_view_text">快马加鞭中...</View>
    </View>
  );
};
