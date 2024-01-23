import { View, ScrollView, Image } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";

import { HeaderView } from "@/components/headerView";
// let routerList = [
//   { title: "真得鹿剧场", icon: card },
//   { title: "星星剧场", icon: card },
//   { title: "日新阅益", icon: card },
//   { title: "德明剧场", icon: card },
//   { title: "亮亮剧场", icon: card },
//   { title: "智彩剧场", icon: card },
//   { title: "山有木兮剧场", icon: card },
//   { title: "方土剧场", icon: card },
//   { title: "踏歌行剧场", icon: card },
//   { title: "巨星团剧场", icon: card },
// ];
export default function Theater() {
  const router = useRouter();
  const [rouOption, setRouOption] = useState<any>({});
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    active: 1,
    screenWidth: 0,
    screenHeight: 0,
    more: false,
    refresh: false,
  });
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const handleScrollTop = () => {
    setScrollTop(scrollTop ? 0 : 1);
  };
  useLoad(() => {
    const params = router.params;
    // setRouOption(routerList[params.type]);
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

  const onScroll = (e) => {
    if (scrollOpacity === 0 && e.detail.scrollTop >= option.screenHeight) {
      setScrollOpacity(1);
    }
    if (scrollOpacity > 0 && e.detail.scrollTop < option.screenHeight) {
      setScrollOpacity(0);
    }
  };

  const refreshChange = () => {
    setOption({ ...option, refresh: true });
    setTimeout(() => {
      setOption({ ...option, refresh: false });
    }, 1500);
  };

  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text=""
      />
      <View className="index_main">
        <Image className="index_main_img" src={rouOption.icon} />
        <View className="index_main_text">{rouOption.title}</View>
      </View>
      <View className="index_zone">
        <ScrollView
          className="index_zone_view"
          id="scroll_view"
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          refresherEnabled
          refresherTriggered={option.refresh}
          refresherBackground="#1e212a"
          onRefresherRefresh={refreshChange}
          enhanced
          onScroll={onScroll}
        >
          <View id="top" />
          <View className="index_zone_view_content">
            <View className="navi-data">
              <View className="navi-data-item">
                {/*<Image*/}
                {/*  mode="widthFix"*/}
                {/*  src={card}*/}
                {/*  className="navi-data-item-img"*/}
                {/*/>*/}
                <View className="navi-data-item-view">
                  <View className="navi-data-item-view-content">
                    <View className="navi-data-item-view-content-main">
                      替身的诱惑
                    </View>
                    <View className="navi-data-item-view-content-eval">
                      互换身份身陷阴谋
                    </View>
                  </View>
                  <View className="navi-data-item-view-eval">
                    <View>316人正在看</View>
                    <View>更新至第78集</View>
                  </View>
                </View>
              </View>
            </View>
            <View className="index-footer">
              {option.more ? (
                <View className="index-footer-view">加载中...</View>
              ) : (
                <View className="index-footer-view">暂无更多</View>
              )}
            </View>
          </View>
        </ScrollView>
        <View
          className="scroll_top"
          style={{ opacity: scrollOpacity }}
          onClick={handleScrollTop}
        >
          <Image className="scroll_top_img" src={top} />
        </View>
      </View>
    </View>
  );
}
