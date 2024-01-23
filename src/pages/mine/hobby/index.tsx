import { View, ScrollView, Image } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import "taro-ui/dist/style/components/loading.scss";
import "./index.less";
import { useState } from "react";
import left from "../../../static/icon/left.png";
import { HeaderView } from "@/components/headerView";

export default function Hobby() {
  const [option, setOption] = useState({
    statusBarHeight: 0,
    barHeight: 0,
    videoHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    count: 0,
  });
  const [dataList, setDataList] = useState([
    {
      title: "男频",
      list: [
        {
          title: "都市生活",
          id: 1,
        },
        {
          title: "异术超能",
          id: 2,
        },
        {
          title: "赘婿",
          id: 3,
        },
        {
          title: "复仇",
          id: 4,
        },
        {
          title: "战神兵王",
          id: 5,
        },
        {
          title: "历史",
          id: 6,
        },
        {
          title: "奶爸",
          id: 7,
        },
      ],
    },
    {
      title: "女频",
      list: [
        {
          title: "甜宠",
          id: 8,
        },
        {
          title: "宫斗",
          id: 9,
        },
        {
          title: "霸道总裁",
          id: 10,
        },
        {
          title: "虐恋情深",
          id: 11,
        },
        {
          title: "青梅竹马",
          id: 12,
        },
        {
          title: "重生",
          id: 13,
        },
        {
          title: "萌宝",
          id: 14,
        },
        {
          title: "替嫁",
          id: 15,
        },
        {
          title: "穿越",
          id: 16,
        },
        {
          title: "仙侠",
          id: 17,
        },
      ],
    },
  ]);
  const [current, setCurrent] = useState([]);

  useLoad(() => {
    let _option = option;
    const rect = Taro.getMenuButtonBoundingClientRect();
    _option.barHeight = rect.top;
    _option.statusBarHeight = rect.height;
    Taro.getSystemInfo({
      success: (res) => {
        _option.screenWidth = res.screenWidth;
        _option.screenHeight = res.screenHeight;
        _option.videoHeight = res.screenWidth / 0.72;
      },
    });

    setOption({ ..._option });
  });
  const naviBack = () => {
    Taro.navigateBack();
  };

  const chooseItem = (id) => {
    let index = current.findIndex((item) => {
      return item === id;
    });
    let list = [...current];
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    setOption({ ...option, count: list.length });
    setCurrent([...list]);
  };

  return (
    <View className="index">
      <HeaderView
        barHeight={option.barHeight}
        height={option.statusBarHeight}
        text="选择您的兴趣爱好"
      />
      <View className="index_content">
        <View className="index_content_main">
          {dataList.map((item, index) => {
            return (
              <View key={index} className="main_item">
                <View className="main_item_title">{item.title}</View>
                <View className="main_item_btns">
                  {item.list.map((it, ind) => {
                    let bool = current.findIndex((item) => item === it.id);
                    return (
                      <View
                        key={ind}
                        className="main_item_btns_btn"
                        style={{
                          borderWidth: bool >= 0 ? "1Px" : 0,
                          borderColor: bool >= 0 ? "#fcc547" : "none",
                        }}
                        onClick={() => {
                          chooseItem(it.id);
                        }}
                      >
                        {it.title}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        <View className="index_content_btn">
          <View
            className="index_content_btn_text"
            style={{
              background:
                current.length > 0
                  ? "linear-gradient(to right, #a829e8, #3c6fef)"
                  : "#3c4252",
            }}
          >
            已选{option.count}个
          </View>
        </View>
      </View>
    </View>
  );
}
