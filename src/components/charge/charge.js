const {
  getPlayletManager
} = tt;
Component({
  data: {
  },
  properties: {
    albumId: {
      type: String,
      value: ''
    },
    episodeId: {
      type: String,
      value: ''
    },
    seq: {
      type: Number,
      value: 0
    }
  },
  inject:['providedC'],
  async ready() {
    console.error('charge ready',this)
    const pm = getPlayletManager();
    this.pm = pm;
    this.ad = tt.createRewardedVideoAd({
      adUnitId: "suwdwiwfetvwq22rvi",
    });
    pm.onPlay(() => {
      console.log('在charge中监听onPlay')
    })
    console.error(pm,'PM')
    this.selectComponent('charge',(res)=>{
    console.error('res_charge',res)
    })
    // 监听视频播放完成
    // this.ad.onClose((data) => {
    //   if (data.isEnded) {
    //     console.log("观看了", data.count, "个视频");
    //     this.pm.toggleCustomDialog();
    //     this.pm.setCatalog(this.data.allUnlock);
    //   } else {
    //     console.log("未观看完视频");
    //     tt.showToast({
    //       title: '未观看完视频',
    //     });
    //   }
    // });
    this.ad.onClose((data) => {
      // if (data.isEnded) {
        console.log("观看了", data.count, "个视频");
        this.pm.toggleCustomDialog();
        this.pm.setCurrentUnlock();
      // } else {
      //   console.log("未观看完视频");
      //   tt.showToast({
      //     title: '未观看完视频',
      //   });
      // }
    });
    //记录解锁信息
    // const {
    //   playletPluginList
    // } = await getVideoList();
    // console.log("playletPluginList",playletPluginList)
    // for (let i = 0; i < playletPluginList.length; i++) {
    //   console.log(playletPluginList[i].ablum_id)
    //   console.log(this.data.tt_album_id)
    //   if (playletPluginList[i].ablum_id === this.properties.albumId) {
    //     this.setData({
    //       allUnlock: playletPluginList[i].allUnlock
    //     })
    //   }
    // }
  },
    attached: function () {
      console.error('attached charge')
    },
  detached() {
    console.error('detached charge')
    if (this.ad) {
      this.ad.destroy();
    }
  },
  methods: {
    log() {
      console.log("this is a log");
      const pm = getPlayletManager();
      pm.setCurrentUnlock();
    },
    //支付区域
    payThis(e) {
      console.log('支付解锁当前集', e);
      this.pm.toggleCustomDialog();
      this.pm.setCurrentUnlock();
    },
    payAll(e) {
      console.log('支付解锁全集', e);
      this.pm.toggleCustomDialog();
      this.pm.setCatalog(this.data.allUnlock);
    },
    adThis(e) {
      console.log('广告解锁当前集', e);
      this.ad.show();
      // 监听视频播放完成
    },
    adAll(e) {
      console.log('广告解锁全集', e);
      this.ad.show();
    },

    //真实支付
    async realPayThis(e) {
      console.log('真实支付解锁当前集', e);
      // 每次更新下单信息
      data1.outOrderNo = `out_order_no_${getTimestamp()}`;
      console.log("参数", JSON.stringify(data1));

      let authorization = await IndustryBusiness.signV2("/requestOrder", data1, "POST");
      console.log("鉴权参数", JSON.stringify(authorization));
      tt.requestOrder({
        "byteAuthorization": authorization,
        "data": JSON.stringify(data1),
        "app_id": IndustryBusiness.getGlobalData().APPID,
        success: res => {
          console.log('下单成功', res);

          tt.getOrderPayment({
            orderId: res.orderId,
            success: res => {
              console.log('支付成功', res);
              tt.showToast({
                icon: 'success',
                title: '支付成功',
              });
              this.template.toggleCustomDialog();
              this.template.setCurrentUnlock();
            },
            fail: e => {
              console.error('支付失败', e);
              tt.showToast({
                icon: 'fail',
                title: '支付失败',
              });
            },
          });
        },
        fail: res => {
          console.log('下单失败', res);
          tt.showToast({
            icon: 'fail',
            title: '下单失败',
          });
        },
      });

    },

    async realPayAll(e) {
      console.log('真实支付解锁全集', e);
      // 每次更新下单信息
      data1.outOrderNo = `out_order_no_${getTimestamp()}`;
      console.log("参数", JSON.stringify(data1));

      let authorization = await IndustryBusiness.signV2("/requestOrder", data1, "POST");
      console.log("鉴权参数", JSON.stringify(authorization));
      tt.requestOrder({
        "byteAuthorization": authorization,
        "data": JSON.stringify(data1),
        "app_id": IndustryBusiness.getGlobalData().APPID,
        success: res => {
          console.log('下单成功', res);

          tt.getOrderPayment({
            orderId: res.orderId,
            success: res => {
              console.log('支付成功', res);
              tt.showToast({
                icon: 'success',
                title: '支付成功',
              });
              this.template.toggleCustomDialog();
              this.template.setCatalog(this.data.allUnlock);
            },
            fail: e => {
              console.error('支付失败', e);
              tt.showToast({
                icon: 'fail',
                title: '支付失败',
              });
            },
          });
        },
        fail: res => {
          console.log('下单失败', res);
          tt.showToast({
            icon: 'fail',
            title: '下单失败',
          });
        },
      });
    },

  }
})