//index.js
//获取应用实例
const app = getApp();
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
var util = require('../../../utils/util.js');

Page({
	data: {
		remind: '加载中...'
	},
	onLoad: function(e) {
    var self = this;
    if (e.id) {
      // self.setData({
      //   option: e
      // })
      self.getGoodDetail(e.id, e.type)
		}

	},
	onShow: function() {
		// this.getDataFromStorage();
		console.log('从缓存中取得的列表值', this.data.shopGoodList)
	},
	/* onUnload: function() {
		this.saveDataToStorage();
	}, */
  getGoodDetail: function (id, type) {
    var self = this;
    // var order = self.data.option;
    request.fetch({
      url: api.delivery.detail,
      method: 'GET',
      data: {
        order_id: id,
        order_type: type
      }
    }).then(res => {
      console.log(res.data)
      self.setData({
        detail: res.data
      })
    }).catch(error => {

    })
  },
  callPhone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
	getDataFromStorage: function() { //从缓存中获取已经选择的商品列表
		var selectGoodArr = wx.getStorageSync('selectGoodArr') ? JSON.parse(wx.getStorageSync('selectGoodArr')) : [];
		this.setData({
			shopGoodList: selectGoodArr,
			remind: ''
		})
	},
	saveDataToStorage: function(shopGoodList) {
		wx.setStorageSync('selectGoodArr', JSON.stringify(shopGoodList));
		this.bindGoodList(shopGoodList);
	},
})
