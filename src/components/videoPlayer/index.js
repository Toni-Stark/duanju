Component({
  data: {},
  properties: {
    episode: {
      type: String,
      value: "",
    },
    album: {
      type: String,
      value: "",
    },
    cover: {
      type: String,
      value: "",
    },
    id: {
      type: Number,
      value: "",
    }
  },
  // id="{{id}}"

  // album-id="{{album}}"
  // episode-id="{{episode}}"

  methods: {
    getSourceHandler(e) {
      console.log(e,'111')
      this.triggerEvent('endLoad', {
        data
      })
    },
    nextVideo(e){
      console.log(e,'222')
      this.triggerEvent('endPlayer', { // 将当前选中的选项通过properties传递给外部
        data
      })
    },
    timeUpdateHandler(e){
      console.log(e,'333')
      this.triggerEvent('updateHandler', { // 将当前选中的选项通过properties传递给外部
        data
      })
    },
    error(e){
      console.log('error', e)
    }
  },
});
