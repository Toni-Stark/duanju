import { defineConfig, UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
const TerserPlugin = require("terser-webpack-plugin");
import devConfig from "./dev";
import prodConfig from "./prod";
// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, {
  command, mode }) => {
  const baseConfig: UserConfigExport = {
    projectName: "taro-react",
    date: "2023-11-13",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: [
      [
        "@tarojs/plugin-inject",
        {
          components: {
            // 给button组件添加自定义事件
            Button: {
              // 正常情况下需要添加小驼峰的dataImId 属性，taro会转换成 data-im-id
              // 但是 ，关键的来了，如果你只加了这一个自定义属性，那么恭喜你，
              // 明明已经转换成了，但还是会报错： data-im-id is required 巴拉巴拉巴拉
              dataImId: "",
              // 解决上面的问题的办法来了，就是再添加一个带横杠的 data-im-id
              // 不知道原理是啥，反正能用。 有懂的同学请不吝赐教。
              "data-im-id": "",
              // 这个是没走通之前添加了看报错的，后面没有去掉，
              // 也没有详细测试去掉会不会有影响，建议保留
              onerror: "eh",
            },
            // // 添加自定义组件
            VideoPlayer: {
              "album-id": "",
              "episode-id": "",
              "cloud-type": "",
              "three-party-cloud":'',
              "test":'',
              "autoplay": '',
              "object-fit": '',
              "poster": '',
              "bindplay": '',
              "bindpause": '',
              "bindended": '',
              "loop":'',
              "version": ""
            },
          },
          // componentsMap: {
          //   VideoPlayer: "video-player",
          // },
        },
      ],
    ],
    defineConstants: {},
    copy: {
      // NOTE 行业sdk的package.json
      patterns: [
        {
          from: "douyin.package.json",
          to: "dist/package.json",
        },
      ],
      options: {},
    },
    framework: "react",
    compiler: "webpack5",
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    optimization: {
      minimize: false, // 启用代码压缩
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6, // 设置 ECMAScript 版本
            mangle: true, // 开启代码混淆
            compress: {
              drop_console: true, // 去除 console.* 函数调用
            },
          },
        }),
      ],
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 1024, // 设定转换尺寸上限
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin).end();
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",
      esnextModules: ["taro-ui"],
      output: {
        filename: "js/[name].[hash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].js",
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
