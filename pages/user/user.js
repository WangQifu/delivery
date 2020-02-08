// pages/user/user.js
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_id: 1,
    userInfo: [],
    count: 0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      user: userInfo,
    })
    this.getCompleted(1);
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
  onReachBottom: function(e) {
    console.log('onReachBottom==', e)
    if (this.data.list.length >= this.data.count) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    this.data.page_id += 1;
    this.getCompleted(this.data.page_id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //==========================================
  getCompleted: function(page_id) {
    var self = this;
    wx.showLoading({
      title: '更新中...',
      mask: true,
    })
    var self = this;
    request.fetch({
      url: api.express.completed,
      method: 'GET',
      data: {
        page: page_id,
        // limit:
      }
    }).then(res => {
      if (res.code == 0) {
        console.log('======', res);
        this.data.list = this.data.list.concat(res.data.list);
        this.setData({
          list: this.data.list,
          count: res.data.row_count
        })
      } else {
        this.data.page_id = 1;
        wx: wx.showToast({
          title: res.msg ? res.msg : '',
          icon: 'none',
          duration: 3000,
        })
      }
      wx.hideLoading();
    }).catch(error => {
      wx.hideLoading();
    })
  },
})