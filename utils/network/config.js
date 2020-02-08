/** 
 * 小程序配置接口文件 
 */
const api = {
  // base_url: 'https://www.redouya.com/addons/zjhj_mall/core/web/index.php?r=', 
  base_url: 'http://192.168.0.121/addons/zjhj_mall/core/web/index.php?r=', 
  // base_url:'http://192.168.0.211/addons/zjhj_mall/core/web/index.php?r=',
  // base_url: 'http://www.localhdy.com/addons/zjhj_mall/core/web/index.php?r=',
  login:'delivery/joblogin/login',
	userInfo:'/api/userInfo',
	exceptionAddrArr:['/api/auth'], //不用token的地址
  delivery:{
    rob_index:'/delivery/delivery/index',
    prepare:'/delivery/delivery/prepare',
    operation:'/delivery/delivery/operation',
    pick_up:'/delivery/delivery/pick-up',
    transfer:'/delivery/delivery/transfer',
    handle_transfer:'delivery/delivery/handle-transfer',
    operation_next:'/delivery/delivery/operation-next',
    order_help:'/delivery/delivery/order-help',
    detail:'/delivery/delivery/detail',
    user:'/delivery/delivery/user',
    nearby_orders:'/delivery/delivery/nearby-orders',
    up_loca:'delivery/delivery/up-loca'
  },
  express:{
    order_search:'/delivery/express/index',
    sort_add:'/delivery/express/send',
    sorting_list:'/delivery/express/operation',
    sort_out: 'delivery/express/sort-out',
    sort_ok:'/delivery/express/operation-next',
    sao_order: '/delivery/express/sao-order',
	  completed:'delivery/express/complete',
  },
}

module.exports = { api }
