const {
  getPlayletManager
} = tt;
Component({
  data: {
    title: "播放器"
  },
  properties: {
    id: {
    }
  },
  async ready() {
    const pm = getPlayletManager();
    this.pm = pm;
    pm.onPlay((e) => {
      console.log("触发开始播放onPlay回调:", JSON.stringify(e, null, 2))
    });
    pm.onPause((e) => {
      console.log("触发暂停播放onPause回调:", JSON.stringify(e, null, 2))
    })
    pm.onEnded((e) => {
      console.error("触发播放到末尾onEnded回调",e)
    })
    pm.onWaiting((e) => {
      console.log("触发视频出现缓冲onWaiting回调:", JSON.stringify(e, null, 2))
    })
    pm.onPlayBackRateChange((e) => {
      console.log("触发视频倍速改变onPlayBackRateChange回调:", JSON.stringify(e, null, 2))
    })
    pm.onLoadedMetaData((e) => {
      console.log("触发视频元数据加载完成onLoadedMetaData回调:", JSON.stringify(e, null, 2))
    })
    pm.onSeekComplete((e) => {
      console.log("触发seek完成onSeekComplete回调:", JSON.stringify(e, null, 2))
    })
    pm.onMuteChange((e) => {
      console.log("触发静音状态改变onMuteChange回调:", JSON.stringify(e, null, 2))
    })
    pm.onControlTap((e) => {
      console.log("触发点击控件onControlTap回调:", JSON.stringify(e, null, 2))
    })
    pm.onOpenCatalog((e) => {
      console.log("触发点击选集onOpenCatalog回调:", JSON.stringify(e, null, 2))
    })
  // 推荐位使用简单示例
  pm.onChangeEpisode((e) => {
    console.log("触发选集切换onChangeEpisode回调:", e);
    pm.setRecommendConfig({
    entryType: 1,
    switchStatus: true,
    data:
    {
        albumId: "7349101834553786889",
        seq: 1,
      }
  });
  if(e.albumId==='7349101834553786889'){
    pm.setCatalog({
    freeList: [
      {
        start_episode_no: 1,
        end_episode_no: 10,
      },
    ],
  });
  }
  });
    pm.onClickUnlock((e) => {
      console.log(111111)
      console.log(this, "player解锁", JSON.stringify(e, null, 2))
      this.pm.toggleCustomDialog();
    })
    pm.onTapCustomIcon((e) => {
      console.log("触发点击自定义组件onTapCustomIcon回调:", JSON.stringify(e, null, 2))
      pm.setConfig({
        activityInfo: [{
          icon: this.data.playerShow ?
            'https://img95.699pic.com/xsj/0c/1m/7e.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast' : 'https://img1.baidu.com/it/u=4277336598,3522277563&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800',
          title: this.data.playerShow ? '开辅助' : '关辅助',
        }]
      });
      this.setData({
        playerShow: !this.data.playerShow
      })
    })
    pm.onTapShare(() => {
      console.log(`tt_album_id=${this.data.albumId}&tt_episode_id=${this.data.episodeId}`)
      return { // 分享数据
        title: '测试小程序测试短剧onTapShare', // 这是要转发的小程序标题
        desc: `这是默认的转发文案，用户可以直接发送，也可以在发布器内修改,分享的episodeId是 ${this.data.tt_episode_id}`,
        path: `page/shortDramaMarket/playlet-plugin/index?tt_album_id=${this.data.tt_album_id}&tt_episode_id=${this.data.tt_episode_id}`, // ?后面的参数会在转发页面打开时传入onLoad方法
        imageUrl: 'https://n.sinaimg.cn/sinakd20220105s/289/w945h944/20220105/d698-6b9d8808d51527dc9656b35e12b486ae.jpg', // 支持本地或远程图片，默认是小程序 icon
        templateId: '这是开发者后台设置的分享素材模板id'
      }
    })
    pm.onShareSuccess((res) => {
      console.log("分享成功onShareSuccess回调:", JSON.stringify(res, null, 2))
    })
    pm.onShareFail((res) => {
      console.log("分享失败onShareSuccess回调:", JSON.stringify(res, null, 2))
    })
  },
  created: function () {
    // 在组件实例进入页面节点树时执行
    console.log("Player created");
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    console.log("Player attached");
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    console.log("Player detached");
  },

  methods: {
    log() {
      this.setData({
        title: "Player 播放器1111"
      });
      console.log('Player', this.data.title);
    }
  }
})
