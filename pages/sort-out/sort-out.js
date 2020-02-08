// pages/sort-out/sort-out.js
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
var helper = require('../../utils/helper.js');
var audio = require('../../utils/audio.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isDrop: false,
    order_id: -1,
    orderList: [],
    isScrollTop: true,
    isRightHand: false,
    order: [],
    attr: [],
    sort_out_list: [],
    goods_list: [],
    keyword: '0',
    order_type: 0,
    logistics: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.order_id) {
      this.data.order_id = options.order_id;
      this.data.order_type = options.order_type;
      this.orderDetail(this.data.order_id, this.data.order_type);
    }
    if (this.data.order_id == -1) {
      this.getSortingList();
    }
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
  onPageScroll: helper.debounce(function(e) {
      if (e[0].scrollTop > 100 && this.data.isScrollTop) {
        this.setData({
          isScrollTop: false
        });
      } else if (e[0].scrollTop < 100 && !this.data.isScrollTop) {
        this.setData({
          isScrollTop: true
        });
      }
    },
    100),
  //=========================================================================//
  changeSel: function(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      selected: type,
    })
  },
  /**
   * 订单详情
   */
  // orderDetail: function (order_id, order_type) {
  //   var self = this;
  //   request.fetch({
  //     url: api.express.sort_out,
  //     data: {
  //       order_id: order_id,
  //       keyword: self.data.keyword,
  //       order_type: order_type,
  //     },
  //   }).then(res => {
  //     console.log("返回结果", res);
  //     this.setData({
  //       order: res.data.order,
  //       attr: res.data.order.attr,
  //       goods_list: res.data.goods_list,
  //       logistics: res.data.logistics,
  //     })
  //     if (res.code == 1) {
  //       wx.showToast({
  //         title: res.msg,
  //         icon: 'none'
  //       })
  //       return false;
  //     }
  //   }).catch(error => { })

  // },
  orderDetail: function(order_id, order_type) {
    var self = this;
    request.fetch({
      url: api.express.sort_out,
      data: {
        order_id: order_id,
        keyword: self.data.keyword,
        order_type: order_type,
      },
    }).then(res => {
      console.log("返回结果", res);
      // self.data.orderList.push(res.data.order)
      // console.log("返回结果=====", self.data.orderList);
      this.setData({
        order: res.data.order,
        attr: res.data.order.attr,
        goods_list: res.data.goods_list,
        logistics: res.data.logistics,
        // orderList: self.data.orderList,
      })
      if (res.code == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return false;
      }
    }).catch(error => {})

  },
  /**
   * 扫码获得条形码数据
   */
  shaoCode: function(e) {
    var self = this;
    var res = e.detail;
    console.log('jieguo==', res);
    if (res.scanType == "WX_CODE") {

    } else {
      console.log('条形码', res.result);
      self.sortOut(res.result);
    }
  },
  /**
   * 执行分拣
   */
  sortOut: function(no) {

    var self = this;
    var attr_list = self.data.attr;
    var add_list = self.data.sort_out_list;
    let end_tip = false;
    for (let index in attr_list) {
      let order_no = attr_list[index]['attr'][0]['no'];
      if (no == order_no) {
        add_list[add_list.length] = attr_list[index];
        attr_list.splice(index, 1);
        end_tip = true;
        wx.showToast({
          title: '分拣成功',
          icon: 'none'
        })

      }
      if (index == attr_list.length - 1 && !end_tip) {
        wx.showToast({
          title: '商品错误',
          icon: 'none'
        })
      }
    }
    self.setData({
      sort_out_list: add_list,
      attr: attr_list,
    })
    console.log("执行结果1", self.data.attr);
    console.log("执行结果2", self.data.sort_out_list);
  },
  // 获取待备货列表
  getSortingList: function() {
    var self = this;
    // var order = self.data.option;
    var user_Info = wx.getStorageSync('userInfo');
    console.log('userinfo', user_Info);
    request.fetch({
      url: api.express.sorting_list,
      method: 'GET',
    }).then(res => {
      console.log('sorting_list====', res)
      // self.setData({})
      if (res.code == 0) {
        self.setData({
          deliveryList: res.data.delivery,
          selfList: res.data.self,
          selected: 'delivery',
        })
      }
    }).catch(error => {})
  },
  sortOK: function() {
    var order = this.data.logistics;
    var self = this;
    request.fetch({
      url: api.express.sort_ok,
      method: 'POST',
      data: {
        order_id: order.order_id,
        order_no: order.o_number,
        order_type: order.order_type,
        is_offline: order.is_offline,
        id: order.id,
      }
    }).then(res => {
      console.log('sortOK====', res)
      // self.setData({})
      if (res.code == 0) {}
    }).catch(error => {})

  },
  /**
   * 搜索
   */
  searchKey: function(e) {
    console.log('sousu', e);
    this.setData({
      keyword: e.detail,
    })
    // this.orderDetail(0);
  },
  orderSend: function(e) {
    var self = this;
    var order = e.target.dataset;
    wx.showLoading({
      title: '',
    })
    // console.log(order, e);
    request.fetch({
      url: api.express.sort_ok,
      method: 'POST',
      data: {
        order_id: order.order_id,
        order_no: order.no,
        order_type: order.ordertype,
        is_offline: order.offline,
        id: order.lid,
      }
    }).then(res => {
      wx.hideLoading()
      console.log('sortOK====', res)
      // self.setData({})
      if (res.data.code == 0) {
        // audio.audioPlay('https://www.redouya.com/addons/zjhj_mall/core/web/statics/voice/备货完成.wav');
        self.popOrder(order.index);
        wx.showToast({
          title: res.data.msg
        })
      }

    }).catch(error => {})
  },
  popOrder: function(index) {
    if (this.data.selected == 'delivery') {
      this.data.deliveryList.splice(index, 1);
      this.setData({
        deliveryList: this.data.deliveryList,
      })
    } else if (this.data.selected == 'self') {
      this.data.selfList.splice(index, 1);
      this.setData({
        selfList: this.data.selfList,
      })
    }
  },
  gotoTop: function() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  checkHandChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', this.data.isRightHand, e.detail.value, e)
    this.setData({
      isRightHand: (e.detail.value == "r") ? true : false,
    })

  }

})