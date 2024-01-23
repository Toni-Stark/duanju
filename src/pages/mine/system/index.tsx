import { View, ScrollView, Image } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import left from "../../../static/icon/left.png";
import right from "../../../static/icon/right.png";
import { HeaderView } from "@/components/headerView";

export default function System() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    videoHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    count: 0,
  });
  const [dataList, setDataList] = useState([
    {
      title: "服务协议",
      url: "./user/index",
    },
    {
      title: "隐私协议",
      url: "./pro/index",
    },
    // {
    //   title: "注销账号",
    //   url: "./log_off/index",
    // },
    // {
    //   title: "关于小程序",
    //   url: "./about/index",
    // },
  ]);

  useLoad(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.top;
    _option.statusBarHeight = rect.height;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        _option.videoHeight = res.screenWidth / 0.72;
      },
    });

    setOption({ ..._option });
  });
  const naviBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="系统服务"
      />
      <View className="index_content">
        <View className="index_content_card">
          {dataList.map((item) => {
            return (
              <View
                className="index_content_card_item"
                onClick={() => {
                  Taro.navigateTo({
                    url: item.url,
                  });
                }}
              >
                {item.title}
                <Image className="index_content_card_item_image" src={right} />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
