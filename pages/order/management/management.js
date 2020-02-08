// pages/order/management/management.js
const app = getApp()
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
var util = require('../../../utils/util.js');
var audio = require('../../../utils/audio.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addSum: 0,
    order_list: [],
    selected: 'delivery',
    curOrderType: 0,
    page_id: 1,
    display: 5,
    keyword: '0',

    _UpdataTimer: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.order_search(this.data.selected, false);
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
    if (this.data._UpdataTimer > 0) {
      clearTimeout(this.data._UpdataTimer);
      this.data._UpdataTimer = 0;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {
    console.log('onPullDownRefresh==', e)
    this.order_search(this.data.selected);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log('onReachBottom==', e)
    if (this.data.order_list.length >= this.data.num[this.data.selected]) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    this.order_search(this.data.selected, true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 订单去重复
  uniqueArr: function(array) {
    var r = [];
    for (var i = 0, l = array.length; i < l; i++) {
      for (var j = i + 1; j < l; j++)
        if (array[i].order_id === array[j].order_id) j = ++i;
      r.push(array[i]);
    }
    return r;
  },
  order_search: function(type, next = false) {
    wx.showLoading({
      title: '更新中...',
      mask: true,
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })
    var self = this;
    if (!next) {
      var page_id = self.data.page_id = 1;
    } else {
      var page_id = self.data.page_id + 1
    }
    // var order = self.data.option;
    request.fetch({
      url: api.express.order_search,
      method: 'GET',
      data: {
        search_type: type, //'delivery',//self,
        page: page_id,
        keyword: self.data.keyword,
      }
    }).then(res => {
      console.log('order_search====', res, this.data.selected,page_id)
      if (res.code == 0) {
        if (next) {
          if (res.data.list.length > 0) {
            if (res.data.list.length >= self.data.display) self.data.page_id = page_id;
            // this.data.order_list = this.data.order_list.concat(res.data.list);
            //uniqueArr数组去重
            this.data.order_list = self.uniqueArr(this.data.order_list.concat(res.data.list));
          }
        } else {
          this.data.order_list = res.data.list;
          if (this.data.num) {
            var num = this.data.num;
            var newNum = res.data.num;
            if (newNum.delivery > num.delivery || newNum.self > num.self || newNum.group > num.group) {
              audio.audioPlay('https://www.redouya.com/addons/zjhj_mall/core/web/statics/voice/5611.wav');
            }
          }          
        }
        self.setData({
          order_list: this.data.order_list,
          num: res.data.num
        })
      } else {
        wx: wx.showToast({
          title: res.msg ? res.msg : '',
          icon: 'none',
          // image: '',
          duration: 3000,
          // mask: true,
          // success: function(res) {},
          // fail: function(res) {},
          // complete: function(res) {},
        })
      }
      wx.hideLoading();
    }).catch(error => {
      wx.hideLoading();
    })
    if (self.data._UpdataTimer > 0) {
      clearTimeout(self.data._UpdataTimer);
      self.data._UpdataTimer = 0;
    }
    self.data._UpdataTimer = setTimeout(function() {
      self.order_search(self.data.selected);
    }, 60e3);
  },
  changeSel: function(e) {
    var type = e.currentTarget.dataset.type;
    var type_id = e.currentTarget.dataset.type_id;
    this.setData({
      selected: type,
      curOrderType: type_id,
    })
    this.order_search(type, false);
  },
  sortAdd: function(order, only_add = false, index = 0) {
    console.log("sortAdd==", order);
    var self = this;
    wx.showLoading({
      title: '',
    })
    // var order = self.data.option;
    request.fetch({
      url: api.express.sort_add,
      method: 'POST',
      data: {
        order_id: order.order_id,
        order_no: order.order_no,
        order_type: self.data.curOrderType,
        is_offline: order.is_offline,

      }
    }).then(res => {
      // console.log('sortAdd-res====', res, this.data.order_list)
      // self.setData({})
      if (res.code == 0) {
        wx.hideLoading()
        if (only_add) {
          this.data.addSum += 1;
          this.data.num[this.data.selected] -= 1;
          this.setData({
            addSum: this.data.addSum,
          })
          if (this.data.order_list.length <= 2) {
            // wx.pageScrollTo({
            //   scrollTop: 0,
            // })
            this.order_search(this.data.selected);
          } else {
            this.data.order_list.splice(index, 1);
            this.setData({
              order_list: this.data.order_list,
              num: this.data.num
            })
          }
        } else {
          wx.navigateTo({
            // url: '/pages/order/picking/picking',
            url: '/pages/sort-out/sort-out?order_id=' + order.order_id + '&order_type=' + self.data.curOrderType,
          })
        }

      }
    }).catch(error => {})

  },
  startPicking: function(e) {
    var order = e.currentTarget.dataset.order;
    var ret = this.sortAdd(order);
  },
  addToStor: function(e) {
    var order = e.currentTarget.dataset.order;
    var index = e.currentTarget.dataset.index;
    var ret = this.sortAdd(order, true, index);
  },
  sortOut: function() {
    this.setData({
      addSum: 0
    })
    wx.navigateTo({
      // url: '/pages/order/picking/picking',
      url: '/pages/sort-out/sort-out',
    })
  },
  /**
   * 搜索
   */
  searchKey: function(e) {
    console.log('searchKey==', e);
    var self = this;
    self.setData({
      keyword: e.detail,
    }, function() {
      // self.order_search(this.data.selected, true);
    })
  }
})