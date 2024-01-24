import { PropsWithChildren } from "react";
import Taro, { useLaunch } from "@tarojs/taro";
import "./app.less";
import "taro-ui/dist/style/index.scss";
import "taro-ui/dist/style/components/tab-bar.scss";
import "taro-ui/dist/style/components/badge.scss";
import "taro-ui/dist/style/components/list.scss";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    const updateManager = Taro.getUpdateManager();
    // 请求完新版本信息的回调
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        // 新版本下载成功
        updateManager.onUpdateReady(() => {
          Taro.showModal({
            title: "更新提示",
            content: "新版本已经准备好，点击确定重启小程序",
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，强制更新
                updateManager.applyUpdate();
              }
            },
          });
        });
      }
    });
    // 新版本下载失败
    updateManager.onUpdateFailed((res) => {
      console.error(res);
    });
  });
  return children;
}

export default App;
