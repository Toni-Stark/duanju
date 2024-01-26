import { Image, ScrollView, Video, View } from "@tarojs/components";
import Taro, {useDidShow, useLoad} from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useMemo, useState } from "react";
import top from "../../static/icon/top.png";
import {
  getFavorite, getIndexChasingCount,
  getIndexRecommend,
  getVideoHistory,
} from "@/common/interface";
import { Loading } from "@/components/loading";
import { HeaderView } from "@/components/headerView";
import { NoneView } from "@/components/noneView";

export default function List() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    videoHeight: 0,
    screenWidth: 0,
    screenHeight: 0,

    habit: 1,
    refresh: false,
  });
  const [loading, setLoading] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [btnList, setBtnList] = useState([
    {
      title: "历史",
      type: 1,
      count: 0,
    },
    {
      title: "点赞",
      type: 2,
      count: 0,
    },
    {
      title: "收藏",
      type: 3,
      count: 0,
    },
  ]);
  const [newData, setNewData] = useState<any>([]);

  const [staticInfo, setStaticInfo] = useState({
    list: [],
    p: 1,
    count: 0
  });
  const [headerInfo, setHeaderInfo] = useState(undefined);

  useLoad(async () => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.top;
    _option.statusBarHeight = rect.height;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        _option.videoHeight = res.screenWidth / 0.72;
      },
    });
    setOption({ ..._option });

    // await getDefaultList();

    // await historyList({p: 1});
  });
  useDidShow(()=>{
    if(staticInfo.p<=1){
      currentTab(option.habit, staticInfo.p);
    }
    getTabList()
  })

  const historyList = (params) => {
    getVideoHistory(params).then((res) => {
      if (res.code !== 200) return;
        let list = staticInfo.list;
        let data = res.data;
        if (data?.count > 0) {
          if(staticInfo.p<params.p){
            list = list.concat(data.history_list);
          } else {
            list = data.history_list;
          }
          setStaticInfo({p: params.p, list: list, count: list.length});
          setNewData(list);
          if(!headerInfo){
            setHeaderInfo({
              video_url: list[0].video_url,
              video_img: list[0].video_img,
              video_id: list[0].video_id,
              class_name: list[0].video_name,
              video_name: list[0].class_name,
              watching: list[0].watching,
            })
          }
          setOption({
            ...option,
            habit: 1,
            refresh: false,
          })
          setLoading(true);
        } else if (params.p == 1) {
          getRecommendList()
        }
    });
  };

  const getRecommendList = () => {
    getIndexRecommend().then((result) => {
      let data = result.data[0];
      if(!headerInfo){
        setHeaderInfo({
          video_url: data.url,
          video_img: data.img,
          video_id: data.video_id,
          class_name: data.describe,
          video_name: data.name,
          watching: data.view,
        })
      }
      setLoading(true);
    });
  }

  const favoriteList = (params, habit) => {
      getFavorite(params).then((res) => {
        if (res.code !== 200) return;
          let list = newData;
        let data = res.data;
        if(staticInfo.p<params.p){
            list = list.concat(data.favorite_list);
          } else {
            list = data.favorite_list;
          }
          setStaticInfo({p: params.p, list: list, count: list.length});
          setNewData(list);
          setOption({...option, refresh: false, habit})
      });
  };

  const onScroll = (e) => {
    if (scrollOpacity === 0 && e.detail.scrollTop >= option.screenHeight) {
      setScrollOpacity(1);
    }
    if (scrollOpacity > 0 && e.detail.scrollTop < option.screenHeight) {
      setScrollOpacity(0);
    }
  };

  const getTabList = () => {
    getIndexChasingCount().then((res)=>{
      let list = btnList;
      let data = res.data;
      list[0].count = data.history_count;
      list[1].count = data.like_count;
      list[2].count = data.favorite_count;
      setBtnList(list)
    })
  }

  const currentTab = (type, p= 0) => {
    if(type == 1) {
      historyList({p: p||1})
    } else if (type == 2) {
      favoriteList({p: p||1, type: 2}, type)
    } else if (type == 3) {
      favoriteList({p: p||1, type: 1}, type)
    }
  };
  const addScrollList = () => {
    currentTab(option.habit, staticInfo.p+1)
  };
  const refreshChange = () => {
    setOption({ ...option, refresh: true });
    currentTab(option.habit)
    getTabList()
  };

  const naviToVideo = (id) => {
    Taro.navigateTo({
      url: "../video/index?id=" + id,
    });
  };
  const naviToVideoUp = (id) => {
    Taro.navigateTo({
      url: "../video_up/index?id=" + id,
    });
  };

  const currentHeader = useMemo(() => {
    if (!loading) {
      return (
        <View className="loading_pla">
          <Loading size={80} />
        </View>
      );
    } else {
      return (
        <>
          <View
            className="components-video-large"
            onClick={() => {
              naviToVideoUp(headerInfo?.video_id);
            }}
          >
            <Video
              className="components-video-large-video"
              style={{ height: option.screenWidth + "px" }}
              src={headerInfo?.video_url}
              poster={headerInfo?.video_img}
              initialTime={0}
              controls={false}
              autoplay
              enable-progress-gesture={false}
              muted
              showPlayBtn
              showFullscreenBtn={false}
              enablePlayGesture
              showCenterPlayBtn
              playBtnPosition="center"
              loop={false}
              objectFit="cover"
            />
            <View className="components-video-large-content">
              <View className="large-content-main">
                <View className="large-content-main-title">
                  {headerInfo?.class_name}
                </View>
                <View className="large-content-main-eval">
                  {headerInfo?.video_name}
                </View>
              </View>
              <text className="large-content-count">
                {headerInfo?.watching || 0}人正在看
              </text>
            </View>
          </View>
        </>
      );
    }
  }, [headerInfo, loading]);
  const currentContent = useMemo(() => {
    if (!loading) {
      return (
        <View className="loading_con">
          <Loading size={40} />
        </View>
      );
    } else {
      return (
        <>
          {newData.map((item) => {
            return (
              <View
                className="components-video-list-item"
                onClick={() => {
                  naviToVideoUp(item.video_id);
                }}
              >
                <Image className="image" src={item.video_img} />
              </View>
            );
          })}
        </>
      );
    }
  }, [newData, loading]);
  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        search
        text="追剧"
        url="../index/search/index"
      />
      <View className="index_zone">
        <ScrollView
          className="index_zone_view"
          scrollY
          scrollWithAnimation
          refresherEnabled
          refresherTriggered={option.refresh}
          refresherBackground="#1e212a"
          onRefresherRefresh={refreshChange}
          enhanced
          onScroll={onScroll}
          lowerThreshold={30}
          onScrollToLower={addScrollList}
        >
          <View className="index_zone_view_content">
            <View
              className="components-video"
              style={{ height: option.videoHeight + "Px" }}
            >
              {currentHeader}
              <View className="components-video-list">
                <View className="components-video-list-tabs">
                  {btnList.map((item) => {
                    return (
                      <View
                        className="components-video-list-tabs-tab"
                        style={{
                          color:
                            option.habit === item.type ? "#ffffff" : "#888888",
                        }}
                        onClick={() => currentTab(item.type)}
                      >
                        {item.title}
                        {item?.count || ""}
                        {option.habit === item.type ? (
                          <View className="components-video-list-tabs-tab-line" />
                        ) : null}
                      </View>
                    );
                  })}
                </View>
                {currentContent}
              </View>
              {newData.length > 0 ? (
                <View className="components-video-more">暂无更多</View>
              ) : (
                <View
                  style={{
                    height: "20Vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NoneView />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <View className="scroll_top" style={{ opacity: scrollOpacity }}>
          <Image className="scroll_top_img" src={top} />
        </View>
      </View>
      {/*<View className="index_footer" />*/}
    </View>
  );
}
