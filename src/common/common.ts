import Taro from "@tarojs/taro";
import {
  GetStorageSync,
  RemoveStorageSync,
  SetStorageSync,
} from "@/store/storage";
import { env } from "@/store/config";

const checkLoginUrl = env.BASE_URL + "member/check-login";
const loginUrl = env.BASE_URL + "member/login";

export const getCheckLogin = () => {
  return new Promise((resolve, reject) => {
    Taro.login({
            complete: (loginRes) => {
              if (!loginRes.code) return;
              let pn = GetStorageSync('pn');
              Taro.request({
                url: checkLoginUrl,
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: { code: loginRes.code, type: "mini", pn: pn },
                method: "POST",
                success: function (res) {
                  let { code, data } = res.data;
                  if (res.statusCode === 300)
                    return Taro.showToast({ title: "网络超时",	mask:true, icon: "none" });
                  if (code === 200) return resolve(data);
                  if (code === 401) {
                    let params = {
                      openid: data.openid,
                      unionid: data.unionid,
                    };
                    SetStorageSync("rootJson", params);
                    return reject(data);
                  }
                  if (code === 403) {
                    RemoveStorageSync("token");
                    getLogin(data).then((result) => {
                      return resolve(result);
                    });
                  }
                },
              });
            },
      });
  });
};

export const getLogin = (option) => {
  let iv = GetStorageSync("sn");
  let pn = GetStorageSync("pn");
  let pn_data = GetStorageSync("pn_data");
  let params: any = {
    openid: option.openid,
    session_key: option.session_key
  };
  if (iv) {
    params.iv = iv;
    RemoveStorageSync("sn");
  }
  if (pn) {
    params.pn = pn;
  }
  if (pn) {
    params.pn_data = JSON.stringify(pn_data);
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: loginUrl,
      header: { "Content-Type": "application/x-www-form-urlencoded"},
      data: params,
      method: "POST",
      success: function (res) {
        let { code, data } = res.data;
        if (res.statusCode === 300)
          return Taro.showToast({ title: "网络超时",	mask:true, icon: "none" });
        if (code === 200) {
          RemoveStorageSync("pn_data");
          return resolve(data);
        }
        return reject(data);
      },
    });
  });
};

export const TShow = (text, icon = "none", duration = 1500) => {
  return new Promise((resolve) => {
    Taro.showToast({
      title: typeof text == 'string' ? text : '',
      mask:true,
      icon,
      duration,
    }).then(() => {
      resolve();
    });
  });
};
export const TLoading = (text) => {
  return new Promise((resolve) => {
    Taro.showLoading({
      title: typeof text == 'string' ? text : '',
      mask:true,
    }).then(() => {
      resolve();
    });
  });
};
export const THide = () => {
  Taro.hideLoading();
};
export const THideT = () => {
  Taro.hideToast();
};

// 支付回调参数

export const payToast = (id) => {
  let text = ""
  if(id === 10000) {text = "参数错误"}
  else if(id === 10401) {text = "请求异常，可重试或升级APP"}
  else if(id === 11001) {text = "访问未授权"}
  else if(id === 12002) {text = "账号行为异常"}
  else if(id === 13000) {text = "系统错误"}
  else if(id === 20000) {text = "订单不存在"}
  else if(id === 21012) {text = "创建订单失败，请稍后重试"}
  else if(id === 21046) {text = "订单收款商户号不合法"}
  else if(id === 21550) {text = "请用真机调试"}
  else if(id === 26001) {text = "当前订单状态不可支付"}
  else if(id === 26003) {text = "小程序违规，支付能力被封禁"}
  else if(id === 26005) {text = "无可用支付方式"}
  else if(id === 26006) {text = "商户号与小程序的支付产品不一致"}
  else if(id === 1) {text = "支付超时"}
  else if(id === 2) {text = "支付失败"}
  else if(id === 3) {text = "支付关闭"}
  else if(id === 4) {text = "支付取消"}
  else if(id === 9) {text = "建议开发者自行通过服务端的订单查询接口获取订单状态"}
  return new Promise((resolve) => {
    Taro.showToast({
      title: typeof text == 'string' ? text : '',
      mask:true,
      icon: "none",
      duration: 2000
    }).then(() => {
      resolve();
    });
  });
};
export const payOrderToast = (id) => {
  let text = ""
  if(id === 10000) {text = "参数错误"}
  else if(id === 10401) {text = "请求异常，可重试或升级APP"}
  else if(id === 11001) {text = "访问未授权"}
  else if(id === 12002) {text = "账号行为异常"}
  else if(id === 13000) {text = "系统错误"}
  else if(id === 20000) {text = "订单不存在"}
  else if(id === 21012) {text = "创建订单失败，请稍后重试"}
  else if(id === 21046) {text = "订单收款商户号不合法"}
  else if(id === 21550) {text = "请用真机调试"}
  else if(id === 26001) {text = "当前订单状态不可支付"}
  else if(id === 26003) {text = "小程序违规，支付能力被封禁"}
  else if(id === 26005) {text = "无可用支付方式"}
  else if(id === 26006) {text = "商户号与小程序的支付产品不一致"}
  else if(id === 1) {text = "支付超时"}
  else if(id === 2) {text = "支付失败"}
  else if(id === 3) {text = "支付关闭"}
  else if(id === 4) {text = "支付取消"}
  else if(id === 9) {text = "建议开发者自行通过服务端的订单查询接口获取订单状态"}
  return new Promise((resolve) => {
    Taro.showToast({
      title: typeof text == 'string' ? text : '',
      mask:true,
      icon: "none",
      duration: 2000
    }).then(() => {
      resolve();
    });
  });
};
