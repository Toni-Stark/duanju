import {
  View,
  Image,
  Video,
  Button,
  MovableArea,
  MovableView,
} from "@tarojs/components";
import Taro, { useDidShow, useLoad, useRouter } from "@tarojs/taro";
import { AtButton, AtFloatLayout } from "taro-ui";
import "taro-ui/dist/style/components/loading.scss";
import "taro-ui/dist/style/components/float-layout.scss";
import "./index.less";
import { useEffect, useState } from "react";

import left from "../../static/icon/left.png";
import top from "../../static/icon/z_top.png";
import heart from "../../static/icon/heart.png";
import heart_g from "../../static/icon/heart_g.png";
import gets from "../../static/icon/get.png";
import getg from "../../static/icon/get_g.png";
import share_g from "../../static/icon/share-arrow.png";
import down from "../../static/icon/down.png";
import yuan from "../../static/icon/yuan.png";
import {
  getMemberShare,
  getMemberView,
  getVideoFavorite,
  getVideoIndex,
  getVideoPay,
  getVideoUpdate,
} from "@/common/interface";
import {THide, THideT, TShow} from "@/common/common";
import home from "@/static/icon/home.png";
import {getSystemInfo} from "@/common/tools";
import {SetStorage, SetStorageSync} from "@/store/storage";

