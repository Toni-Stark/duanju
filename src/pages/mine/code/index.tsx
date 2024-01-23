import {
  View,
  ScrollView,
  Image,
  Swiper,
  SwiperItem,
} from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import one from "../../../static/icon/one.png";
import two from "../../../static/icon/two.png";
import three from "../../../static/icon/three.png";
import four from "../../../static/icon/four.png";
import down from "../../../static/icon/down_load.png";
import share from "../../../static/icon/share.png";
import { getMemberInfo, getMemberSpread } from "@/common/interface";
import { TShow } from "@/common/common";
import { HeaderView } from "@/components/headerView";

export default function Code() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    more: false,
  });
  const [refresh, setRefresh] = useState(false);
  const [current, setCurrent] = useState(0);
  const [info, setInfo] = useState(undefined);
  const [dataList, setDataList] = useState<any>([
    {
      title: "普通会员",
      status: "已达成",
      status_desc: "您已达成该等级",
      icon: one,
      color: "#333333",
      start_color: "#ececec",
      end_color: "#ababab",
    },
    {
      title: "普通剧推官",
      status: "未达成",
      status_desc: "尚未达到升级条件",
      main: "可享受邀请会员消费15%的奖励",
      count: 0,
      num: 0,
      icon: two,
      color: "#7289b5",
      start_color: "#eff0f2",
      end_color: "#cbdaef",
    },
    {
      title: "金牌剧推官",
      status: "未达成",
      status_desc: "尚未达到升级条件",
      main: "可享受邀请会员消费20%的奖励",
      count: 0,
      num: 0,
      icon: three,
      color: "#ff7d01",
      start_color: "#ffe8d6",
      end_color: "#ffb167",
    },
    {
      title: "钻石剧推官",
      status: "未达成",
      status_desc: "尚未达到升级条件",
      main: "可享受邀请会员消费20%的奖励",
      count: 0,
      num: 0,
      icon: four,
      code_color: "#6400ff",
      color: "#ffffff",
      start_color: "#bcc5ff",
      end_color: "#6400ff",
    },
  ]);
  const [desc, setDesc] = useState([]);
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
    getMemberInfo().then((res) => {
      setInfo(res.data);
      currentMemberSpread();
    });
    setOption({ ..._option });
  });
  const currentMemberSpread = () => {
    getMemberSpread().then((res) => {
      let {list} = res.data;
      setDesc([...list]);
      setRefresh(false);
    });
  };
  const currentArrVal = (data, info, num, index) => {
    let tLe = num >= info.start_num;
    data.title = info.name;
    data.status = tLe ? "已达成" : "未达成";
    data.status_desc = tLe ? "您已达成该等级" : "尚未达到升级条件";
    if (!tLe) {
      data.main = info.describe;
    }
    data.status = tLe ? "已达成" : "未达成";
    data.bool = tLe;
    data.num = num;
    data.start_num = info.start_num;
    data.end_num = info.end_num;
    data.num = num;
    if (!tLe) {
      data.count = info.start_num;
    }
    if (info?.is_reach) {
      setCurrent(index);
    }
    return data;
  };
  const saveImage = () => {
    Taro.saveImageToPhotosAlbum({
      url: info.spread_qrcode,
      success: (res) => {
        TShow("保存成功");
      },
      fail: (res) => {
        TShow("保存失败");
      },
    });
  };
  const shareImage = () => {
    console.log(info);
    Taro.downloadFile({
      url: info.spread_qrcode,
      success: (res) => {
        Taro.showShareImageMenu({
          path: res.tempFilePath,
        });
      },
    });
  };
  const refreshChange = () => {
    setRefresh(true);
    currentMemberSpread();
  };

  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="我要推广"
      />
      <View className="index_content">
        <ScrollView
          className="scroll_view"
          id="scroll_view"
          scrollY
          scrollWithAnimation
          refresherEnabled
          refresherTriggered={refresh}
          refresherBackground="#1e212a"
          onRefresherRefresh={refreshChange}
          enhanced
        >
          {/*<View className="header">*/}
          {/*  <Swiper*/}
          {/*    className="swiper_view"*/}
          {/*    indicatorColor="#999"*/}
          {/*    indicatorActiveColor="#333"*/}
          {/*    circular*/}
          {/*    current={current}*/}
          {/*    disableTouch*/}
          {/*    previousMargin="10px"*/}
          {/*    nextMargin="10px"*/}
          {/*  >*/}
          {/*    {dataList.map((res) => {*/}
          {/*      let item: any = res;*/}
          {/*      return (*/}
          {/*        <SwiperItem>*/}
          {/*          <View className="swiper">*/}
          {/*            <View*/}
          {/*              className="swiper_item"*/}
          {/*              style={{*/}
          {/*                background:*/}
          {/*                  "linear-gradient(to right, " +*/}
          {/*                  item.start_color +*/}
          {/*                  ", " +*/}
          {/*                  item.end_color +*/}
          {/*                  ")",*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              <View*/}
          {/*                className="swiper_item_content"*/}
          {/*                style={{ color: item.color }}*/}
          {/*              >*/}
          {/*                <View className="title">{item.title}</View>*/}
          {/*                <View className="label">*/}
          {/*                  <View*/}
          {/*                    className="label_icon"*/}
          {/*                    style={{*/}
          {/*                      background: item?.code_color || item.color,*/}
          {/*                    }}*/}
          {/*                  >*/}
          {/*                    {item.status}*/}
          {/*                  </View>*/}
          {/*                  <View className="label_text">*/}
          {/*                    {item.status_desc}*/}
          {/*                  </View>*/}
          {/*                </View>*/}
          {/*                <View className="text">*/}
          {/*                  {item.main ? <View>{item.main}</View> : null}*/}
          {/*                  {!item.bool ? (*/}
          {/*                    <View>*/}
          {/*                      {item.num}/{item.count}还需邀请*/}
          {/*                      {item.count - item.num}人升级*/}
          {/*                    </View>*/}
          {/*                  ) : null}*/}
          {/*                </View>*/}
          {/*              </View>*/}
          {/*              <View className="swiper_item_img">*/}
          {/*                <Image*/}
          {/*                  className="swiper_item_img_logo"*/}
          {/*                  src={item.icon}*/}
          {/*                />*/}
          {/*              </View>*/}
          {/*            </View>*/}
          {/*          </View>*/}
          {/*        </SwiperItem>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </Swiper>*/}
          {/*</View>*/}
          <View className="code">
            <View className="content">
              <View className="content_title">剧推码</View>
              <View className="content_code">
                <Image className="content_code_img" src={info?.spread_qrcode} />
              </View>
            </View>
            <View className="control">
              <View className="control_view" onClick={saveImage}>
                <Image className="control_view_img" src={down} />
                保存图片
              </View>
              <View className="control_view" onClick={shareImage}>
                <Image className="control_view_img" src={share} />
                分享好友
              </View>
            </View>
          </View>
          <View className="desc">
            <View className="title">剧推官权益说明</View>
            <View className="desc">
              <View>
                1、用户等级分为普通会员、普通剧推官、金牌剧推官、钻石剧推官四个等级，注册登录后自动成为普通会员；
              </View>
              <View>
                2、分享剧推码给好友，好友扫码下载APP并注册后，即成功邀请好友，达到一定数量等级将自动升级；
              </View>
              <View>
                3、被邀请人在平台消费，你将获得一定奖励，不同等级剧推官获得奖励不同，等级越高奖励越多。
              </View>
              {desc.map((item) => {
                  return (
                    <View>
                      {item.describe}
                    </View>
                  );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
