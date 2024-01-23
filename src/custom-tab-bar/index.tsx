import Taro from "@tarojs/taro";
import { CoverView } from "@tarojs/components";
import { useState } from "react";
import "./index.less";

export const PageTabBarEnum = {
  Home: 1, // 首页,
  List: 2, // 追剧
  Hot: 3, // 热播
  Mine: 4, // 我的
};

export default function customTabBar() {
  const [option] = useState({
    color: "#b2b5bc", // 字体颜色
    selectedColor: "#ffffff", // 激活的字体颜色
    backgroundColor: "#1e212a", // 背景色
    borderStyle: "#282b32", // 边框颜色
  });
  const [tabList, setTabList] = useState([
    {
      pagePath: "/pages/index/index", // 路由
      text: "首页",
      tabbar: PageTabBarEnum.Home,
    },
    {
      pagePath: "/pages/list/index",
      text: "追剧",
      tabbar: PageTabBarEnum.List,
    },
    {
      pagePath: "/pages/hot/index",
      text: "热播",
      tabbar: PageTabBarEnum.Hot,
    },
    {
      pagePath: "/pages/mine/index",
      text: "我的",
      tabbar: PageTabBarEnum.Mine,
    },
  ]);

  const switchTab = (tabData) => {
    const { pagePath } = tabData;
    Taro.switchTab({
      url: pagePath,
      success: () => {
        setTabList(tabList);
      },
    });
  };
  return (
    <CoverView className="custom-tab">
      {tabList.map((item) => {
        const pages = Taro.getCurrentPages();
        console.log(pages[0].__route__);
        let index = item.pagePath.indexOf(pages[0].__route__);
        return (
          <CoverView
            className="custom-tab-item"
            onClick={() => switchTab(item)}
            data-path={item.pagePath}
            key={item.tabbar}
          >
            <CoverView
              className="custom-tab-item-text"
              style={{
                color: index >= 0 ? option.selectedColor : option.color,
              }}
            >
              {item.text}
            </CoverView>
          </CoverView>
        );
      })}
    </CoverView>
  );
}
