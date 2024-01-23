import { View, Text, ScrollView, Image, Video } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import header from "../../static/source/header.png";
import mon from "../../static/icon/mon.png";
import code from "../../static/icon/code.png";
import kefu from "../../static/icon/kefu.png";
import meun from "../../static/icon/meun.png";
import emo from "../../static/icon/e_mo.png";
import { getMemberInfo, getMemberSign } from "@/common/interface";

export default function Mine() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    nickname: "匿名用户",
    spread_level_desc: "",
    score: 0,
    expire_days: 0,
    spread: 0,
    is_signed: 0,
    id: "",
    sn: "",
    loading: false,
    my_kf: "",
  });

  const [list, setList] = useState([
    {
      title: "我的钱包",
      icon: mon,
      url: "./wallet/index",
    },
    {
      title: "我要推广",
      icon: code,
      url: "./code/index",
    },
    // {
    //   title: "内容偏好",
    //   icon: search,
    //   url: "./hobby/index",
    // },
    {
      title: "我的客服",
      icon: kefu,
      url: "ke",
    },
    {
      title: "系统服务",
      icon: meun,
      url: "./system/index",
    },
  ]);

  useDidShow(() => {
    getMemberInfo().then((res) => {
      setOption({
        ...option,
        ...res.data,
        loading: true,
      });
    });
  });
  useLoad(async () => {
    if (option.loading) return;
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

  const naviTo = (item) => {
    if (item.url == "ke") {
      Taro.makePhoneCall({
        phoneNumber: option.my_kf,
        phoneNucompleteber: function (res) {
          console.log(res);
        },
      });
      return;
    }
    Taro.navigateTo({
      url: item.url,
    });
  };
  const naviToInfo = () => {
    Taro.navigateTo({
      url: "./info/index",
    });
  };
  const naviToRecharge = () => {
    Taro.navigateTo({
      url: "./wallet/recharge/index?type=2",
    });
  };
  const currentLocat = () => {
    getMemberSign().then((res) => {
      if (res.code === 200) {
        setOption({
          ...option,
          is_signed: 1,
        });
      }
    });
  };
  const naviToWllt = () => {
    let val = "./wallet/wllt/index?id=" + 2 + "&title=积分记录";
    Taro.navigateTo({
      url: val,
    });
  };
  return (
    <View className="index">
      <View className="index_body">
        <View className="index_body_header">
          <Image
            mode="widthFix"
            onClick={naviToInfo}
            className="index_body_header_img"
            src={header}
          />
        </View>
        <View className="index_body_content">
          <View className="content-wel">
            <View className="content-wel-main">
              <View className="content-wel-main-title">
                <View className="coin">欢迎回来，{option.nickname}</View>
                <view className="val">{option.sn}</view>
              </View>
              <View className="content-wel-main-list">
                <View className="content-wel-main-list-title">
                  ID:{option.id}
                </View>
                <View className="content-wel-main-list-title">
                  {option.spread_level_desc}
                </View>
              </View>
            </View>
            <View className="content-wel-mon">
              <View className="content-wel-mon-coin">
                <View className="content-wel-mon-coin-content">
                  <View className="content-wel-mon-coin-content-value">
                    {option?.expire_days}
                    <View className="content-wel-mon-coin-content-value-text">
                      会员时长(天)
                    </View>
                  </View>
                </View>
                <View
                  className="content-wel-mon-coin-into"
                  onClick={naviToRecharge}
                >
                  充值
                </View>
              </View>
              <View className="content-wel-mon-people">
                <View
                  className="content-wel-mon-people-value"
                  onClick={naviToWllt}
                >
                  {option.score}
                  <View className="content-wel-mon-coin-content-value-text">
                    积分
                  </View>
                </View>
                <View className="content-wel-mon-people-value">
                  {option.spread}
                  <View className="content-wel-mon-coin-content-value-text">
                    邀请人数
                  </View>
                </View>
              </View>
            </View>
            <View className="content-wel-integral">
              <View className="e_text">
                签到领积分
                <Image className="e_come" src={emo} />
              </View>
              {!option.is_signed ? (
                <View
                  hoverClass="hover_view"
                  className="content-wel-integral-btn active"
                  onClick={currentLocat}
                >
                  签到
                </View>
              ) : (
                <View className="content-wel-integral-btn">已签到</View>
              )}
            </View>
            <View className="content-wel-list">
              {list.map((item) => {
                return (
                  <View
                    className="content-wel-list-item"
                    onClick={() => naviTo(item)}
                  >
                    <Image
                      mode="widthFix"
                      src={item.icon}
                      className="content-wel-list-item-img"
                    />
                    <View className="content-wel-list-item-text">
                      {item.title}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
      {/*<View className="index_footer" />*/}
    </View>
  );
}
