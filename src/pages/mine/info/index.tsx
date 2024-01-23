import { View, Image, PickerView, PickerViewColumn } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useEffect, useState } from "react";
import header from "../../../static/source/header.png";
import { getMemberInfo, setMember } from "@/common/interface";
import { getSex } from "@/common/tools";
import { AtFloatLayout, AtList, AtListItem } from "taro-ui";
import { TShow } from "@/common/common";
import { HeaderView } from "@/components/headerView";
import { VIEW } from "@tarojs/runtime";

const selector = ["男", "女"];

export default function Info() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    nick: "匿名用户",
    sex: getSex(0),
    current: [0],
    show: false,
  });

  useEffect(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.top;
    _option.statusBarHeight = rect.height;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
      },
    });
    setOption({ ..._option });
    return () => {};
  }, []);

  useDidShow(() => {
    getMemberInfo().then((res) => {
      console.log(res);
      setOption({
        ...option,
        nick: res.data.nickname,
        sex: getSex(res.data.sex),
      });
    });
  });

  const naviBack = () => {
    Taro.navigateBack();
  };
  const naviToNick = () => {
    Taro.navigateTo({
      url: "./edit/index",
    });
  };
  const handleOpen = () => {
    setOption({
      ...option,
      show: true,
    });
  };
  const handleCancel = (val) => {
    setOption({
      ...option,
      show: false,
    });
  };
  const changeVal = (e) => {
    console.log(e.detail.value[0]);
    setOption({
      ...option,
      current: e.detail.value,
    });
  };
  const handleCom = () => {
    setMember({ sex: option.current[0] + 1 }).then((res) => {
      if (res.code !== 200) {
        TShow(res.msg);
        return;
      }
      setOption({
        ...option,
        sex: selector[option.current[0]],
        show: false,
      });
    });
  };
  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="个人资料"
      />
      <View className="index_content">
        <View className="index_content_header">
          <View className="header_view">
            <Image className="header_view_img" src={header} />
            {/*<View className="header_view_text">修改头像</View>*/}
          </View>
        </View>
        <View className="index_content_card">
          <View className="index_content_card_item" onClick={naviToNick}>
            昵称
            <View className="value">{option.nick}</View>
          </View>
          <View className="index_content_card_item" onClick={handleOpen}>
            性别
            <View className="value">{option.sex}</View>
          </View>
        </View>
      </View>
      <AtFloatLayout isOpened={option.show} onClose={handleCancel}>
        <View className="float">
          <View className="float_lay" onClick={handleCancel}>
            取消
          </View>
          <View className="float_lay com" onClick={handleCom}>
            确定
          </View>
        </View>
        <PickerView
          indicatorStyle="height: 50px;"
          className="picker_view"
          style="width: 100%;height: 200px"
          value={option.current}
          onChange={changeVal}
        >
          <PickerViewColumn>
            {selector.map((item, index) => {
              return (
                <View className="lay_view" key={index}>
                  {item}
                </View>
              );
            })}
          </PickerViewColumn>
        </PickerView>
      </AtFloatLayout>
    </View>
  );
}
