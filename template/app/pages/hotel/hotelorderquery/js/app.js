/**
 * Created by lqq.li on 16/5/24.
 */

import resultTpl from '../tpl/result.tpl';

module.exports = (() => {

	var util = qt.util,
		sec = 60,
		loopId;

	return qt.definePage({
		config: {
			init: function() {},
			ready: function() {},
			backMonitor: function (requestData) {
				if(requestData.vcode && requestData.vcode != '') {
					qt.href().param({vcode: ''}).replace();
					location.reload();
				}else {
					history.go(-1);
				}
			}
		},
		events: {
			'keyup input': 'validate',
			'tap .send-code': 'sendCode',
			'tap .submit-btn': 'submit',
			'tap .order-result-list li': 'toDetail'
		},
		templates: {},
		handles: {
			// 校验是否可点击提交
			validate: function() {
				var $tel = qt.$('.tel'),
					$vcode = qt.$('.vcode'),
					$submit = qt.$('.submit-btn');

				/^\d{11}$/.test($tel.val()) && $vcode.val() ?
					$submit.removeClass('disable') :
					$submit.addClass('disable');
			},

			// 发送验证码
			sendCode: function(e) {
				var $me = $(e.currentTarget),
					$tel = qt.$('.tel'),
					mobile = $tel.val();

				if ($me.hasClass('disable')) {
					return false;
				}

				if (!/^\d{11}$/.test(mobile)) {
					qt.alert({
						noHeader: true,
						message: '请填写正确的手机号码',
						onOk: function() {
							$tel.focus();
						}
					});

					return false;
				}
				$me.addClass('disable');
				$.ajax({
					url: "/api/hotel/hotelorderquery/vcode",
					type: "POST",
					data: {
						mobile: mobile
					},
					dataType: "json",
					timeout: 10000,
					error: function() {
						qt.alert("网络请求错误，请重试");
					},
					success: function(res) {
						$me.removeClass('disable');
						if (res.ret) {
							if (res.url && res.url.indexOf("/h5/challenge") !== -1) {
								var challengeUrl = "/h5/challenge?ctr=hotel.HotelOrderSendVCode&ret=" + encodeURIComponent(window.location.href);
								window.location.href = challengeUrl;
							} else {
								goTimer(qt.$('.send-code'));
								qt.$('.vcode').focus();
							}
						} else {
							qt.alert(res.msg);
						}
					}
				});

			},

			// 提交查询
			submit: function(e) {
				var $me = $(e.currentTarget),
					param = {};

				if ($me.hasClass('disable')) {
					qt.alert('请先填写完整信息');
					return false;
				}

				param = {
					mobile: qt.$('.tel').val(),
					vcode: qt.$('.vcode').val()
				};

				$me.addClass('disable');
				$.ajax({
					url: "/api/hotel/hotelorderquery",
					data: param,
					dataType: "json",
					error: function() {
						$me.removeClass('disable');
						qt.alert("网络请求错误，请重试");
					},
					success: function(res) {

						if (res.ret) {
							qt.$('.qt-body').html( _.template(resultTpl, {
								data: res.data
							}) );
							qt.$('.qt-header .title').changeHtml('查询结果');
							qt.href().param('vcode', param.vcode).replace();
						} else {
							$me.removeClass('disable');
							qt.alert(res.msg);
						}

					}
				});

			},

			// 跳转订单详情页
			toDetail: function(e) {
				var $me = $(e.currentTarget),
					orderNum = $me.data('ordernum'),
					mobile = $me.data('mobile'),
					url = $me.data('url');

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
							location.href = url + '&token=' + res.data;
						}
					}
				})
			}
		}
	});

	function goTimer($sendCode) {
		if (sec == 0) {
			$sendCode.removeClass("disable").html("获取验证码");
			sec = 60;
		} else {
			$sendCode.addClass("disable").html(sec + "秒后重发");
			sec--;
			loopId = setTimeout(function() {
				goTimer($sendCode)
			}, 1000);
		}
	}

})();