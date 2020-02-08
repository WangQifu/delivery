// pages/home/home.js
const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    job_type: 1,//-1，
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   job_type: app.globalData.userInfo.job,
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  saoYiSao: function(){
    var self = this;
    wx.scanCode({ //扫描API
      // onlyFromCamera: true,//只允许从相机扫码 TODO 开发时屏蔽
      success(res) { //扫描成功
        console.log('扫码=', res.result) //输出回调信息
        self.orderSend(res.result);
      },
      fail(e) {
        console.log(e);
      }
    })
    
  },

  orderSend: function(code){
    request.fetch({
      url: api.express.sao_order,
      data: {
        code: code,
      },
    }).then(res => {
      if(res.code == 0){
        wx.showModal({
          title: '提示',
          content: '扫码备货成功',
          confirmText: '前往备货',
          success (res){
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/sort-out/sort-out',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      if (res.code == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return false;
      }
    }).catch(error => { })
  }

})