Component({
  data: {},
  properties: {
    data: {
      type: Object,
      value: {},
    },
  },
  methods: {
    getSourceHandler(e) {
      this.triggerEvent('endLoad', {
        data
      })
    },
    nextVideo(){
      this.triggerEvent('endPlayer', { // 将当前选中的选项通过properties传递给外部
        data
      })
    },
  },
});
