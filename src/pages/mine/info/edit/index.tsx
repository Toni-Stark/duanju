import { View, Input } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import { setMember } from "@/common/interface";
import { TShow } from "@/common/common";
import { HeaderView } from "@/components/headerView";
import {GetStorageSync} from "@/store/storage";

export default function Edit() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    value: "",
  });
  const [ENV, setENV] = useState(false);

  useLoad(() => {
    setENV(GetStorageSync('ENV') == "TT")
    if(GetStorageSync('ENV') == "TT") {
      Taro.setNavigationBarTitle({
        title: "个人资料"
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
      setOption({..._option});
    }
  });
  const editNickName = () => {
    if(option.value?.trim().length>0){
      setMember({ nickname: option.value }).then((res) => {
        if (res.code !== 200) {
          TShow(res.msg);
          return;
        }
        Taro.navigateBack();
      });
      return;
    }
    TShow("请输入昵称")
  };
  const changeValue = (e) => {
    setOption({ ...option, value: e.detail.value });
  };

  return (
    <View className="index">
      {!ENV?
        <HeaderView
          barHeight={option.barHeight}
          height={option.statusBarHeight}
          text="个人资料"
        />:null}
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
