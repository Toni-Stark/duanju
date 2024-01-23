import { View, Image, Input } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import left from "../../../../static/icon/left.png";
import { setMember } from "@/common/interface";
import { TShow } from "@/common/common";
import { HeaderView } from "@/components/headerView";

export default function Edit() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    value: "",
  });

  useLoad(() => {
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
  });
  const naviBack = () => {
    Taro.navigateBack();
  };
  const editNickName = () => {
    setMember({ nickname: option.value }).then((res) => {
      if (res.code !== 200) {
        TShow(res.msg);
        return;
      }
      Taro.navigateBack();
    });
  };
  const changeValue = (e) => {
    setOption({ ...option, value: e.detail.value });
  };

  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="个人资料"
      />
      <View className="index_content">
        <View className="index_content_text">
          <View style={{ paddingLeft: 10 }}>修改昵称</View>
          <Input
            className="index_content_text_input"
            placeholder="请输入昵称"
            value={option.value}
            onInput={changeValue}
          />
        </View>
        <View className="index_content_button" onClick={editNickName}>
          确认修改
        </View>
      </View>
    </View>
  );
}
