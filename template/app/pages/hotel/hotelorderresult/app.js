/**
 * Created by chengyu.wang on 16/3/14.
 */

module.exports = (()=> {

	var util = qt.util,
		gonglue = navigator.userAgent.indexOf('qunartravel') !== -1;

	return qt.definePage({
		config: {
			init: function () {

			},
			ready: function () {

			}
		},
		events: {
			'tap .order-detail': 'linkToOrderDetail',
			'tap .hotel-detail': 'linkToHotelDetail'
		},
		templates: {},
		handles: {
			linkToOrderDetail: function(e, requestData, subPage){

				// native跳转攻略订单列表页
				if(gonglue) {
					document.location = 'http://touch.travel.qunar.com/client/order#order.list';
					return ;
				}
				// touch跳转到订单详情页
				document.location = '/hotel/hotelorderdetail?type='+requestData.type+'&token='+requestData.token+'&wrapperId='+requestData.wrapperId;
			},

			linkToHotelDetail: function(e, requestData, subPage){

				// native关闭webView
				if ( gonglue ) {
					qt.qunarApi.ready(function () {
						QunarAPI.hy.closeWebView();
					});
					return ;
				}
				// touch跳转到详情页
				document.location = '/hotel/hoteldetail?seq='+requestData.seq;
			}
		}
	});

})();
