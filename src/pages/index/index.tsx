import {
  View,
  Text,
  ScrollView,
  Image,
  Video,
  Swiper, SwiperItem,
} from "@tarojs/components";
import Taro, { useDidShow, useLoad, useRouter } from "@tarojs/taro";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useMemo, useState } from "react";
import search from "../../static/icon/search.png";
import right from "../../static/icon/right.png";
import top from "../../static/icon/top.png";
import { AtButton } from "taro-ui";
import {
  getIndexActRecord,
  getIndexBanner,
  getIndexClassify,
  getIndexClassifyList,
  getIndexRecommend,
  getIndexRecommendList,
  getIndexTags, getIndexTagsVideo,
  getVideoMessage,
} from "@/common/interface";
import { Loading } from "@/components/loading";
import { IndexCard } from "@/components/indexCard";
import { IndexVideo } from "@/components/IndexVideo";
import { setInterFun } from "@/common/tools";
import {GetStorageSync, SetStorageSync} from "@/store/storage";
import {FloatView} from "@/components/floatView";
import {NoneView} from "@/components/noneView";

export default function Index() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    active: 88,
    screenWidth: 0,
    screenHeight: 0,
    refresh: false,
    p: 1
  });
  const [pch, setPch] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [recommend, setRecommend] = useState([]);
  const [headerVideo, setHeaderVideo] = useState<any>(undefined);
  const [btnList, setBtnList] = useState([]);
  const [reComm, setReCmm] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [bannerList, setBannerList] = useState([]);

  const [message, setMessage] = useState<any>(undefined);
  const [showNew, setShowNew] = useState(false);
  const [videoElement, setVideoElement] = useState<any>(["#video", true]);
  const [video1Element, setVideo1Element] = useState<any>(["#video_1", false]);
  const [video2Element, setVideo2Element] = useState<any>(["#video_2", false]);

  const handleScrollTop = () => {
    setScrollTop(scrollTop ? 0 : 1);
  };
  useLoad(() => {
    Taro.getPrivacySetting({
      success: (res)=>{
        if(res.needAuthorization){
        }
      }
    })
    const params = router.params;
    if (params?.scene) {
      let sn = decodeURIComponent(params.scene);
      SetStorageSync("sn", sn.split("=")[1]);
    }
    if (params?.iv) {
      let sn = decodeURIComponent(params.iv);
      SetStorageSync("sn", sn);
    }
    // 屏幕尺寸基础数据
    Taro.getSystemInfoAsync({
      success: (res) => {
        let _option = option;
        const rect = Taro.getMenuButtonBoundingClientRect();
        _option.barHeight = rect.top;
        _option.statusBarHeight = rect.height;
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        setOption({ ..._option });
      },
    });
    // ios兼容
    Taro.getSystemInfo({
      success: function (result) {
        const rect = Taro.getMenuButtonBoundingClientRect();
        if (
          result.platform === "devtools" ||
          result.platform === "android" ||
          result.platform === "ios"
        ) {
          setPch(0);
        } else {
          setPch(rect.height);
        }
      },
    });
    currentRecommendInfo()
    setInterFun(() => {
      currentRecommendInfo()
    });

    // 新剧推荐接口
    let time = GetStorageSync("time");
    if(time && new Date().getTime()-time>=28800000){
      getVideoMessage().then((res)=>{
          SetStorageSync("time", new Date().getTime());
          setMessage(res.data);
          setShowNew(!!res.data?.video_id);
      })
    }
  });

  const currentFraList = async (list, callback) => {
    let arr = [];
    async function getInfo(li, nu) {
      if (nu >= li.length) {
        callback(arr);
        return;
      }
      let result = await getIndexTagsVideo({ tag_id: li[nu].id });
      li[nu].video_list = result.data.video_list;
      arr.push(li[nu]);
      await getInfo(li, nu + 1);
    }
    await getInfo(list, 0);
  };

  // 刷新Recommend列表
  const currentRecommendInfo = () => {
    getIndexRecommend().then((res) => {
      let arr = res.data;
      setRecommend(arr);
      if (arr.length > 0) {
        setHeaderVideo(arr[0]);
      }
      setTimeout(() => {
        setLoading1(true);
      }, 300);
    });
  }
  // 刷新Tag列表
  const currentTagListInfo = (param) => {
    getIndexTags({ is_main: "1", p: param.p }).then(async (res) => {
      let arr = tagsData;
      let data = res.data.tag_list
      if(option.p<param.p){
        arr = arr.concat(data);
      } else {
        arr = data;
      }
      setTagsData(arr)
      setOption({...option, p: param.p});
    });
  }
  // 刷新RecommendList列表
  const currentRecommendListInfo = () => {
    currentRecommendList(88).then(() => {
      getIndexClassifyList().then((res) => {
        setBtnList([...res.data]);
        setTimeout(() => {
          setLoading2(true);
        }, 300);
      });
    });
  }
  // 刷新轮播列表
  const currentBannerListInfo = () => {
    getIndexBanner().then((res) => {
      if (res.code === 200) {
        setBannerList(res.data);
      }
    });
  }

  useDidShow(() => {
    currentRecommendListInfo();
    currentTagListInfo({p: 1});
    currentBannerListInfo()
  });
  const refreshChange = () => {
    setOption({ ...option, refresh: true });
    currentRecommendInfo()
    currentRecommendListInfo()
    currentBannerListInfo()
    currentTagListInfo({p: 1})
  };
  const addScrollList = () => {
    currentTagListInfo({p: option.p+1});
  }
  const currentRecommendList = async (id) => {
    let result = await getIndexRecommendList();
    setReCmm(result.data.video_list);
    setOption({ ...option, active: id });
  };
  const currentList = async ({ classify, p }) => {
    let result = await getIndexClassify({ class_id: classify, p });
    setReCmm(result.data.list);
    setOption({ ...option, active: classify });
  };
  const setActive = (id) => {
    if (id == 88) {
      currentRecommendList(88);
    } else {
      currentList({ classify: id, p: 1 });
      getIndexActRecord({frame: '1', act: '1', target_id: id});
    }
  };
  const onScroll = (e) => {
    let top = e.detail.scrollTop;
    if (scrollOpacity === 0 && top >= option.screenHeight) {
      setScrollOpacity(1);
    }
    if (scrollOpacity > 0 && top < option.screenHeight) {
      setScrollOpacity(0);
    }
    let screenHeight = option.screenHeight-option.barHeight-option.statusBarHeight;

    listenScrollVideo(videoElement,-500, 100, (res)=>{
      setVideoElement(res)
    });
    listenScrollVideo(video1Element,-350, screenHeight, (res)=>{
      setVideo1Element(res)
    });
    listenScrollVideo(video2Element,-350, screenHeight, (res)=>{
      setVideo2Element(res)
    });

  };
  // 监听页面滚动位置控制视频播放暂停
  const listenScrollVideo = (element,top, height=0, callback) => {
    const query = Taro.createSelectorQuery();
    query.selectAll(element[0]).boundingClientRect()
    query.exec((res) => {
      let num = res[0][0].top;
      if((num-height > -30  ||num<top) && element[1]){
        Taro.createVideoContext(element[0].split('#')[1]).pause();
        element[1] = false;
        callback(element)
      }else if((num-height <= -30 && num>=top) && !element[1]){
        Taro.createVideoContext(element[0].split('#')[1]).play();
        element[1] = true;
        callback(element)
      }
    })
  }

  const naviToCateOne = (type, title) => {
    Taro.navigateTo({
      url: "./cate/index?type=" + type + "&title=" + title,
    });
  };

  const naviToSearch = (type) => {
    Taro.navigateTo({
      url: "./search/index?type=" + type,
    });
  };
  const naviToVideo = (id) => {
    if(!id) return;
    Taro.navigateTo({
      url: "../video/index?id=" + id,
    });
    setShowNew(false)
  };
  const naviToVideoUp = (id) => {
    if(!id) return;
    Taro.navigateTo({
      url: "../video_up/index?id=" + id,
    });
    setShowNew(false)
  };

  const currentSwiper = useMemo(() => {
    if (bannerList.length <= 0) {
      return null;
    }
    return (
      <View className="swiper-view">
        <Swiper
          className="swiper-view-views"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          autoplay
        >
          {bannerList.map((item, index) => {
            return (
              <SwiperItem>
                <View className="swiper-view-views-item" onClick={()=>{
                  naviToVideoUp(item.video_id)
                }}>
                  <Image className="img" src={item.img} />
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
      </View>
    );
  }, [bannerList]);

  // 新剧内容
  const currentHeader = useMemo(() => {
    if (!headerVideo && !loading1) {
      return (
        <View className="loading_pla">
          <Loading size={80} />
        </View>
      );
    } else if (headerVideo?.url) {
      return (
        <>
          <Video
            id="video"
            className="components-video-video"
            src={headerVideo?.url}
            poster={headerVideo?.img}
            initialTime={0}
            controls={false}
            autoplay={true}
            enable-progress-gesture={false}
            muted
            loop
            onClick={() => naviToVideoUp(headerVideo?.id)}
            objectFit="cover"
            showFullscreenBtn={false}
            enablePlayGesture
            showCenterPlayBtn
            playBtnPosition="center"
          />
          <View className="components-video-shadow" />
          <View
            className="components-video-card"
            onClick={() => naviToVideoUp(headerVideo?.id)}
          >
            <Image
              className="components-video-card-image"
              src={headerVideo?.img}
            />
            <View className="components-video-card-content">
              <Text className="title">{headerVideo?.name}</Text>
              <Text className="text">{headerVideo?.describe}</Text>
            </View>
          </View>
        </>
      );
    }
  }, [headerVideo, loading1]);
  // 推荐按钮列表
  const currentLarContent = useMemo(() => {
    if (!loading2) {
      return (
        <View className="loading_lar">
          <Loading size={40} />
        </View>
      );
    } else {
      return (
        <View className="components-video-buttons">
          <AtButton
            className={88 === option.active ? "active" : ""}
            type="primary"
            size="normal"
            onClick={() => {
              setActive(88);
            }}
          >
            推荐
          </AtButton>
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
      );
    }
  }, [btnList, loading2, option.active]);
  // 推荐和其他内容列表
  const currentTeTContent = useMemo(() => {
    if (!loading2) {
      return (
        <View className="loading_lar">
          <Loading size={40} />
        </View>
      );
    } else if (reComm.length > 0) {
      return (
        <View className="components-video-scroll">
          <View className="scroll_view_style">
            <View className="scroll-list">
              {reComm.map((item, index) => {
                return (
                  <View
                    key={index}
                    className="scroll-list-item"
                    onClick={() => {
                      // naviToVideo(item.id);
                      naviToVideoUp(item?.id)
                    }}
                  >
                    <Image
                      src={item.img}
                      className="scroll-list-item-img"
                    />
                    <Text
                      numberOfLines={1}
                      className="scroll-list-item-text"
                    >
                      {item.name}
                    </Text>
                  </View>
                );
              })}
              <View className="button-pad" />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View className="components-video-scroll center">
          <NoneView />
        </View>
      )
    }
  }, [reComm, loading2]);

  return (
    <View className="index">
      <View className="index_zone">
        <ScrollView
          className="index_zone_view"
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          enhanced
          onScroll={onScroll}
          refresherEnabled
          refresherTriggered={option.refresh}
          refresherBackground="#1e212a"
          lowerThreshold={60}
          onRefresherRefresh={refreshChange}
          onScrollToLower={addScrollList}
        >
          <View
            className="index_zone_view_header"
            style={{
              marginTop: pch + option.barHeight,
              height: option.statusBarHeight,
              paddingLeft: 20
            }}
          >
            <Image
              mode="widthFix"
              className="index_zone_view_header_img"
              src={search}
              onClick={naviToSearch}
            />
          </View>
          <View className="index_zone_view_content">
            <View className="components-video">{currentHeader}</View>
            <View className="components-video-lar">
              <Text className="components-video-lar-text">看你想看</Text>
              <View
                className="components-video-lar-link"
                onClick={() => {
                  naviToCateOne(1, "更多分类");
                }}
              >
                更多分类
                <Image
                  mode="widthFix"
                  className="components-video-lar-link-icon"
                  src={right}
                />
              </View>
            </View>
            {currentLarContent}
            {currentTeTContent}
            {tagsData.length > 0 ? (
              <IndexCard data={tagsData[0]} />
            ) : null}
            {recommend.length >= 2 ? (
              <IndexVideo height={option.screenWidth} data={recommend[1]} id="video_1" />
            ) : null}
            {tagsData.length > 1 ? (
              <IndexCard data={tagsData[1]} />
            ) : null}
            {currentSwiper}
            {recommend.length >= 3 ? (
              <IndexVideo height={option.screenWidth} data={recommend[2]} id="video_2" />
            ) : null}
            {tagsData.map((item, index) => {
              if (index > 1) {
                return <IndexCard data={item} />;
              }
            })}
            <View className="zone_footer" />
          </View>
        </ScrollView>
        <View
          className="scroll_top"
          style={{ opacity: scrollOpacity }}
          onClick={handleScrollTop}
        >
          <Image className="scroll_top_img" src={top} />
        </View>
        <FloatView
          show={showNew}
          naviVideo={(id)=>{naviToVideoUp(id)}}
          clickFun={()=>{setShowNew(false)}}
          img={message?.img}
          text={message?.video_name}
          title={message?.title}
          id={message?.video_id}
        />
      </View>
    </View>
  );
}
