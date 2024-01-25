import { View, ScrollView, Image } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import top from "../../../static/icon/top.png";
import { AtButton } from "taro-ui";
import { getIndexClassify, getIndexClassifyList } from "@/common/interface";
import { NoneView } from "@/components/noneView";
import { HeaderView } from "@/components/headerView";
import { Loading } from "@/components/loading";

export default function Search() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    active: 1,
    screenWidth: 0,
    screenHeight: 0,
    more: false,
    refresh: false,
    title: "",
    type: "",
    p: 1,
  });
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [btnList, setBtnList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const handleScrollTop = () => {
    setScrollTop(scrollTop ? 0 : 1);
  };
  useLoad(() => {
    const params = router.params;
    let _option = option;
    _option.title = params?.title;
    _option.type = params?.type;
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
    getIndexClassList();
  });
  const getIndexClassList = () => {
    getIndexClassifyList().then((res) => {
      setBtnList(res.data);
      if (res.data?.length > 0) {
        setActive(res.data[0].id);
        getDataList(res.data[0].id, 1);
      }
    });
  };
  const getDataList = (id, p) => {
    getIndexClassify({ class_id: id, p }).then((res) => {
      let list = [...dataList];
      if (p == 1) {
        list = res.data.list;
      } else {
        list = list.concat(res.data.list);
      }
      setDataList(list);
      setOption({ ...option, active: id, p, refresh: false });
      setTimeout(() => {
        setLoading(true);
      }, 500);
    });
  };
  const setActive = (id) => {
    getDataList(id, 1);
  };
  const onScroll = (e) => {
    if (scrollOpacity === 0 && e.detail.scrollTop >= option.screenHeight) {
      setScrollOpacity(1);
    }
    if (scrollOpacity > 0 && e.detail.scrollTop < option.screenHeight) {
      setScrollOpacity(0);
    }
  };
  const addScrollList = () => {
    getDataList(option.active, option.p + 1);
  };
  const refreshChange = () => {
    setOption({ ...option, refresh: true });
    getDataList(option.active, 1);
  };
  const naviToVideo = (id) => {
    Taro.navigateTo({
      url: "../../video/index?id=" + id,
    });
  };
  const naviToVideoUp = (id) => {
    Taro.navigateTo({
      url: "../../video_up/index?id=" + id,
    });
  };
  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text={option?.title || "更多分类"}
      />
      {option.type == "1" ? (
        <View className="index_buttons">
          {btnList.map((item, index) => {
            return (
              <AtButton
                className={item.id === option.active ? "active" : ""}
                key={index}
                type="primary"
                size="normal"
                onClick={() => {
                  setActive(item.id);
                }}
              >
                {item.name}
              </AtButton>
            );
          })}
          <View className="button-pad" />
        </View>
      ) : null}

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
          lowerThreshold={30}
          onScrollToLower={addScrollList}
          enhanced
          onScroll={onScroll}
        >
          <View id="top" />
          {loading ? (
            <View className="index_zone_view_content">
              <View className="navi-data">
                {dataList.map((item) => {
                  return (
                    <View
                      className="navi-data-item"
                      onClick={() => {
                        naviToVideoUp(item.id);
                      }}
                    >
                      <Image src={item.img}  mode="aspectFill" className="navi-data-item-img" />
                      <View className="navi-data-item-view">
                        <View className="navi-data-item-view-content">
                          <View className="navi-data-item-view-content-main">
                            {item.name}
                          </View>
                          <View className="navi-data-item-view-content-eval">
                            {item.describe}
                          </View>
                        </View>
                        <View className="navi-data-item-view-eval">
                          <View>{item.watching}人正在看</View>
                          <View>更新至第{item.episode}集</View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              {dataList.length > 0 ? (
                <View className="index-footer">
                  {option.more ? (
                    <View className="index-footer-view">加载中...</View>
                  ) : (
                    <View className="index-footer-view">暂无更多</View>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    height: "35Vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NoneView />
                </View>
              )}
            </View>
          ) : (
            <View className="loading_pla">
              <Loading size={80} />
            </View>
          )}
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
