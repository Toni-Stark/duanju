import {View, Image, Text} from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import {useMemo, useState} from "react";
import wxPay from "../../../../static/icon/wx_pay.png";
import con from "../../../../static/icon/_con.png";
import dis from "../../../../static/icon/_dis.png";
import {
  getMemberInfo,
  getPayOrder,
  getPayStatus,
  getWalletProducts, getWalletTmpProducts,
} from "@/common/interface";
import {SetStorage, SetStorageSync} from "@/store/storage";
import { HeaderView } from "@/components/headerView";
import {getCheckLogin, THide, TShow} from "@/common/common";
import {commonSetting} from "@/store/config";

export default function Search() {
  const router = useRouter();
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    active: 1,
    bar: 1,
    type: 1,
    is_pay: 0
  });
  const [list, setList] = useState([
    {
      title: "微信支付",
      icon: wxPay,
      checked: 1,
    },
  ]);
  const [inList, setInList] = useState([]);
  const [info, setInfo] = useState(undefined);
  const [payData, setPayData] = useState(undefined);
  const [pnInt, setPnInt] = useState(undefined);

  useLoad(() => {
    const params = router.params;
    let _option = option;
    if (params?.type) {
      _option.type = params?.type;
    }
    if (params?.is_pay) {
      _option.is_pay = params?.is_pay;
    }
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
    getProList();
  });

  const getProList = () => {
    getMemberInfo().then((res) => {
      setInfo(res.data);
      let pn = res.data?.pn;
      setPnInt(pn);
      getWalletProducts().then((result)=>{
        if(result.data.is_template){
          // if(!result.data){
          //   Taro.showModal({
          //     title: '提示',
          //     content: '无支付模板',
          //     success(res) {
          //       if (res.confirm) {
          //         console.log('用户点击确定');
          //         // 执行相关操作
          //       } else if (res.cancel) {
          //         console.log('用户点击取消');
          //         // 执行相关操作
          //       }
          //     }
          //   });
          // }
          setPayData(result.data)
        } else {
          setInList(result.data.product_list);
          setOption({ ...option, bar: result.data.product_list[0].id });
        }
      })
      // } else {
      //   getWalletProducts().then((result) => {
      //     setInList(result.data.product_list);
      //     setOption({ ...option, bar: result.data.product_list[0].id });
      //   });
      // }
    })
  };

  const checkType = (e) => {
    setOption({ ...option, active: e });
  };
  const checkTab = (e) => {
    setOption({ ...option, bar: e });
  };

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
        getProList();
        if(option.type == "1"){
          Taro.navigateBack();
        }
        times = 0;
        clearInterval(timer)
      });
    }, 400);
  };
  const payOrder = () => {
    if(!inList||inList?.length<=0){
      return;
    }
    TShow("支付中", "loading", 10000);

    getCheckLogin().then((result) => {
      console.log(result, '获取登录状态')
      let {token} = result;
      SetStorageSync("allJson", result);
      SetStorage("token", token).then(() => {
        payApiStatus({ product_id: option.bar });
      });
    });
  };
  const payApiStatus = (params) => {
    getPayOrder(params).then((res) => {
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
            success(res) {
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
          success: function (res) {
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
            }
            return;
          },
        });
      }
    });
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
  const currentContext = useMemo(() => {
    if(inList.length<=0 && payData?.product_list.length<=0) return null;
    return (
      <View className="index_content_icon">
        <View className="index_content_icon_text">
          <View className="text_main">
            <View className="text_main_title">{commonSetting.coinName}</View>
            <View className="text_main_eval">{info?.score}</View>
          </View>
          <View className="text_main">
            <View className="text_main_title">会员时长</View>
            <View className="text_main_eval">
              {info?.expire_days}
              <View className="text_main_eval_text">天</View>
            </View>
          </View>
        </View>
      </View>
    )
  }, [info,inList,payData])
  const coinContext = useMemo(() => {
    if(pnInt)return;
    return (
      <View className="index_content_list">
        {inList.map((res) => {
          let item: any = { ...res };
          let cName = "item";
          if (item.intro) {
            cName = cName + " super";
          }
          if (item.id === option.bar) {
            cName = cName + " active";
          }
          return (
            <View className={cName} onClick={() => checkTab(item.id)}>
              {item?.intro ? (
                <View className="item_tips">{item.intro}</View>
              ) : null}
              <View className="item_value">
                <View>
                  {item.expire_days > 0 ? (
                    <View className="item_value_score_day">
                      {item.expire_days}
                      <View className="day">天</View>
                    </View>
                  ) : null}
                  {item.type == 2 ? (
                    <View className="item_value_score_day">
                      {item.score}
                      <View className="day">{commonSetting.coinName}</View>
                    </View>
                  ) : null}
                </View>
                <View className="item_value_score">
                  {item.gift_score > 0 ? (
                    <View className="item_value_score_text">
                      （送{item.gift_score}{commonSetting.coinName}）
                    </View>
                  ) : null}
                </View>
              </View>
              <View className="item_desc">
                {item.name}
                <View className="item_desc_price">{item.price}</View>
              </View>
            </View>
          );
        })}
      </View>
    )
  }, [inList, option, pnInt])
  const payContext = useMemo(()=>{
    if(inList.length<=0) return null;
    return (
      <View className="index_content_label">
        {list.map((item) => {
          return (
            <View className="label" onClick={() => checkType(item.checked)}>
              <View className="label_item">
                <Image
                  mode="widthFix"
                  className="label_item_icon"
                  src={item.icon}
                />
                <View className="label_item_text">{item.title}</View>
              </View>
              <View className="label_btn">
                <Image
                  className="label_btn_img"
                  src={item.checked == option.active ? con : dis}
                />
              </View>
            </View>
          );
        })}
      </View>
    )
  }, [list, option, inList,payData])

  const chooseOne = (item) => {
    let data = {...payData}
    data.product_list = data?.product_list?.map((it) => {
      if (it.id == item.id) {
        return {...it, is_default: "1"}
      } else {
        return {...it, is_default: "0"}
      }
    })
    setPayData({...data})
    TShow("支付中", "loading", 3000)
    getCheckLogin().then((result) => {
      let {token} = result;
      SetStorageSync("allJson", result);
      SetStorage("token", token).then(() => {
        payApiStatus({product_id: item.id})
      })
    })
  }
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
      <View className={cla} key={index} onClick={()=>{
        chooseOne(item)
      }}>
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
        <Image className="vip_image" mode="widthFix" src={require('../../../../static/icon/vip.png')} />
      </View>
    )
  }

  const currentPayList = useMemo(()=>{
    if (!pnInt && payData?.product_list.length<=0) return;
    return (
      <View className="pay_modal_view">
        <View className="pay_modal_view_list">
          {
            payData?.product_list.map((item, index)=> payList(item, index))
          }
          {
            payData?.product_list.length<=0?<View className="pay_modal_view_list_pav">无支付模板</View>:null
          }
        </View>
      </View>
    )
  }, [payData, pnInt])
  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text={inList.length>0?"充值":"信息"}
      />
      <View className="index_content">
        {inList.length>0?<View className="index_content_banner">
          <View>创作不易，感谢您的支持</View>
          {option.is_pay?<View>解锁当前剧集需要{option.is_pay}{commonSetting.coinName}</View>:null}
        </View>:null}
        {/*用户账户*/}
        {currentContext}
        {/*列表*/}
        {coinContext}
        {currentPayList}
        {/*支付方式列表*/}
        {payContext}
        {inList.length>0 || payData?.product_list.length>0?
            <View className="index_content_desc">
              <View className="title">充值须知</View>
              <View className="desc">
                <View>1、一经充值不予退换；</View>
                <View>
                  2、未满18周岁未成年需在监护人的指导、同意下，进行充值操作；
                </View>
                <View>3、赠送为平台同等金额兑换比例的{commonSetting.coinName}，不是现金；</View>
                {/*<View>4、遇到问题可在“我的”页面联系客服</View>*/}
              </View>
            </View>
        :null}
        { !payData?.is_template ? <View className={inList && inList.length > 0 ? "index_content_btn" : "index_content_btn_gray"}
               onClick={payOrder}
        >
          {inList.length > 0 ? '确认支付' : '暂不支持'}

        </View>: null}
      </View>
    </View>
  );
}
