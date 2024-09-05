import {
  View,
  Image,
  Video,
  Button,
  Swiper,
  SwiperItem, Text,
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
  getMemberView, getPayOrder, getPayStatus,
  getVideoFavorite,
  getVideoIndex,
  getVideoPay,
  getVideoUpdate,
} from "@/common/interface";
import {THide, THideT, TShow} from "@/common/common";
import home from "@/static/icon/home.png";
import {GetStorageSync, RemoveStorageSync, SetStorage, SetStorageSync} from "@/store/storage";
import {setTimFun} from "@/common/tools";

let timePlay = 0;
let timerPlay = null;
export default function VideoView() {
  const pages = Taro.getCurrentPages();
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    active: 1,
    more: false,
    refresh: false,
    title: "",
    type: "",
  });
  const [fivList, setFivList] = useState([
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
  const [dataInfo, setDataInfo] = useState(undefined);
  const [pageList, setPageList] = useState(undefined);
  const [allList, setAllList] = useState(undefined);

  const [current, setCurrent] = useState<any>({
    page: 0,
    v_id: 1,
    b_list: [],
  });
  const [currentInfo, setCurrentInfo] = useState(undefined);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  let userInfo: any = GetStorageSync("allJson");
  Taro.useShareAppMessage((res) => {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: dataInfo.name,
      path: "/pages/video_up/index?id="+dataInfo.id+"&iv="+userInfo.sn,
    };
  });
  useDidShow(() => {
    const params: any = router.params;
    console.log(params, 'log');
    if (params?.iv) {
      let sn = decodeURIComponent(params.iv);
      SetStorageSync("sn", sn);
    }
    if (params?.pn) {
      SetStorage('pn', params?.pn).then(()=>{
        SetStorage('pn_data', params).then(()=>{
          setLoading(true)
          getVideoList({ v_id: params.id, pn_data: JSON.stringify(params) });
        });
      });
    } else {
      setLoading(true)
      getVideoList({ v_id: params.id });
    }

    let _option = option;
    _option.title = "";
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });
  });
  useEffect(() => {
    Taro.setVisualEffectOnCapture({
      visualEffect: 'hidden',
      success: ()=>{
        console.log('阻止截屏或录屏');
      }
    })
    return () => {
      clearInterval(timerPlay);
      timerPlay = null;
    };
  }, []);
  const getVideoList = (params) => {
    getVideoIndex(params).then((res) => {
      const {info, list} = res.data;

      settingBtn(info)

      setDataInfo(info);

      let c_id = params?.current || info?.history_sub_id;
      if (!c_id) {
        c_id = list[Object.keys(list)[0]][0].id
      }
      let b_list = [];
      let page = undefined
      for (let item in list) {
        if (list.hasOwnProperty(item)) {
          b_list.push({
            title: item,
            list: list[item]
          })
        }
      }
      setPageList(b_list);

      let obj = undefined
      b_list.find((i) => {
        let res = i.list.find((j) => {
          return j.id == c_id;
        })
        if (res) {
          obj = res;
          page = i.title;
        }
      });
      let r_data = [];
      b_list.map((a) => {
        a?.list.map((j) => {
          r_data.push(j)
        })
      })
      setAllList([...r_data]);
      if(GetStorageSync("currentStatus")){
        if(!params.current && info?.history_sub_id) {
          SetStorageSync("currentStatus", "");
          c_id = list[Object.keys(list)[0]][0].id;
        }
      }
      if(GetStorageSync("currentHand")) {
        RemoveStorageSync("currentHand");
        if (GetStorageSync("nowValPay") == "1") {
          c_id = GetStorageSync("nowVal");
          RemoveStorageSync("nowVal")
          RemoveStorageSync("nowValPay")
        }
      } else {
        RemoveStorageSync("currentHand");
      }
      RemoveStorageSync("nowVal")

      let ind: any = r_data.findIndex((item) => {
        return item.id == c_id
      });
      let currInfo = r_data[ind];

      if(currInfo.id != c_id) return;
      if(!currInfo?.is_pay) {
        TShow("解锁中", "loading", 2000);
        setTimFun(() => {
          getVideoPay({v_s_id: currInfo.id}).then((res) => {
            if (res.code == 101) {
              THideT()
              naviToHotOne(info);
              if (!params.current && info?.history_sub_id) {
                SetStorageSync("currentStatus", info?.history_sub_id);
              }
              return;
            } else if (res.code == 200) {
              THideT();
              TShow("购买成功");
              getVideoList({v_id: info.id, current: currInfo.id, index: params.index});
              return;
            }
            THide();
          })
        }, 400)
        return;
      }
      getVideoUpdate({v_s_id: currInfo.id}).then((res) => {
        setCurrent({
          ...current,
          b_list: list[page],
          page: page,
          v_id: currInfo.id,
        });
        currInfo.url = res.data?.url;
        setCurrentInfo(currInfo);
        setIndex(params?.index||0);
        setTimFun(() => {
          setIndex(ind);
          setLoading(false)
        },200)
      });
      return;
    })
  }

  // 设置点赞收藏按钮
  const settingBtn = (info) => {
    let btnArr: any = [...fivList];
    btnArr[0].value = info.like;
    btnArr[1].value = info.collect;
    btnArr[0].check = info?.is_liked ? 2 : 1;
    btnArr[1].check = info.is_collected ? 2 : 1;
    setFivList([...btnArr]);
  }

  const naviBack = () => {
    Taro.navigateBack();
  };
  const naviHome = () => {
    Taro.switchTab({
      url: "/pages/index/index",
    });
  };


  const clickItemValue = (index, value) => {
    let list: any = fivList;
    let bool = value == 1 ? 2 : 1;
    if (value) {
      list[index].check = bool;
      if (value == 1) {
        list[index].value = Number(list[index].value) + 1;
      } else {
        list[index].value = Number(list[index].value) - 1;
      }
      setFivList([...list]);
    }
    currentVideoFavorite(index, bool);
  };
  const shareView = () => {
    getMemberShare({
      v_id: dataInfo.id,
      v_s_id: currentInfo.id,
    }).then(() => {});

  };

  const handleClose = () => {
    setShow(false);
  };

  const naviToHotOne = (info?: any) => {
    SetStorageSync("nowVal", info?.id);
    Taro.navigateTo({
      url: "../mine/wallet/recharge/index?is_pay="+(info?.spend_score ||dataInfo.spend_score),
    });
  };
  const openLayout = () => {
    setIsShowModal(true);
    return;
    let info = pageList.find((item) => item.title === current.page);
    setCurrent({ ...current, b_list: info.list });
    setShow(true);
  };
  const chooseCurrent = (val) => {
    let info = allList.find((item) => item.id === val);
    let ind = allList.findIndex((item) => item.id === val);
    if(ind-index>=2||ind-index<=-2){
      setLoading(true)
    }
    if (info) {
      getVideoUpdate({ v_s_id: info.id }).then((res) => {
        info.url = res.data?.url;
        setCurrentInfo(info);
        setIndex(ind);
        setLoading(false)
      });
      setCurrent({ ...current, v_id: info.id });
    }
    if (!info.is_pay) {
      setLoading(true)
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
            getVideoList({ v_id: dataInfo.id, current: info.id, index: ind });
            return;
          }
          THide();
        });
      }, 500);
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
    }).then(() => {});
  };
  const startPlay = async () => {
    clearInterval(timerPlay);
    // 15秒发送一次请求更新观看次数
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
  };
  const onEnded = () => {
    if(index >= allList.length) return;
    let info = allList[index+1];
    getVideoList({ v_id: dataInfo.id, current: info.id, index: index+1 });
  };
  const swiperChange = (e) => {
    let val = e.detail.current;
    let info = allList[val];
    if(info.id == currentInfo.id || loading) return;
    // getVideoList({ v_id: dataInfo.id, current: info.id, index: val });
    chooseCurrent(info.id)
  }
  const currentChange = (id) => {
    let list = [];
    let info = pageList?.find((item) => item.title === id);
    setCurrent({ ...current, b_list: info.list, page: id, data: list });
  }

  const closeModal = () => {
    setIsShowModal(false);
  }

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

  const currentViewVideo = (ind, index) => {
    let bool = index === ind && currentInfo?.url;
    return (
      <>
        {bool ?
          <Video
            className="center_video_large"
            src={currentInfo?.url}
            poster={dataInfo?.img}
            style={{opacity: bool ? 1 : 0, zIndex:500}}
            initialTime={0}
            controls
            onPlay={startPlay}
            onPause={stopPlay}
            onEnded={onEnded}
            showPlayBtn
            showFullscreenBtn={false}
            enableProgressGesture={true}
            autoplay={true}
            enablePlayGesture
            showCenterPlayBtn
            playBtnPosition="center"
            loop={false}
            objectFit="cover"
          /> : null}
        <Image className="center_video_img" src={dataInfo?.img} style={{opacity: bool ? 0 : 1, zIndex: bool ? 0 : 10000}}/>
      </>
    )
  }

  const currentSwiper = useMemo(()=>{
    return (
      <Swiper
        className='swiper_view'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        current={index}
        duration={loading?0:500}
        scrollWithAnimation={false}
        skipHiddenItemLayout={true}
        enablePassive={true}
        onChange={swiperChange}
        vertical>
        {
          allList?.map((item, ind)=>{
            return (
              <SwiperItem>
                <View className='swiper_item'>
                  <View className="center_video">
                    {currentViewVideo(ind, index)}
                  </View>
                  <View className='swiper_item_footer' />
                </View>
              </SwiperItem>
            )
          })
        }
      </Swiper>
    )
  }, [index,loading, allList, currentInfo, dataInfo])


  const payStatus = (id) => {
    let times = 0;
    let timer = setInterval(() => {
      getPayStatus({ order_id: id }).then((res) => {
        if (res.code !== 1) {
          THide();
          times = times + 1;
          if (times >= 3) {
            clearInterval(timer);
            timer = null;
            TShow(res.msg);
          }
          return;
        }
        THide();
        TShow("充值成功");
        SetStorageSync("nowValPay", '1');
        // 在这里实现后续操作
        times = 0;
        clearInterval(timer)
      });
    }, 400);
  };
  const compareVersion = (_v1, _v2) => {
    if (typeof _v1 !== "string" || typeof _v2 !== "string") return 0;

    const v1 = _v1.split(".");
    const v2 = _v2.split(".");
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
      v1.push("0");
    }
    while (v2.length < len) {
      v2.push("0");
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i], 10);
      const num2 = parseInt(v2[i], 10);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }

    return 0;
  };
  const payApiStatus = (params) => {
    console.log(params, '创建订单1')
    getPayOrder(params).then((res) => {
      console.log(res, '创建订单2')
      if (res.code !== 200) {
        THide();
        return TShow(res.msg);
      }
      if (res.data.is_vir) {
        let data = res.data;
        let sData = res.data.signData;
        const SDKVersion = Taro.getSystemInfoSync().SDKVersion;
        if (
          compareVersion(SDKVersion, "2.19.2") >= 0 ||
          wx.canIUse("requestVirtualPayment")
        ) {
          wx.requestVirtualPayment({
            signData: JSON.stringify({
              offerId: sData.offerId,
              buyQuantity: sData.buyQuantity,
              env: sData.env,
              currencyType: sData.currencyType,
              productId: sData.productId,
              goodsPrice: sData.goodsPrice,
              outTradeNo: sData.outTradeNo,
              attach: sData.attach,
            }),
            paySig: data.paySig,
            signature: data.signature,
            mode: res.data.mode,
            success() {
              payStatus(data.signData.outTradeNo);
            },
            fail({ errMsg, errCode }) {
              console.error(errMsg, errCode);
              THide();
              if (errCode == -1) {
                TShow("支付失败");
              }
              if (errCode == -2) {
                TShow("支付取消");
              }
            },
          });
        } else {
          console.log("当前用户的客户端版本不支持 wx.requestVirtualPayment");
        }
      } else {
        let data = res.data.json_params;
        Taro.requestPayment({
          timeStamp: data.time.toString(),
          nonceStr: data.nonce_str,
          package: data.package,
          signType: "RSA",
          paySign: data.sign,
          success: function () {
            THide();
            payStatus(data.order_id);
          },
          fail: function (err) {
            console.log(err);
            THide();
            let str = "fail";
            if (err.errMsg.indexOf("cancel") >= 0) {
              str = "cancel";
            }
            if (str == "cancel") {
              TShow("取消支付");
            }
            if (str == "fail") {
              TShow("支付失败");
              // TShow(err.errMsg);
            }
            // });
            return;
          },
        });
      }
    });
  };

  const naviPayTo = () => {
    Taro.navigateTo({
      url: "../mine/system/pay/index",
    });
  }
  const naviMemberTo = () => {
    Taro.navigateTo({
      url: "../mine/system/member/index",
    });
  }

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
            {pageList?.map((item, index) => {
              return (
                <AtButton
                  className={item.title === current.page ? "active" : ""}
                  key={index}
                  type="primary"
                  size="normal"
                  onClick={() => {
                    currentChange(item.title);
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
  }, [show, dataInfo, pageList, current, currentInfo]);

  let list = [
    {
      intro: "整剧永久免费看",
      name: "解锁整剧全集",
      price: "11",
      score: "",
      type: "3",
      is_default: "1",
      is_highlighted: '1'
    },
    {
      intro: "全场短剧随意看",
      name: "200K币",
      price: "2",
      score: "+100K币",
      type: "1",
      is_default: "0",
      is_highlighted: '1'
    },
    {
      intro: "仅需1.8元/天",
      name: "解锁整剧全集",
      price: "12.9",
      score: "",
      type: "2",
      is_default: "0",
      is_highlighted: '1'
    },
    {
      intro: "多送6元",
      name: "590K币",
      price: "5.9",
      score: "+600K币",
      type: "1",
      is_default: "0",
      is_highlighted: '0'
    },
    {
      intro: "仅需0.5元/天",
      name: "全场剧免费看30天",
      price: "14.9",
      score: "",
      type: "2",
      is_default: "0",
      is_highlighted: '0'
    },
    {
      intro: "仅需0.2元/天",
      name: "全场剧免费看30天",
      price: "29.9",
      score: "",
      type: "2",
      is_default: "0",
      is_highlighted: '0'
    },
  ]

  const payList = (item, index)=> {
    let cla = "pay_modal_view_list_item";
    if(item.type == "2"){
      cla += " vip_shop";
    }
    if (item.is_default == "1"){
      cla += " all_shop"
    }
    if (item.is_highlighted != '1') {
      cla += " def_shop"
    }
  return (
      <View className={cla} key={index}>
        <View className="pay_modal_view_list_item_title">
          <View className="pay_modal_view_list_item_title_main">
            <Text className="pay_modal_view_list_item_title_main_price">{item.price}</Text>元
          </View>
          {
            item.type == "2" ?
              <View className="pay_modal_view_list_item_title_text">
                {item.name}
                <Text className="pay_modal_view_list_item_title_text_price">{item.score}</Text>
              </View>
            :
              <View className="pay_modal_view_list_item_title_text">{item.name}</View>
          }
        </View>
        <View className="pay_modal_view_list_item_desc">
          {item.intro}
        </View>
      </View>
    )
  }
  const currentPayList = useMemo(()=>{
    return (
      <AtFloatLayout className="pay_modal" isOpened={isShowModal} onClose={closeModal}>
        <View className="pay_modal_view">
          <View className="pay_modal_view_header">
            <View className="pay_modal_view_header_title">感谢你支持作者，购买后继续观看</View>
            <View className="pay_modal_view_header_desc">账户余额：0K币（100K币/集）</View>
          </View>
          <View className="pay_modal_view_list">
            {
              list.map((item, index)=> payList(item, index))
            }
          </View>
          <View className="pay_modal_view_desc">充值代表接受 <Text className="pay_modal_view_desc_link" onClick={naviPayTo}>《充值规则协议》</Text>和<Text className="pay_modal_view_desc_link" onClick={naviMemberTo}>《会员服务协议》</Text></View>
        </View>
      </AtFloatLayout>
    )
  }, [isShowModal])
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
        {fivList.map((item, index) => {
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
        {currentSwiper}
      </View>
      {currentListContext}
      {currentPayList}
    </View>
  );
}
