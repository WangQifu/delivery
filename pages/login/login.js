//index.js

var request = require('../../utils/network/request.js');
var api = require('../../utils/network/config.js').api;

//获取应用实例
const app = getApp()

Page({
  data: {
    autoFocus: false,
    userInfo: {},
    hasUserInfo: false,
	  is_pwd:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLogin:false,
  },
  //事件处理函数
  loginSubmit: function(e) {
		console.log(e)
		var account = e.detail.value.account;
		var password = e.detail.value.password;
		var ajaxData = {
			account:account,
			password:password
		}
		if(account == '' || password == '') {
			wx.showToast({
				title:'用户名或密码不能为空',
				icon:'none',
				duration: 1500
			})
			return false;
		}
		console.log(api.login)
		wx.showLoading({
			title:'正在登录中...'
		})
		request.fetch({
			url:api.login,
			data:ajaxData
		}).then(res=>{
      console.log("登录结果", res);
      if(res.code == 1){
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return false;
      }

			// 用户信息
      app.globalData.userInfo = res.data;
      app.globalData.userlogin = true;
      wx.setStorageSync('userInfo', res.data);
      wx.setStorageSync('userlogin', true);
      app.globalData.ACCESS_TOKEN = res.data.access_token;
      wx.setStorageSync('ACCESS_TOKEN', res.data.access_token);

      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })
      if (res.data.job == 1){
        wx.redirectTo({
          url: '/pages/warehouse/warehouse'
        })
      }
      else{
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/shop-list/shop-list'
          })
        }, 2000);
      }

			// request.fetch({
			// 	url:api.userInfo,
			// 	method:'GET'
			// }).then(res=>{
			// 	console.log('userInfo',res);
			// 	app.globalData.userInfo = res;
			// 	app.globalData.userlogin = true;
			// 	wx.setStorageSync('userInfo', res);
			// 	wx.setStorageSync('userlogin', true);
			// 	wx.showToast({
			// 		title:'登录成功',
			// 		icon:'success',
			// 		duration:2000
			// 	})
					
			// 	setTimeout(function() {
			// 		wx.switchTab({
			// 		  url: '/pages/shop-list/shop-list'
			// 		})
			// 	}, 2000);
				
			// })
		}).catch(error=>{
			wx.showToast({
				title:'登录失败',
				icon:'none'
			})
		})
				
		console.log(ajaxData)
    
  },
  onLoad: function () {
    console.log('=====================')
    if (app.globalData.userInfo != '') {
      // navigateTo,redirectTo
      if (app.globalData.userInfo.job == 0){
        wx.switchTab({
          url: '/pages/shop-list/shop-list'
        })
      } else if(app.globalData.userInfo.job == 1){
        wx.redirectTo({
          url: '/pages/warehouse/warehouse'
        })
      }
      return;
    }

    this.setData({
      showLogin:true,
    })

  },
  openIndex: function () {
    wx.switchTab({
      url: '/pages/shop-list/shop-list'
    })
    console.log(123)
  },
  togglePwd:function(){
	  var that = this;
	  var is_pwd = that.data.is_pwd;
	  that.setData({
		  is_pwd:!is_pwd
	  })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
