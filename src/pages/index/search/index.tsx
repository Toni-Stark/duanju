import { View, ScrollView, Image, Input } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useMemo, useState } from "react";
import top from "../../../static/icon/top.png";
import search from "../../../static/icon/search_gray.png";
import { getIndexSearch } from "@/common/interface";
import { GetStorageSync, SetStorageSync } from "@/store/storage";
import { NoneView } from "@/components/noneView";
import { HeaderView } from "@/components/headerView";
import { Loading } from "@/components/loading";

export default function Cate() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    more: false,
    refresh: false,
    p: 1,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [value, setValue] = useState("");
  const [kwList, setKwList] = useState([]);

  const handleScrollTop = () => {
    setScrollTop(scrollTop ? 0 : 1);
  };
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

    let list = GetStorageSync("kw");
    if (!list) {
      list = [];
    }
    setKwList(list);
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
    getCurrentList();
  };
  const getCurrentList = () => {
    setLoading(true);
    getCurrentSearch({ kw: value, p: 1 });
    if (value.trim()?.length > 0) {
      let list = GetStorageSync("kw");
      if (!list) {
        list = [];
      }
      let info = list?.find((item) => item === value);
      if (info) {
        return;
      }
      list = [value, ...list];
      list.splice(10, 1);
      SetStorageSync("kw", list);
      setKwList([...list]);
    }
  };
  const getCurrentSearch = (params) => {
    getIndexSearch(params).then((res) => {
      setDataList(res.data.list);
      setTimeout(() => {
        setLoading(false);
        setOption({ ...option, refresh: false, p: params.p, confirm: true });
      }, 500);
    });
  };
  const addScrollList = () => {
    getCurrentSearch({ kw: value, p: option.p + 1 });
  };
  const setInputValue = (e) => {
    setValue(e.detail.value);
    setOption({ ...option, confirm: false });
  };
  const addSearch = (title) => {
    setValue(title);
    setLoading(true);
    getCurrentSearch({ kw: title, p: 1 });
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
  const currentContext = useMemo(() => {
    if (loading) {
      return (
        <View className="loading_pla">
          <Loading size={60} />
        </View>
      );
    }
    if (dataList.length > 0) {
      return (
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
            lowerThreshold={30}
            onScrollToLower={addScrollList}
            onScroll={onScroll}
          >
            <View id="top" />
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
                      <Image src={item.img} mode="aspectFill" className="navi-data-item-img" />
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
                          <View>更新至第{item.updated_eps}集</View>
                        </View>
                      </View>
                    </View>
                  );
                })}
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
      );
    } else if (option.confirm) {
      return (
        <View className="placeholder">
          <NoneView />
        </View>
      );
    } else if (kwList.length > 0) {
      return (
        <View className="history">
          <View className="history-title">历史搜索</View>
          <View className="history-list">
            {kwList.map((item) => {
              return (
                <View
                  className="history-list-item"
                  onClick={() => addSearch(item)}
                >
                  {item}
                </View>
              );
            })}
          </View>
        </View>
      );
    }
  }, [dataList, kwList, value, option, loading]);
  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="搜索"
      />
      <View className="index_search">
        <Image mode="widthFix" src={search} className="index_search_img" />
        <View className="index_search_input">
          <Input
            className="index_search_input_value"
            placeholder="在此处搜索"
            value={value}
            onInput={setInputValue}
            onConfirm={getCurrentList}
          />
        </View>
        <View
          className="index_search_btn"
          hoverClass="index_search_hover"
          onClick={getCurrentList}
        >
          搜索
        </View>
      </View>
      {currentContext}
    </View>
  );
}
