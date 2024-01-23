import Taro from "@tarojs/taro";
import {
  GetStorageSync,
  RemoveStorageSync,
  SetStorageSync,
} from "@/store/storage";
import { env } from "@/store/config";
import {getSystemInfo} from "@/common/tools";

const checkLoginUrl = env.BASE_URL + "member/check-login";
const loginUrl = env.BASE_URL + "member/login";

export const getCheckLogin = () => {
  return new Promise((resolve, reject) => {
    getSystemInfo().then((res)=>{
       Taro.login({
            complete: (loginRes) => {
              if (!loginRes.code) return;
              let pn = GetStorageSync('pn');
              Taro.request({
                url: checkLoginUrl,
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "env": res
                },
                data: { code: loginRes.code, type: "mini", pn: pn },
                method: "POST",
                success: function (res) {
                  let { code, data } = res.data;
                  if (res.statusCode === 300)
                    return Taro.showToast({ title: "网络超时", icon: "none" });
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
    })
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
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: params,
      method: "POST",
      success: function (res) {
        let { code, data } = res.data;
        if (res.statusCode === 300)
          return Taro.showToast({ title: "网络超时", icon: "none" });
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
      title: text,
      icon,
      duration,
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
