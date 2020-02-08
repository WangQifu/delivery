//index.js
//获取应用实例
const app = getApp()
var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;
var util = require('../../utils/util.js');
var shop_num = 0;
Page({
  data: {
    shopList: [],
    orderList: [],
    nearbyList: [],
    shopSimpleList:[],
    userInfo: {},
    remind: '加载中',
    hasUserInfo: false,
    currentTab: 0,
    isShowNearby: false,
    page: 1,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    let self = this;
    self.getShopList();
    self.getOrderList();
    self.checkLocation();
    setInterval(function() {
      if (self.data.currentTab != 0) {
        self.getOrderList();
      }
      self.getLocation();
      // self.getShopListNum();
    }, 20000)
  },
  onShow: function() {
    // console.log(app.globalData.userlogin)
    // if (app.globalData.userlogin == '') {
    //   wx.redirectTo({
    //     url: '/pages/login/login'
    //   })
    //   return false;
    // }
  },
  onReady: function(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context

    // this.audioCtx.setSrc('../../images/media/5611.wav')
    let self = this;
    self.getShopListNum();
    setInterval(function() {
      self.getShopList();
      self.getShopListNum();
    }, 5000)
  },
  onPullDownRefresh() {
    this.getShopList();
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onScrollBottom: function() {
    var self = this;
    var page = self.data.page + 1;
    console.log('页', page)
    self.setData({
      page: page,
    })
    self.getShopList()
  },

  playVoice: function(name) {
    this.audioCtx = wx.createAudioContext(name)
    this.audioCtx.play()
  },

  getLocation() {
    let self = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        request.fetch({
          url: api.delivery.up_loca,
          method: 'POST',
          data: {
            position: longitude + ',' + latitude
          }
        }).then(res => {}).catch(error => {})
      }
    })
  },
  navigation: function(e) {
    this.checkLocation();
    var la = parseFloat(e.currentTarget.dataset.la);
    var lo = parseFloat(e.currentTarget.dataset.lo);
    var ad = e.currentTarget.dataset.address;
    console.log(e, la, lo)
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        wx.openLocation({
          latitude: la,
          longitude: lo,
          name: ad,
          address: ad
        })
      }
    })
  },
  //校验位置权限是否打开
  checkLocation() {
    let self = this;
    //选择位置，需要用户授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.showToast({ //这里提示失败原因
                title: '授权成功！',
                duration: 1500
              })
            },
            fail() {
              self.showSettingToast('需要授权位置信息');
            }
          })
        }
      }
    })
  },
  // 打开权限设置页提示框
  showSettingToast: function(e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },
  deWeightFour: function(arr) {
    var obj = {};
    arr = arr.reduce(function(a, b) {
      obj[b.id] ? '' : obj[b.id] = true && a.push(b);
      return a;
    }, [])
    return arr;
  },
  getShopListNum: function() {
    var self = this;
    request.fetch({
      url: api.delivery.rob_index,
      method: 'GET',
      data: {
        return_num: true
      }
    }).then(res => {
      if (res.data != self.data.shopListNum) {
        self.setData({
          shopListNum: res.data
        })
      }
      if (res.data > 0) {
        self.playVoice('qiangdan');
      }
    }).catch(error => {

    })
  },
  getShopList: function() {
    var self = this;
    request.fetch({
      url: api.delivery.rob_index,
      method: 'GET',
      data: {
        page: self.data.page
      }
    }).then(res => {
      console.log('抢单大厅', res.data)
      if (res.code == 1) {
        wx.showToast({
          title: '订单已被领取',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if (self.data.shopListNum != res.data.total) {
        self.setData({
          shopListNum: res.data.total
        })
      }
      if (self.data.orderList.length == 0) {
        var lis = self.data.shopSimpleList.concat(res.data.list);
        console.log()
        self.setData({
          shopSimpleList: self.deWeightFour(lis),
        })
        console.log(self.deWeightFour(lis))
      } else {
        if (res.data.list.length == 0) {
          self.setData({
            page: self.data.page - 1,
          })
          return;
        } else if (self.data.shopList.length == 0) {
          res.data.list.some((item, index) => {
            item.degs = 0;
            item.nearbyList = [];
          });
          self.setData({
            shopList: res.data.list,
            shopListNum: res.data.total,
          })
          console.log('抢单', self.data.shopList)
        } else if ([...res.data.list].pop().id == [...self.data.shopList].pop().id || self.data.shopList.length == self.data.shopListNum) {
          console.log('不变', self.data.shopList, res.data.list, self.data.shopListNum)
          return;
        } else {
          var list = self.data.shopList.concat(res.data.list);
          console.log('列表', res.data.list, self.data.shopList, self.deWeightFour(list))
          res.data.list.some((item, index) => {
            item.degs = 0;
            item.nearbyList = [];
          });
          self.setData({
            shopList: self.deWeightFour(list),
          })
        }
      }
      self.data.shopList.some((item, index) => {
        self.getNearbyList(item, index, 'shopList')
      });
    }).catch(error => {

    })
  },
  getOrderList: function() {
    var self = this;
    request.fetch({
      url: api.delivery.operation,
      method: 'GET'
    }).then(res => {
      console.log('待送达===', res.data);
      if (res.data.list.length == self.data.orderList.length) {
        res.data.list.some((item, i) => {

          if (item.logistic.b_type != self.data.orderList[i].logistic.b_type) {
            self.setData({
              ["orderList[" + i + "].logistic.b_type"]: item.logistic.b_type,
            })
          }
          if (item.logistic.transfer_job.id != self.data.orderList[i].logistic.transfer_job.id) {
            console.log()
            self.setData({
              ["orderList[" + i + "].logistic.transfer_job"]: item.logistic.transfer_job,
              ["orderList[" + i + "].logistic.s_user_id"]: item.logistic.s_user_id,
            })
          }
          if (item.logistic.accept_transfer != self.data.orderList[i].logistic.accept_transfer) {
            self.setData({
              ["orderList[" + i + "].logistic.accept_transfer"]: item.logistic.accept_transfer,
            })
          }
          if (item.logistic.s_type != self.data.orderList[i].logistic.s_type) {
            self.setData({
              ["orderList[" + i + "].logistic.s_type"]: item.logistic.s_type,
            })
          }
        });
      }
      if (self.data.transferList) {
        self.data.transferList.some((item, i) => {
          if (item.num != self.data.transferList[i].num) {
            self.setData({
              ["transferList[" + i + "].name_num"]: item.name_num,
            })
          }
          // console.log('job', self.data.transferList, res.data.jobs)
        });
      }

      if (res.data.list.length != self.data.orderList.length) {
        var ret = res.data.list.some(item => {
          item.order.tail_mobile = item.order.mobile.slice(-4);
          var dist = parseFloat(item.order.address_data.dis).toFixed(1);
          item.order.address_data.dist = dist;
          item.order.degs = 0;
          var nowTime = Date.parse(new Date()) / 1000;
          var when = (item.user_time.end_time - nowTime) > 0 ? (item.user_time.end_time - nowTime) / 60 : 0;
          item.user_time.when = parseInt(when);
          item.user_time.countdown = util.formatTimeTwo(item.user_time.end_time, 'Y/M/D h:m');
          // item.nearbyList = [];
        });

        self.setData({
          orderList: res.data.list,
          transferList: res.data.jobs,
          deliveryUser: res.data.userdata
        })

      }

      self.data.orderList.some((item, index) => {
        if (self.data.deliveryUser.id != item.logistic.s_user_id) {
          self.playVoice('zhuandan');
        }
        self.getNearbyList(item.order, index, 'orderList')
      });

    }).catch(error => {

    })
  },
  getNearbyList: function(e, i, list_name) {
    var self = this;
    // console.log('e===', e, i, list_name)
    var ajaxData = {
      order_no: e.order_no,
      order_type: e.order_type,
      radius: 1
    }
    request.fetch({
      url: api.delivery.nearby_orders,
      method: 'GET',
      data: ajaxData
    }).then(res => {
      // if (res.data.length > self.data.list[i].nearbyList.length) {
      var ret = res.data.some(item => {
        item.degs = 0;
        // console.log(item);
      });
      self.setData({
        [`${list_name}[${i}].nearbyList`]: res.data,
      })
      // console.log('neary===', self.data.orderList, res.data)
      // }
    }).catch(error => {

    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  clickTab: function(e) {
    var self = this;
    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  swiperTab: function(e) {
    var self = this;
    self.setData({
      currentTab: e.detail.current
    });
  },
  orderModal: function(e) {
    var self = this;
    var i = e.currentTarget.dataset.index;
    var shopList = self.data.shopList;
    var shopSimpleList = self.data.shopSimpleList;
    var orderList = self.data.orderList;
    // console.log(e, shopList[i].id, shopList[i].order_no, shopList[i].logistics_id);

    var ajaxData = {
      order_id: orderList.length == 0 ? shopSimpleList[i].id : shopList[i].id,
      order_no: orderList.length == 0 ? shopSimpleList[i].order_no : shopList[i].order_no,
      id: orderList.length == 0 ? shopSimpleList[i].logistics_id : shopList[i].logistics_id
    }
    wx.showModal({
      title: '抢单提示',
      content: '确认接订单吗？',
      confirmColor: '#3C9CE8',
      success(res) {

        if (res.confirm) {
          request.fetch({
            url: api.delivery.prepare,
            method: 'POST',
            data: ajaxData
          }).then(res => {
            console.log(res)
            if (res.code == 1) {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              return;
            }
            var newArr = shopList.reduce((total, current) => {
              current.id != shopList[i].id && total.push(current);
              return total;
            }, []);
            var new_arr = shopSimpleList.reduce((total, current) => {
              current.id != shopSimpleList[i].id && total.push(current);
              return total;
            }, []);
            console.log('newArr', newArr, new_arr);
            self.setData({
              shopList: newArr,
              shopSimpleList: new_arr
            })
            self.playVoice('grabSuccess');
            self.onLoad()
          }).catch(error => {

          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })
  },
  callPhone: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  takeOrder: function(e) {
    var self = this;
    var i = e.currentTarget.dataset.index;
    var orderList = self.data.orderList;
    var ajaxData = {
      order_id: orderList[i].order.id,
      order_no: orderList[i].order.order_no,
      id: orderList[i].logistic.id
    }
    wx.showModal({
      title: '取货提示',
      content: '确认取货？',
      confirmColor: '#3C9CE8',
      success(res) {
        if (res.confirm) {
          request.fetch({
            url: api.delivery.pick_up,
            method: 'POST',
            data: ajaxData
          }).then(res => {
            console.log(res)
            self.onLoad();
          }).catch(error => {

          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })

  },
  cannotTakeOrder: function(e) {
    wx.showToast({
      title: '仓库配货未完成',
      icon: 'none',
      duration: 2000
    })
  },
  haveReached: function(e) {
    var self = this;
    var i = e.currentTarget.dataset.index;
    var orderList = self.data.orderList;
    var ajaxData = {
      order_id: orderList[i].order.id,
      order_no: orderList[i].order.order_no,
      id: orderList[i].logistic.id
    }
    wx.showModal({
      title: '订单完成',
      content: '确认订单送达？',
      confirmColor: '#3C9CE8',
      success(res) {
        if (res.confirm) {
          request.fetch({
            url: api.delivery.operation_next,
            method: 'POST',
            data: ajaxData
          }).then(res => {
            console.log(res)
            self.playVoice('songda')
            self.onLoad()
          }).catch(error => {

          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })
  },
  transferOrder: function(e) {
    var self = this;
    var orderList = self.data.orderList;
    var transferList = self.data.transferList;
    console.log('picker发送选择改变，携带值为', e.detail.value, e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var i = e.detail.value;
    var cancel = e.currentTarget.dataset.cancel;

    var transfer_id = cancel ? 0 : transferList[i].id
    // console.log('转交id', transfer_id, cancel)
    var ajaxData = {
      order_id: orderList[index].order.id,
      transfer_id: transfer_id
    }
    request.fetch({
      url: api.delivery.transfer,
      method: 'POST',
      data: ajaxData
    }).then(res => {
      console.log(res)
      self.onLoad()
    }).catch(error => {

    })

    self.setData({
      index: e.detail.value
    })
  },
  handleTransfer: function(e) {
    var self = this;
    var order_id = e.currentTarget.dataset.order_id;
    var transfer = e.currentTarget.dataset.transfer;
    console.log(e)
    var orderList = self.data.orderList;
    var cont = transfer == 0 ? '接受转接订单吗？' : '拒绝转接订单吗？'
    var ajaxData = {
      order_id: order_id,
      is_refuse: transfer
    }

    wx.showModal({
      title: '转接订单',
      content: cont,
      confirmColor: '#3C9CE8',
      success(res) {
        if (res.confirm) {
          request.fetch({
            url: api.delivery.handle_transfer,
            method: 'POST',
            data: ajaxData
          }).then(res => {
            self.onLoad()
          }).catch(error => {

          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })
  },
  rotateAnim: function(e) {
    var self = this;
    var i = e.currentTarget.dataset.index;
    var orderList = self.data.orderList;
    var deg = self.data.orderList[i].order.degs;

    deg = deg == 0 ? 180 : 0;
    // console.log(i, deg, orderList[i].order)
    self.setData({
      ["orderList[" + i + "].order.degs"]: deg
    })
  },
  rotateShop: function(e) {
    var self = this;
    var i = e.currentTarget.dataset.index;
    var shopList = self.data.shopList;
    var deg = self.data.shopList[i].degs;

    deg = deg == 0 ? 180 : 0;
    // console.log(i, deg, orderList[i].order)
    self.setData({
      ["shopList[" + i + "].degs"]: deg
    })
  },
  orderHelp: function(e) {
    var self = this;
    var i = e.currentTarget.dataset.index;
    var orderList = self.data.orderList;
    var ajaxData = {
      id: orderList[i].logistic.id,
      is_help: 1
    }

    wx.showModal({
      title: '联系帮助',
      content: '确认无法联系客户需要帮助？',
      confirmColor: '#3C9CE8',
      success(res) {
        if (res.confirm) {
          request.fetch({
            url: api.delivery.order_help,
            method: 'POST',
            data: ajaxData
          }).then(res => {

          }).catch(error => {

          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })
  },
  changePassword: function(e) {
    var self = this
    self.setData({
      isShowConfirm: true,
    })
  },
  setValue: function(e) {
    this.setData({
      walletPsd: e.detail.value
    })
  },
  cancel: function() {
    var self = this
    self.setData({
      isShowConfirm: false,
    })
  },
  confirmAcceptance: function(e) {
    var self = this;
    var user = self.data.deliveryUser;
    var pass = e.currentTarget.dataset.password;
    console.log(user.id, pass)
    var ajaxData = {
      id: user.id,
      password: pass
    }

    request.fetch({
      url: api.delivery.user,
      method: 'POST',
      data: ajaxData
    }).then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })
      self.setData({
        isShowConfirm: false,
      })
    }).catch(error => {

    })
  },
  orderRecord: function() {
    var supply_id = app.globalData.userInfo.id;
    var that = this;
    var ajaxData = {
      // open-tab: ''
    }
    request.fetch({
      url: api.delivery.user,
      method: 'GET',
      data: ajaxData
    }).then(res => {
      console.log(res)
      var data = res.data;
      /* data.forEach((item,index)=>{
      	item.device_image_url = app.globalData.imageUrlPath + item.device_image_url
      }) */
      // this.setData({
      // 	shopRecordList: data,
      // 	remind: '',
      // })
    }).catch(error => {

    })
  },
  takePhoto: function() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  logNearby: function(e) {
    var self = this;
    console.log('isShowNearby===', e)
    self.setData({
      nearby_index: e.currentTarget.dataset.index,
      isShowNearby: !self.data.isShowNearby
    })
  },
  sendMessage: function() {
    wx.showToast({
      title: '功能暂未开放',
      icon: 'none',
      duration: 2000
    })
  }
})