import { View, WebView } from "@tarojs/components";
import "taro-ui/dist/style/components/loading.scss";
import {env} from "@/store/config";

export default function System() {

  return (
    <View className="index">
      <WebView src={env+"default/term"} />
    </View>
  );
}
