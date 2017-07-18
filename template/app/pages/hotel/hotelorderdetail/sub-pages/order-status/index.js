/**
 * Created by rj.ren on 16/6/13.
 */

import orderStatusTpl from './tpl/changehistory.tpl';

module.exports = (() => {
	return qt.defineSubPage({
		config: {
			name: 'changeHistoryPage',
			animate: 'slideRight',
			forceRefresh: true,
			//页面初始化时执行
			init: (requestData, subPage) => {

			},
			//页面渲染完成时执行
			ready: (requestData, subPage) => {
				// var statusData = qt.getTransferData();
				// initPage(statusData);
			},
			onOpen: () => {

			}
		},
		templates: {
			header: function() {
				return `<nav class="icon previous left"></nav><div class="qt-bb-x1 title">订单状态</div>`;
			},
			body: function() {
				return _.template(orderStatusTpl, {
					data: qt.getTransferData()
				});

			},
			footer: ''
		}
	});
	// 依据订单状态，初始化订单状态页面
	function initPage(statusData) {
		var $statusItems = $('.statusitem');
		_.forEach($statusItems, function(item, index) {
			var $item = $(item);
			if (index <= statusData - 1) {
				$item.addClass('activeline');
				$item.find('.circle').addClass('activecircle');
				$item.addClass(index === statusData - 1 ? 'qt-blue' : 'qt-black');
			}

		})
	}
})();