var wxApi = require('./base.js').wxApi;
var api = require('./config.js').api;


var tokenKey = "token"; //token
const method = {
	post:'POST',
	get:"GET",
}
const ACCESS_TOKEN = 'ACCESS_TOKEN';

function fetch({ url,data = '',method='POST' }){
	return new Promise((resolve,reject)=>{
		wxApi("getNetworkType").then(res=>{
			if(res.networkType == "none"){ //网络原因
				wx.showToast({
					title:"网络好像不太好哦，请稍候再试",
					icon:'none'
				})
			}else {
        data = data || {};
        var access_token = wx.getStorageSync(ACCESS_TOKEN);
        
        if (access_token) {
          data.access_token = access_token;
        }
        var user_id = wx.getStorageSync('userInfo');
        if (user_id){
          data.uid = user_id.id;
        }
				CreateHeader(url,function(header){
					console.log('准备发起请求')
					wxApi("request",{
						url:api.base_url + url,
            data: data || {},
            method: method || "GET",
            header: header || {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: "json",
					})
					.then(res=>{
            resolve(res.data)
            // 登录失败（未登录或通过access token 未找到用户）
            if (res.data.code == -1){
              getApp().globalData.userInfo = '';
              getApp().globalData.userlogin = false;
              wx.setStorageSync('userInfo', '');
              wx.setStorageSync('userlogin', false);
              wx.redirectTo({
                url: '/pages/index/index'
              })
              return false;
            }

						if(res.statusCode == 200){
							// if(url === api.login){
							// 	var tokenValue = res.data.token_type + ' ' + res.data.access_token;
							// 	console.log(tokenValue)
							// 	wx.setStorageSync(tokenKey,tokenValue)
							// }
							//成功
							// resolve(res.data)
						}else {
							wx.showToast({
								title:res.data.message,
								icon:'none'
							})
							return false;
						}
							
					}).catch(res=>{
						reject(res.data);
					})
				})
			}
		})
	})
}


/* *
 * @param url:String 请求地址
 * @param complete:Function 回调函数
 */

function CreateHeader(url,complete){
	var header = {
		'Content-Type':'application/x-www-form-urlencoded'
		// 'Content-Type':'application/json'
	}
	if(api.exceptionAddrArr.indexOf(url) == -1) {  //排除请求的地址不需要token的地址
		wx.getStorage({
			key:tokenKey,
			success:function(res){
				header.Authorization = res.data
			},
			fail:function(error){
				// console.log(error);
			},
			complete:function(){
				complete && typeof complete === 'function' ? complete(header) : null;
			}
		})
	}else {
		complete && typeof complete === 'function' ? complete(header) : null;
	}
	// console.log('header',header)
}
module.exports = { fetch,method };