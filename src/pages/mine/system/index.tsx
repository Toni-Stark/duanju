import { View, Image } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import {useMemo, useState} from "react";
import right from "../../../static/icon/right.png";
import { HeaderView } from "@/components/headerView";
import {GetStorageSync} from "@/store/storage";

export default function System() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    count: 0,
  });
  const [dataList] = useState([
    {
      title: "服务协议",
      url: "./user/index",
    },
    {
      title: "隐私协议",
      url: "./pro/index",
    },
  ]);
  const [ENV, setENV] = useState(false);

  useLoad(() => {
    setENV(GetStorageSync('ENV') == "TT")
    if(GetStorageSync('ENV') == "TT") {
      Taro.setNavigationBarTitle({
        title: "系统服务"
      });
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1e212a',
      })
    } else {
      let _option = option;
      const rect = Taro.getMenuButtonBoundingClientRect();
      _option.barHeight = rect.top;
      _option.statusBarHeight = rect.height;

      setOption({ ..._option });
    }
  });
  const menuContent = useMemo(() => {
    return (
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
    )
  }, [dataList]);
  return (
    <View className="index">
      {!ENV?
        <HeaderView
          barHeight={option.barHeight}
          height={option.statusBarHeight}
          search
          text="系统服务"
          url="../index/search/index"
        />:null}
      <View className="index_content">
        {menuContent}
      </View>
    </View>
  );
}
