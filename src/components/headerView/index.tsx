import { Image, View } from "@tarojs/components";

import "./index.less";
import left from "@/static/icon/left.png";
import home from "@/static/icon/home.png";
import searchImg from "@/static/icon/search.png";
import Taro from "@tarojs/taro";
import {useEffect, useMemo, useState} from "react";

type Props = {
  barHeight: number;
  height: number;
  text: string;
  search: boolean;
};

export const HeaderView = (props: Partial<Props>) => {
  const pages = Taro.getCurrentPages();
  const { barHeight, height, text, search, url } = props;
  const [UA, setUA] = useState(true);

  const naviBack = () => {
    Taro.navigateBack();
  };
  const naviSearch = () => {
    Taro.navigateTo({
      url: url,
    });
  };
  const naviHome = () => {
    Taro.switchTab({
      url: "/pages/index/index",
    });
  };
  useEffect(() => {
    Taro.getSystemInfo({
      success: function (res) {
        // 判断设备类型
        if (res.platform === "mac" || res.platform === "windows") {
          // 电脑端
          console.log("当前为电脑端");
          setUA(false);
        } else {
          // 判断 User Agent 是否包含关键字 'Macintosh'
          setUA(true);
        }
      },
    });
  }, []);
  const currentImage = useMemo(() => {
    if (search) {
      return (
        <Image
          mode="widthFix"
          className="he_view_header_img"
          src={searchImg}
          onClick={naviSearch}
        />
      );
    }
    if (pages.length > 1) {
      return (
        <Image
          mode="widthFix"
          className="he_view_header_img"
          src={left}
          onClick={naviBack}
        />
      );
    }
    return (
      <Image
        mode="widthFix"
        className="he_view_header_img"
        src={home}
        onClick={naviHome}
      />
    );
  }, [pages, search, url, text]);
  return (
    <View className="he_view">
      <View
        className="he_view_header"
        style={{
          marginTop: barHeight + "Px",
          height: height + "Px",
        }}
      >
        {currentImage}
        <View className="he_view_header_text">{text}</View>
      </View>
    </View>
  );
};
