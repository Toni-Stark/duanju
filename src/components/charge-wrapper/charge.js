Component({
  data: {
    ssss: 'asdasdsd'
  },
  properties: {
     // 目前不支持 props 传参 下面参数不需要传递, 行业sdk透传
    seq: {
      type: Number,
    },
    albumId: {
      type: String,
    },
    episodeId: {
      type: String,
    },
  },
  ready: function () {
    console.log(this,'this')
    console.error(this.properties,'测试');
    console.error(this.data,'测试');
  },
})
