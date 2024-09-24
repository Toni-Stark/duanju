import { View} from "@tarojs/components";

import "./index.less";
import {AtButton} from "taro-ui";

type Props = {
};
export const DialogView = ({renderHeader, children, renderFooter}: Partial<Props>) => {
  return (
    <View className="dialog">
      <View className="header">{renderHeader || (<View>提示</View>)}</View>
      <View className="body">{children}||(<View>提示内容</View>)</View>
      <View className="footer">
        {
          renderFooter ||
          (
              <AtButton
                type="primary"
                size="normal"
                onClick={() => {
                  console.log("close")
                }}
              >
                确认
              </AtButton>
          )
        }</View>
    </View>
  );
};

