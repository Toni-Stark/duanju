import {
  View,
  ScrollView,
  Image,

   Button,
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
import {GetStorageSync} from "@/store/storage";

export default function Code() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    more: false,
  });
  let userInfo: any = GetStorageSync("allJson");
  Taro.useShareAppMessage(res => {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '长城传奇影视数字文化',
      path: '/pages/index/index?iv='+userInfo.sn,
    }
  })
  const [refresh, setRefresh] = useState(false);
  const [info, setInfo] = useState(undefined);
  const [desc, setDesc] = useState([]);
  useLoad(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.top;
    _option.statusBarHeight = rect.height;

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
  const saveImage = () => {
    TShow('保存中', 'loading')
    Taro.downloadFile({
      url: info.spread_qrcode,
      success: function (res) {
        console.log(res.tempFilePath)
        if (res.statusCode === 200) {
          Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              TShow("保存成功");
            },
            fail: (res) => {
              // TShow("微信权限申请中，暂时无法使用");
            },
          });
        }
      }
    });
  };
  const shareImage = () => {
    Taro.downloadFile({
      url: info.spread_qrcode,
      success: (res) => {
        Taro.showShareImageMenu({
          path: res.tempFilePath,
        });
      },
      fail: (res) => {
        TShow("微信权限申请中，暂时无法使用");
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
              {/*<Button*/}
              {/*  className="control_view"*/}
              {/*  openType="share"*/}
              {/*  hoverClass="index_label_active"*/}
              {/*>*/}
              {/*  <Image className="control_view_img" src={share} />*/}
              {/*  分享好友*/}
              {/*</Button>*/}
            </View>
          </View>
          <View className="desc">
            <View className="title">剧推官权益说明</View>
            <View className="desc">
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
