import { View, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import {useMemo, useState} from "react";
import right from "../../../static/icon/right.png";
import { getMemberInfo } from "@/common/interface";
import { HeaderView } from "@/components/headerView";
import {commonSetting} from "@/store/config";
import {GetStorageSync} from "@/store/storage";
import {noTimeout} from "@/common/tools";

export default function Wallet() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
  });
  const [info, setInfo] = useState(undefined);
  const [ENV, setENV] = useState(false);

  useDidShow(() => {
    setENV(GetStorageSync('ENV') == "TT")
    if(GetStorageSync('ENV') == "TT") {
      Taro.setNavigationBarTitle({
        title: "我的钱包"
      });
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1e212a',
      })
    }
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
    noTimeout(()=>{
      Taro.navigateTo({
        url: "./recharge/index?type=2",
      });
    })
  };

  const naviToList = (num) => {
    noTimeout(()=>{
      let arr = [
        {
          title: "充值记录",
          id: 1,
        },
        {
          title: commonSetting.coinName+"记录",
          id: 2,
        },
      ];
      let val = "./wllt/index?id=" + arr[num].id + "&title=" + arr[num].title;
      Taro.navigateTo({
        url: val,
      });
    });
  };

  const currentContext = useMemo(()=>{
    return (
      <View className="index_content_icon">
        <View className="index_content_icon_text">
          <View className="text_main">
            <View className="text_main_title">{commonSetting.coinName+'余额'}</View>
            <View className="text_main_eval">
              {info?.score}
              <View className="text_main_eval_text">{commonSetting.coinName}</View>
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
    )
  }, [info])
  const currentList = useMemo(()=>{
    return (
      <View className="index_content_list">
        <View className="index_item" onClick={() => naviToList(0)}>
          充值记录
          <Image className="index_item_image" src={right} />
        </View>
        <View className="index_item" onClick={() => naviToList(1)}>
          {commonSetting.coinName+'记录'}
          <Image className="index_item_image" src={right} />
        </View>
      </View>
    )
  }, [])
  return (
    <View className="index">
      {!ENV?
        <HeaderView
          barHeight={option.barHeight}
          height={option.statusBarHeight}
          text="我的钱包"
        />:null}
      <View className="index_content">
        {currentContext}
        {/*<View className="index_content_bug">*/}
        {/*  <View className="title">余额</View>*/}
        {/*  <View className="value">0.00</View>*/}
        {/*</View>*/}
        {currentList}
      </View>
    </View>
  );
}
