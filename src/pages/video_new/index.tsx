import { View} from "@tarojs/components";
import Taro, {useDidShow, useRouter} from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "taro-ui/dist/style/components/float-layout.scss";
import "./index.less";
import { useState} from "react";

import {
  getMemberInfo,
  getVideoIndex,
  getWalletProducts,
} from "@/common/interface";
import {GetStorageSync, SetStorage, SetStorageSync} from "@/store/storage";

export default function VideoView() {
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
  const [payData, setPayData] = useState(undefined);


  useDidShow(() => {

    const params: any = router.params;
    if(!params?.pn){
      getMemberInfo().then((res) => {
        let pn = res.data?.pn;
        if(pn){
          params.pn = pn
        }
        rootVideoInfo(params);
      })
    } else {
      rootVideoInfo(params);
    }

    let envs = GetStorageSync('ENV') == "TT";
    if(envs) {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1e212a',
      })
    } else {
      let _option = option;
      _option.title = "";
      const rect = Taro.getMenuButtonBoundingClientRect();
      _option.barHeight = rect.height;
      _option.statusBarHeight = rect.top;
      setOption({ ..._option });
    }
  });

  const rootVideoInfo = (params) => {
    if (params?.iv) {
      let sn = decodeURIComponent(params.iv);
      SetStorageSync("sn", sn);
    }
    SetStorage('pn_data', params).then(()=>{
      console.log(params,'params')
      if (params?.pn) {
        SetStorage('pn', params?.pn).then(()=>{
          getVideoList({ v_id: params.id, pn_data: JSON.stringify(params) }, 1);
        });
      } else {
        getVideoList({ v_id: params.id, pn_data: JSON.stringify(params) }, 2);
      }
    });
    setTimeout(()=>{
      getPayListData({
        v_id: params.id,
        pn: params.pn
      })
    },200)


    let _option = option;
    _option.title = "";
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.height;
    _option.statusBarHeight = rect.top;
    setOption({ ..._option });
  }

  const getPayListData = (params) => {
    getWalletProducts(params).then((res)=>{
      if(res.data.is_template){
        setPayData(res.data)
      }
    })
  }

  const getVideoList = (params, num) => {
    console.log(params, num, 'params')
    getVideoIndex(params).then((res) => {
      const {info, list} = res.data;

    });
  }

  return (
    <View className="index">
      {/* 视频列表选择框 */}

    </View>
  );
}