let timePlay = 0;
let timerPlay = null;
let scrTop = 0;
let scrTimer = null;
export default function VideoView() {
  const pages = Taro.getCurrentPages();
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    videoHeight: 0,
    active: 1,
    screenWidth: 0,
    screenHeight: 0,
    more: false,
    refresh: false,
    title: "",
    type: "",
  });
  const [dataInfo, setDataInfo] = useState<any>(undefined);
  const [dataList, setDataList] = useState([
    {
      value: 0,
      icon: heart,
      icon_g: heart_g,
      check: 1,
    },
    {
      value: 0,
      icon: getg,
      icon_g: gets,
      check: 1,
    },
  ]);
  const [show, setShow] = useState(false);
  const [btnList, setBtnList] = useState([]);
  const [current, setCurrent] = useState<any>({
    page: 0,
    v_id: 1,
    b_list: [],
  });
  const [posInfo, setPosInfo] = useState({
    f_id: "",
    l_id: "",
  });
  const [position, setPosition] = useState({
    y: 0,
    top: 0,
  });
  const [currentInfo, setCurrentInfo] = useState(undefined);
  const [allList, setAllList] = useState([]);
  const [recording, setRecording] = useState(false);

  useDidShow(() => {
    const params: any = router.params;
    if (params?.pn) {
      SetStorage('pn', params?.pn).then(()=>{
        SetStorage('pn_data', params).then(()=>{
          getVideoList({ v_id: params.id, pn_data: JSON.stringify(params) });
        });
      });
    } else {
      getVideoList({ v_id: params.id });
    }
    let _option = option;
    _option.title = "";
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        _option.videoHeight = res.screenWidth / 0.72;
      },
    });
    setPosition({
      ...position,
      y: -2 - _option.screenHeight,
      top: -2 - _option.screenHeight,
    });
    setOption({ ..._option });
  });
  useEffect(() => {
    Taro.setVisualEffectOnCapture({
      visualEffect: 'hidden',
      success: ()=>{
        console.log('阻止截屏或录屏');
      }
    })
    // Taro.onUserCaptureScreen(function (res) {
    //   console.log('用户截屏了', res)
    // })
    // Taro.onScreenRecordingStateChanged(function (res) {
    //   console.log('用户录屏了', res);
    //   setRecording(true);
    // })
    return () => {
      clearInterval(timerPlay);
      timerPlay = null;
    };
  }, []);
  const getVideoList = (params) => {
    TShow("加载中...", "loading", 30000);
    getVideoIndex(params).then((res) => {
      let btnArr: any = [...dataList];
      const { info, list } = res.data;

      btnArr[0].value = info.like;
      btnArr[1].value = info.collect;
      btnArr[0].check = info?.is_liked ? 2 : 1;
      btnArr[1].check = info.is_collected ? 2 : 1;
      setDataInfo(info);
      setDataList([...btnArr]);
      let arr = [];
      let resData = [];
      for (let key in list) {
        let c_id = params?.current || info?.history_sub_id || list[key][0].id;
        arr.push({
          title: key,
          list: list[key],
        });
        for (let i in list[key]) {
          let v_info = list[key][i];
          resData.push(v_info);
          if (c_id == v_info.id) {
            getVideoUpdate({ v_s_id: v_info.id }).then((res)=>{
              console.log(res.data, '222');
              setCurrent({
                ...current,
                b_list: list[key],
                page: key,
                v_id: v_info.id,
              });
              v_info.url = res.data.url;
              setCurrentInfo(v_info);
            });
          }
        }
      }
      setPosInfo({
        f_id: resData[0].id,
        l_id: resData[resData.length - 1].id,
      });
      setBtnList(arr);
      setAllList(resData);
      THideT()
      Taro.useShareAppMessage((res) => {
        if (res.from === "button") {
          console.log(res.target);
        }
        return {
          title: info.name,
          path: "/pages/video/index",
        };
      });
    });
  };

  const chooseCurVideo = (down, up) => {
    let curInfo = currentInfo;
    let index = allList.findIndex((item) => item.id === curInfo.id);
    let info: any;
    if (down) {
      if (index < allList.length - 1) {
        info = allList[index + 1];
      }
    } else if (up) {
      if (index > 0) {
        info = allList[index - 1];
      }
    }
    if (info?.id && (down || up)) {
      chooseCurrent(info.id);
      setShow(false);
    }
  };

  const handleMovableViewStart = (e) => {
    let val = e.mpEvent.changedTouches[0].clientY;
    setPosition({
      ...position,
      top: val,
    });
  };
  // 处理 MovableView 的移动事件
  const handleMovableViewEnd = (e) => {
    let val = e.mpEvent.changedTouches[0].clientY;
    let down = val - position.top < -100;
    let up = val - position.top > 100;
    let num = -2 - option.screenHeight;
    let bool = num === position.y;
    if (bool) {
      num = -1 - option.screenHeight;
    }
    chooseCurVideo(down, up);
    setTimeout(() => {
      setPosition({
        ...position,
        y: num,
      });
    }, 100);
    stopPlay();
  };

  const naviBack = () => {
    Taro.navigateBack();
  };
  const naviHome = () => {
    Taro.switchTab({
      url: "/pages/index/index",
    });
  };

  const clickItemValue = (index, value) => {
    let list: any = dataList;
    let bool = value == 1 ? 2 : 1;
    if (value) {
      list[index].check = bool;
      if (value == 1) {
        list[index].value = Number(list[index].value) + 1;
      } else {
        list[index].value = Number(list[index].value) - 1;
      }
      setDataList([...list]);
    }
    currentVideoFavorite(index, bool);
  };
  const shareView = () => {
    getMemberShare({
      v_id: dataInfo.id,
      v_s_id: currentInfo.id,
    }).then((res) => {});
  };
  const openLayout = () => {
    let info = btnList.find((item) => item.title === current.page);
    setCurrent({ ...current, b_list: info.list });
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const currentListInfo = (id) => {
    let list = [];
    let info = btnList.find((item) => item.title === id);
    setCurrent({ ...current, b_list: info.list, page: id, data: list });
  };
  const naviToHotOne = () => {
    Taro.navigateTo({
      url: "../mine/wallet/recharge/index",
    });
  };

  const chooseCurrent = (val) => {
    let info = allList.find((item) => item.id === val);
    if (info) {
      getVideoUpdate({ v_s_id: info.id }).then((res) => {
        info.url = res.data?.url;
        setCurrentInfo(info);
      });
      setCurrent({ ...current, v_id: info.id });
    }
    if (!info.is_pay) {
      TShow("解锁中", "loading", 2000);
      setTimeout(() => {
        getVideoPay({ v_s_id: info.id }).then((res) => {
          if (res.code == 101) {
            naviToHotOne();
            return;
          } else if (res.code == 200) {
            THide();
            TShow("购买成功");
            getVideoList({ v_id: dataInfo.id, current: info.id });
            return;
          }
          THide();
        });
      }, 1400);
      return;
    }
    setShow(false);
    timePlay = 0;
  };

  const currentVideoFavorite = (ind, val) => {
    let act = ["", "del", "add"];
    let types = ["like", "collect"];
    getVideoFavorite({
      type: types[ind],
      act: act[val],
      v_id: dataInfo.id,
      v_s_id: currentInfo.id,
    }).then((res) => {});
  };
  const startPlay = async (e) => {
    clearInterval(timerPlay);
    timerPlay = null;
    timerPlay = setInterval(async () => {
      timePlay += 1;
      if (timePlay >= 15) {
        await getMemberView({ v_id: dataInfo.id, v_s_id: currentInfo.id });
        clearInterval(timerPlay);
        timePlay = 1;
      }
    }, 1000);
  };
  const stopPlay = () => {
    clearInterval(timerPlay);
    timerPlay = null;
    timePlay = 1;
  };
  const onEnded = () => {
    clearInterval(scrTimer);
    scrTimer = null;
    scrTimer = setInterval(() => {
      let u = 20;
      if (scrTop < 100) {
        scrTop += u;
        setPosition({ ...position, y: position.y - scrTop });
      } else {
        clearInterval(scrTimer);
        scrTimer = null;
        scrTop = 0;
        setTimeout(() => {
          let num = -2 - option.screenHeight;
          setPosition({ ...position, y: num });
          chooseCurVideo(true, false);
        }, 500);
      }
    }, 50);
  };
  return (
    <View className="index">
      <View
        className="index_header"
        style={{
          top: option.statusBarHeight + "Px",
          height: option.barHeight + "Px",
        }}
      >
        <View className="index_header_view">
          {pages.length > 1 ? (
            <Image
              mode="widthFix"
              className="index_header_view_img"
              src={left}
              onClick={naviBack}
            />
          ) : (
            <Image
              mode="widthFix"
              className="index_header_view_img"
              src={home}
              onClick={naviHome}
            />
          )}
          <View className="index_header_view_text">
            第{currentInfo?.name}集
          </View>
        </View>
      </View>
      <View className="index_footer" onClick={openLayout}>
        <View className="index_footer_text">
          《{dataInfo?.name}》·共{dataInfo?.episode}集
        </View>
        <Image mode="heightFix" className="index_footer_img" src={top} />
      </View>
      <View className="index_label">
        {dataList.map((res, index) => {
          let item: any = res;
          return (
            <View
              className="index_label_view"
              onClick={() => clickItemValue(index, item.check)}
              hoverClass="index_label_active"
            >
              <View className="view">
                <Image
                  className="img"
                  src={
                    item.check
                      ? item.check == 2
                        ? item.icon_g
                        : item.icon
                      : item.icon
                  }
                />
              </View>
              <View className="text">{item.value}</View>
            </View>
          );
        })}
        <Button
          className="index_label_view"
          openType="share"
          onClick={() => shareView()}
          hoverClass="index_label_active"
        >
          <View className="view">
            <Image className="img" src={share_g} />
          </View>
          <View className="text">分享</View>
        </Button>
      </View>
      <View className="index_content">
        <MovableArea className="mova">
          <MovableView
            className="mova-view"
            direction="vertical"
            y={position.y}
            damping={10}
            friction={2}
            inertia={false}
            outOfBounds={false}
            onTouchEnd={handleMovableViewEnd}
            onTouchStart={handleMovableViewStart}
          >
            {current.v_id != posInfo.f_id ? (
              <View className="before">
                <View className="center_footer" />
                <Image mode="aspectFill" className="before_image" src={dataInfo?.img} />
              </View>
            ) : (
              <View className="before" />
            )}
            <View id="targetPosition" />
            <View className="center" style={{height: option.screenHeight+3}}>
              {
                recording?<View className="center_recording">版权保护，请关闭录屏</View>:(
                  <View className="center_video">
                    {currentInfo?.url ? (
                      <Video
                        className="center_video_large"
                        src={currentInfo?.url}
                        poster={dataInfo?.img}
                        initialTime={0}
                        controls
                        onPlay={startPlay}
                        onPause={stopPlay}
                        onEnded={onEnded}
                        showPlayBtn
                        showFullscreenBtn={false}
                        autoplay
                        enablePlayGesture
                        showCenterPlayBtn
                        playBtnPosition="center"
                        loop={false}
                        objectFit="fill"
                      />
                    ) : (
                      <Image className="center_video_img" src={dataInfo?.img} />
                    )}
                  </View>
                )
              }
              <View className="center_footer" />
            </View>
            {current.v_id != posInfo.l_id ? (
              <View className="after">
                <Image mode="aspectFill" className="after_image" src={dataInfo?.img} />
              </View>
            ) : (
              <View className="after" />
            )}
          </MovableView>
        </MovableArea>
      </View>
      <AtFloatLayout isOpened={show} onClose={handleClose}>
        <View className="layout">
          <View className="layout_header">
            《{dataInfo?.name}》 · 共{dataInfo?.episode}集
            <Image
              mode="widthFix"
              onClick={handleClose}
              className="layout_header_img"
              src={down}
            />
          </View>
          <View className="layout_button">
            {btnList.map((item, index) => {
              return (
                <AtButton
                  className={item.title === current.page ? "active" : ""}
                  key={index}
                  type="primary"
                  size="normal"
                  onClick={() => {
                    currentListInfo(item.title);
                  }}
                >
                  {item.title}
                </AtButton>
              );
            })}
            <View className="button-pad" />
          </View>
          <View className="layout_list">
            {current.b_list.map((item) => {
              return (
                <View
                  className="layout_list_item"
                  style={{
                    background:
                      item.id === currentInfo.id
                        ? "linear-gradient(to right, #a829e8, #3c6fef);"
                        : "#3e4150",
                  }}
                  onClick={() => chooseCurrent(item.id)}
                >
                  {item.name}
                  {!item?.is_pay ? (
                    <Image className="layout_list_item_img" src={yuan} />
                  ) : null}
                </View>
              );
            })}
          </View>
          <View className="layout_bar" />
        </View>
      </AtFloatLayout>
    </View>
  );
}
