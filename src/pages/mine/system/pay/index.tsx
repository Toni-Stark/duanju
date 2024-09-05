import { View, WebView } from "@tarojs/components";
import "taro-ui/dist/style/components/loading.scss";
import {env} from "@/store/config";

export default function PaySystem() {

  return (
    <View className="index">
      <WebView src={env.BASE_URL+"default/topup"} />
    </View>
  );
}
