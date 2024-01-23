import { View, ScrollView, Image } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import right from "../../../static/icon/right.png";
import { getMemberInfo } from "@/common/interface";
import { HeaderView } from "@/components/headerView";

export default function Wallet() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
  });
  const [info, setInfo] = useState(undefined);

  useDidShow(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect?.top;
    _option.statusBarHeight = rect?.height;

    getMemberInfo().then((res) => {
      setInfo(res.data);
    });
    setOption({ ..._option });
  });
  const naviToDetail = () => {
    Taro.navigateTo({
      url: "./recharge/index?type=2",
    });
  };

  const naviToList = (num) => {
    let arr = [
      {
        title: "充值记录",
        id: 1,
      },
      {
        title: "积分记录",
        id: 2,
      },
    ];
    let val = "./wllt/index?id=" + arr[num].id + "&title=" + arr[num].title;
    Taro.navigateTo({
      url: val,
    });
  };

  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="我的钱包"
      />
      <View className="index_content">
        <View className="index_content_icon">
          <View className="index_content_icon_text">
            <View className="text_main">
              <View className="text_main_title">积分余额</View>
              <View className="text_main_eval">
                {info?.score}
                <View className="text_main_eval_text">积分</View>
              </View>
            </View>
            <View className="text_main">
              <View className="text_main_title">会员时长</View>
              <View className="text_main_eval">
                {info?.expire_days}{" "}
                <View className="text_main_eval_text">天</View>
              </View>
            </View>
          </View>
          <View className="index_content_icon_btn" onClick={naviToDetail}>
            去充值
          </View>
        </View>
        <View className="index_content_bug">
          <View className="title">余额</View>
          <View className="value">0.00</View>
        </View>
        <View className="index_content_list">
          <View className="index_item" onClick={() => naviToList(0)}>
            充值记录
            <Image className="index_item_image" src={right} />
          </View>
          <View className="index_item" onClick={() => naviToList(1)}>
            积分记录
            <Image className="index_item_image" src={right} />
          </View>
        </View>
      </View>
    </View>
  );
}
