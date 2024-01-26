import Taro from "@tarojs/taro";
import {GetStorageSync, SetStorage, SetStorageSync} from "@/store/storage";
import {getCheckLogin, TShow} from "@/common/common";
import {getFormUrl} from "@/common/tools";
import {env} from "@/store/config";

let isRefreshing = false;
let requests = [];
let ajaxtimes = 0;
function cloudRequest(paramsList) {
  let params = JSON.parse(JSON.stringify(paramsList));
  let header = {};
  let storageToken = GetStorageSync("token");
  ajaxtimes++;
  params.url = env.BASE_URL + params.url;
  if (!params.data) params.data = {};
  if (!params.header) params.header = header;
  if (params.data.token) {
    header["Authorization"] = params.data.token;
  } else if (storageToken) {
    header["Authorization"] = storageToken;
  }
  header["Content-Type"] = "application/x-www-form-urlencoded";
  return new Promise((resolve, reject) => {
    Taro.request({
      ...params,
      header: header,
      method: params.method || "GET",
      success: function (res) {
        var {code} = res.data;
        if (res.statusCode != 200)
          return TShow(res.msg);
        if (code == 200) {
          isRefreshing = false;
          return resolve(res.data);
        }
        if (code != 403) return resolve(res.data);
        new Promise((resolve2) => {
          requests.push((token) => {
            if (!paramsList.data) paramsList.data = {token};
            resolve(cloudRequest(paramsList));
          });
        });
        if (!isRefreshing) {
          isRefreshing = true;
          getCheckLogin().then((result) => {
            let {token} = result;
            SetStorageSync("allJson", result);
            SetStorage("token", token).then((res) => {
              requests.forEach((run) => run(token));
              requests = [];
            });
            return;
          });
        }
      },
      fail: function (err) {
        reject(err);
      },
      complete: function () {
        ajaxtimes--;
        if (ajaxtimes === 0) {
          Taro.hideNavigationBarLoading();
          Taro.stopPullDownRefresh();
        }
      },
    });
  })
}
export const cloudGet = (url, params) => {
  let str = getFormUrl(params);
  return cloudRequest({ url: url + "?" + str, method: "GET" });
};
export const cloudPost = (url, params: any) => {
  let pn: any = GetStorageSync("pn");
  if(params && pn){
    params['pn'] = pn;
  }
  if(!params && pn){
    params = {pn};
  }
  return cloudRequest({ url, method: "POST", data: params });
};
