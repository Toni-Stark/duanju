import { View, Image, PickerView, PickerViewColumn } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useEffect, useState } from "react";
import header from "../../../static/source/header.png";
import { getMemberInfo, setMember } from "@/common/interface";
import {getSex, noTimeout} from "@/common/tools";
import { AtFloatLayout } from "taro-ui";
import { TShow } from "@/common/common";
import { HeaderView } from "@/components/headerView";
import {GetStorageSync} from "@/store/storage";

const selector = ["男", "女"];

export default function Info() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    nick: "匿名用户",
    sex: getSex(0),
    current: [0],
    show: false,
  });
  const [ENV, setENV] = useState(false);

  useEffect(() => {
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
      setOption({ ..._option });
    }
  }, []);

  useDidShow(() => {
    getMemberInfo().then((res) => {
      setOption({
        ...option,
        nick: res.data.nickname,
        sex: getSex(res.data.sex),
      });
    });
  });

  const naviToNick = () => {
    noTimeout(()=>{
      Taro.navigateTo({
        url: "./edit/index",
      });
    });
  };
  const handleOpen = () => {
    noTimeout(()=>{
      setOption({
        ...option,
        show: true,
      });
    });
  };
  const handleCancel = () => {
    noTimeout(()=>{
      setOption({
        ...option,
        show: false,
      });
    });
  };
  const changeVal = (e) => {
    noTimeout(()=>{
      setOption({
        ...option,
        current: e.detail.value,
      });
    });
  };
  const handleCom = () => {
    noTimeout(()=>{
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
    });
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
