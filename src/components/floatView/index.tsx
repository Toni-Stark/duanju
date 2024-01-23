import {Image, View} from "@tarojs/components";

import "./index.less";

type Props = {
  text: string;
  title: string;
  img: string;
  id: string|number;
  show: boolean;
  clickFun: () => void;
  naviVideo: (id: string|number) => void;
};
export const FloatView = (props: Partial<Props>) => {
  const { img, id, text,title, show, clickFun, naviVideo } = props;
  if(show){
    return (
      <View className="float">
        <View className="float_modal">
          <View className="float_modal_img">
            {title}
          </View>
          <View className="float_modal_main">
            <Image onClick={()=>naviVideo(id)} mode="widthFix" className="img" src={img} />
          </View>
          <View className="float_modal_desc">{text}</View>
          <View className="float_modal_btn" onClick={clickFun}>我知道了</View>
        </View>
      </View>
    );
  } else {
    return <></>
  }
};
