import {
  View,
  Image,
  Video,
  Button,
  MovableArea,
  MovableView,
} from "@tarojs/components";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { AtButton, AtFloatLayout } from "taro-ui";
import "taro-ui/dist/style/components/loading.scss";
import "taro-ui/dist/style/components/float-layout.scss";
import "./index.less";
import {useEffect, useMemo, useState} from "react";

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
import {THide, TShow} from "@/common/common";
import home from "@/static/icon/home.png";
import { GetStorageSync, SetStorage, SetStorageSync} from "@/store/storage";

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
    if (params?.iv) {
      let sn = decodeURIComponent(params.iv);
      SetStorageSync("sn", sn);
    }
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
    // TShow("加载中...", "loading", 30000);
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
      let c_id = params?.current || info?.history_sub_id;
      if(GetStorageSync("currentStatus")){
        if(!params.current && info?.history_sub_id) {
          SetStorageSync("currentStatus", "");
          c_id = list[Object.keys(list)[0]][0].id;
        }
      }
      if(GetStorageSync("currentHand")) {
        SetStorageSync("currentHand", "");
        if (GetStorageSync("nowValPay") == "1") {
          c_id = GetStorageSync("nowVal");
          SetStorageSync("nowVal", 0)
          SetStorageSync("nowValPay", 0)
        }
      }
      if(!c_id) {c_id = list[Object.keys(list)[0]][0].id};
      for (let key in list) {
        arr.push({
          title: key,
          list: list[key],
        });
        for (let i in list[key]) {
          let v_info = list[key][i];
          resData.push(v_info);
          if (c_id == v_info.id) {
            if (!v_info.is_pay) {
              TShow("解锁中", "loading", 2000);
              setTimeout(() => {
                getVideoPay({ v_s_id: v_info.id }).then((res) => {
                  if (res.code == 101) {
                    naviToHotOne(info);
                    if(!params.current && info?.history_sub_id) {
                      SetStorageSync("currentStatus", info?.history_sub_id);
                    }
                    return;
                  } else if (res.code == 200) {
                    THide();
                    TShow("购买成功");
                    getVideoList({ v_id: info.id, current: v_info.id });
                    return;
                  }
                  THide();
                });
              }, 1400);
              return;
            }
            getVideoUpdate({ v_s_id: v_info.id }).then((res)=>{
              setCurrent({
                ...current,
                b_list: list[key],
                page: key,
                v_id: v_info.id,
              });
              v_info.url = res.data?.url;
              // if(!v_info?.url){
              //   TShow("请联系");
              // }
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
      // THideT()

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
  const naviToHotOne = (info?: any) => {
    SetStorageSync("nowVal", info?.id);
    Taro.navigateTo({
      url: "../mine/wallet/recharge/index?is_pay="+(info?.spend_score ||dataInfo.spend_score),
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
      TShow("解锁中", "loading", 3000);
      setTimeout(() => {
        getVideoPay({ v_s_id: info.id }).then((res) => {
          if (res.code == 101) {
            naviToHotOne(info);
            SetStorageSync("currentHand", info?.id);
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
  // 返回按钮
  const backBtnView = useMemo(() => {
    return (
      <Image
        mode="widthFix"
        className="index_header_view_img"
        src={pages.length > 1 ?left:home}
        onClick={pages.length > 1 ?naviBack:naviHome}
      />
    )
  }, [pages])
  // 视频前置图片
  const currentViewEven = useMemo(() => {
    if(current.v_id != posInfo.f_id) {
      return (
        <View className="before">
          <View className="center_footer"/>
          <Image mode="aspectFill" className="before_image" src={dataInfo?.img}/>
        </View>
      );
    } else {
      return (<View className="before" />);
    }
  }, [current.v_id, posInfo.f_id, dataInfo?.img]);
  // 视频组件
  const currentVideo = useMemo(() => {
    if(recording) {
      return (<View className="center_recording">版权保护，请关闭录屏</View>)
    } else {
      return (
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
  }, [recording, dataInfo?.img, currentInfo?.url])
  // 视频后置图片
  const currentViewNext = useMemo(()=>{
    if(current.v_id != posInfo.l_id){
      return (
        <View className="after">
          <Image mode="aspectFill" className="after_image" src={dataInfo?.img} />
        </View>
      )
    } else {
      return (
        <View className="after" />
      )
    }
  }, [current.v_id, posInfo.l_id, dataInfo?.img])
  // 弹窗视频列表
  const currentListContext = useMemo(()=>{
    return (
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
    )
  }, [show, dataInfo, btnList, current, currentInfo])
  return (
    <View className="index">
      {/* 返回按钮和标题 */}
      <View
        className="index_header"
        style={{
          top: option.statusBarHeight + "Px",
          height: option.barHeight + "Px",
        }}
      >
        <View className="index_header_view">
          {backBtnView}
          <View className="index_header_view_text">
            第{currentInfo?.name}集
          </View>
        </View>
      </View>
      {/* 视频列表选择框 */}
      <View className="index_footer" onClick={openLayout}>
        <View className="index_footer_text">
          《{dataInfo?.name}》·共{dataInfo?.episode}集
        </View>
        <Image mode="heightFix" className="index_footer_img" src={top} />
      </View>
      {/* 点赞收藏框 */}
      <View className="index_label">
        {dataList.map((item, index) => {
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
      {/* 视频滑动模块 */}
      <View className="index_content">
        <MovableArea className="movable">
          <MovableView
            className="movable-view"
            direction="vertical"
            y={position.y}
            damping={10}
            friction={2}
            inertia={false}
            outOfBounds={false}
            onTouchEnd={handleMovableViewEnd}
            onTouchStart={handleMovableViewStart}
          >
            {currentViewEven}
            {/* 滚动定位位置 */}
            <View id="targetPosition" />
            <View className="center" style={{height: option.screenHeight+3}}>
              {currentVideo}
              <View className="center_footer" />
            </View>
            {currentViewNext}
          </MovableView>
        </MovableArea>
      </View>
      {currentListContext}
    </View>
  );
}
