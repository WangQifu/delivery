// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value:{},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _scanCode: function (){
      var self = this;
      wx.scanCode({ //扫描API
        // onlyFromCamera: true,//只允许从相机扫码 TODO 开发时屏蔽
        success(res) { //扫描成功
          // console.log('扫码=',res) //输出回调信息
          self.triggerEvent('tcode', res);
        },
        fail(e) {
          console.log(e);
        }
      })
    },
    _inputConfirm: function (e){
      var self = this;
      var keyword = e.detail.value;

      self.setData({
        keyword: keyword,
      });
      self.triggerEvent('search', keyword);
    },
    _inputCon:function (e)
    {
      var self = this;
      self._inputConfirm(self.data.value);
    },
    _inputBlur: function (e) {
      var self = this;
      self.setData({
        value: e
      });
      self.triggerEvent('search', e.detail.value);
    },
  }
})
