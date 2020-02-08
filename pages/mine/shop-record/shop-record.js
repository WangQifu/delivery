//logs.js
const app = getApp()
const util = require('../../../utils/util.js')
var request = require('../../../utils/network/request.js');
var api = require('../../../utils/network/config.js').api;
Page({
	data: {
		tabIndex: 0,
		remind: '加载中',
		hasTabbar: false,
		shopRecordList: [],
		tabBars: [{
				id: 0,
				name: '今天'
			},
			{
				id: 1,
        name: '最近一月'
			},
			{
				id: 2,
				name: '全部订单'
			},
		]
	},
	onLoad: function() {
		// this.getshopRecordList();
	},
	onShow:function(){
		
	},
	tabTab: function(event) {
		this.setData({
			tabIndex: event.target.dataset.current
		})
	},
	changeTab: function(event) {
		this.setData({
			tabIndex: event.detail.current
		})
	},
	getshopRecordList: function() {
		var supply_id = app.globalData.userInfo.id;
		var that = this;
		var ajaxData = {
      // open-tab: 
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
	}
})
