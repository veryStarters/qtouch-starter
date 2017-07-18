/**--
 - User: rj.ren
 - Date: 16/5/24
 */
import offlineTpl from '../tpl/offlinetpl.tpl';
import onlineTpl from '../tpl/onlinetpl.tpl';
import loadmoreTpl from '../tpl/loadmore.tpl';

module.exports = (() => {

	var util = qt.util,
		PAGE_INIT = 1,
		currentParam = {
			statusType: qt.requestData.statusType || 0,
			type: qt.requestData.type || 0,
			pageIndex: qt.requestData.pageIndex || PAGE_INIT,
			hotelName: ''
		},
		localOrder = function() {
			return {
				// 获取离线订单
				get: function() {
					var data = {
							keys: [],
							values: []
						},
						pattType = qt.requestData.type == 1 ? /^zorder/g : /^horder|zorder/g;

					for (var i = 0, len = localStorage.length; i < len; i++) {
						var key = localStorage.key(i);
						if (key.match(pattType)) {
							var objData = JSON.parse(localStorage.getItem(key));
							data.values.push(objData);
							data.keys.push(key)
						}
					}

					// 订单按时间排序
					data.values = _.sortBy(data.values, 't').reverse();

					return data;
				},

				// 删除离线订单
				remove: function(keys) {
					_.each(keys, function(item) {
						localStorage.removeItem(item);
					});
				}
			}
		},
		myLocalOrder = localOrder().get(),
		$listBox = qt.$('.order-result-box');

	return qt.definePage({
		config: {
			init: function() {
				if (!qt.commonParam.isLogin) {
					$('.qt-body').css('top', '0');
					qt.$('.qt-tip').removeClass('qt-hide');
				}
			},
			ready: function() {
				tabLineEffect();

				if (!qt.commonParam.isLogin) {
					$listBox.html(_.template(offlineTpl, {
						orders: myLocalOrder.values
					}));
				} else {
					// 登陆状态下同步订单
					orderSync();
				}

			},
			backMonitor: function() {
				location.href = '/hotel/';
			}
		},
		events: {
			'tap .condition-select li': 'tabSwitch',
			'tap .order-result-list li': 'toDetail',
			'tap .load-more': 'loadMore',
			'tap .login': 'toLogin',
			'tap .query-btn': 'toQuery'
		},
		handles: {
			tabSwitch: function(e) {
				var $target = $(e.currentTarget);

				if ($target.hasClass('active')) {
					return;
				}

				$target.addClass('active').siblings().removeClass('active');

				// 下划线进入效果
				tabLineEffect();

				qt.href().param({
					statusType: $target.data('value')
				}).replace();

				// 加载数据
				currentParam.statusType = $target.data('value');
				currentParam.pageIndex = PAGE_INIT;
				loadData(currentParam, function(res) {

					$listBox.fadeOut(100, function() {
						$listBox.html(util.template(onlineTpl, {
							data: res.data ? res.data : {
								order: [],
								page: 1,
								count: 1
							}
						})).fadeIn(200, function() {
							qt.scrollTo(0);
						});
					});
				});
			},

			// 去订单详情页
			toDetail: function(e) {
				var $me = $(e.currentTarget),
					wrapperId = $me.data('wrapperid'),
					orderNum = $me.data('ordernum'),
					mobile = $me.data('mobile'),
					type = qt.requestData.type;

				if (!qt.commonParam.isLogin) {

					$.ajax({
						type: 'POST',
						url: '/api/hotel/hotelordertoken',
						data: {
							orderNo: orderNum,
							smobile: mobile
						},
						dataType: 'json',
						success: function(res) {
							if (res && !res.data) {
								qt.alert('查询订单失败，请您稍后再试。');
							} else {
								location.href = qt.commonParam.host.touch + '/hotel/hotelorderdetail?type=' + type + '&wrapperId=' + wrapperId + '&token=' + res.data;
							}
						}
					})

				}
			},
			loadMore: function(e) {
				var $me = $(e.currentTarget),
					$ul = qt.$('.order-result-list'),
					$icon = $me.find('.icon');

				if ($me.hasClass('active')) {
					return false;
				}
				$me.addClass('active');
				$icon.removeClass('qt-hide');

				currentParam.pageIndex = currentParam.pageIndex + 1;

				loadData(currentParam, function(res) {

					$me.removeClass('active');
					$icon.addClass('qt-hide');

					var lastIndex = $ul.children().length,
						scrollTop = $me.offset().top - 228;

					$ul.append(util.template(loadmoreTpl, {
						orders: res.data && res.data.order ? res.data.order : []
					}));
					qt.scrollTo(scrollTop, function() {
						qt.flash($ul.children().get(lastIndex), true)
					});

					if (res.data.count == res.data.page) {
						$me.html('已加载全部');
						$me.addClass('active');
					}
				});
			},
			toLogin: function(e) {
				window.location.href = qt.commonParam.host.userCenter + '/mobile/login.jsp?ret=' + qt.commonParam.host.touch + '/hotel/hotelorderlist?type=' + (qt.requestData.type || 0) + '&statusType=' + qt.requestData.statusType;

			},

			toQuery: function() {
				location.href = '/hotel/hotelorderquery';
			}
		}
	});

	//header中tab 下划线进入效果
	function tabLineEffect() {
		var $activeTab = qt.$('.qt-sub-header .active'),
			transItems = {
				width: '25%'
			};
		transItems[$.fx.cssPrefix + 'transform'] = 'translate3d(' + ($activeTab.length ? $activeTab[0].offsetLeft : 0) + 'px, 0, 0)';
		qt.$('.line').css(transItems);
	}

	function loadData(param, sucFn) {
		qt.showTips({
			message: '正在加载，请稍后…',
			mask: true,
			maskOpacity: 0.0001
		});

		$.ajax({
			url: '/api/hotel/hotelorderlist',
			type: 'get',
			dataType: 'json',
			data: param,
			success: function(res) {

				setTimeout(qt.hideTips(), 600);
				sucFn && sucFn(res);

			},
			error: function(res) {
				qt.alert('数据加载失败,请稍后重试!');
			}
		})
	}

	//订单同步
	function orderSync() {
		var orders = _.map(myLocalOrder.values, function(order) {
			return {
				orderno: order.orderno || '',
				mobile: order.mobile || '',
				wrapperId: order.wrapperid || ''
			};
		});

		if (!orders.length) {
			return false;
		}

		qt.confirm({
			noHeader: true,
			contentCenter: true,
			message: '发现' + orders.length + '个未绑定订单,绑定到当前账号?',
			okText: '绑定',
			cancelText: '忽略',
			onOk: function () {
				// 同步
				$.ajax({
					url: '/api/hotel/hotelorderlink',
					data: {
						orders: JSON.stringify(orders)
					},
					dataType: 'json',
					success: function(data) {
						if (data && data.ret) {
							setTimeout(function () {
								qt.alert({
									message: '订单同步成功！离线订单已关联账号，查询订单时请注意保持登录状态。',
									onOk: function () {
										localOrder().remove(myLocalOrder.keys);
										location.reload();
									}
								})
							}, 600);
						}
					},
					error: function() {
						setTimeout(function () {
							qt.confirm({
								message: '离线订单关联失败，请点击确定按钮，再次尝试',
								onOk: function() {
									orderSync();
								}
							})
						}, 600);
					}
				})
			}
		});
	}
})();