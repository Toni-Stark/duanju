import { View, WebView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import { useState } from "react";

export default function System() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
  });

  useLoad(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.top;
    _option.statusBarHeight = rect.height;

    setOption({ ..._option });
  });
  return (
    <View className="index">
      <WebView src="https://video.hbcyszw.cn/api/default/server" />
    </View>
  );
}
