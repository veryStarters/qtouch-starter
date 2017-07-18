/**
 * Created by lqq.li on 16/8/3.
 */
module.exports = (() => {
	var util = qt.util,
		qua = function () {
			var ua = navigator.userAgent;
			return {
				iphonePro: ua.indexOf("QunariPhonePro") !== -1,
				iphoneLife: ua.indexOf("QunariPhoneLife") !== -1,
				iphone: ua.indexOf("QunariPhone") !== -1,
				androidLife: ua.indexOf("qunaraphonelife") !== -1,
				android: ua.indexOf("qunaraphone") !== -1,
				ipad: /ipad/ig.test(ua),
				ua: ua
			}
		}(),
		isClient = function () {
		return qua.iphone || qua.iphoneLife || qua.iphonePro || qua.android || qua.androidLife;
		}(),
		getClientUrl = function (href) {
			if (qua.iphonePro) {
				return "qunariphonepro://" + href;
			} else if (qua.iphoneLife) {
				return "qunariphonelife://" + href;
			} else if (qua.iphone) {
				return "qunariphone://" + href;
			} else if (qua.androidLife) {
				return "qunaraphonelife://" + href;
			} else if (qua.android) {
				return "qunaraphone://" + href;
			}
		},
		sec = 60,
		loopId;

	return qt.definePage({
		config: {
			init: function() {
				var _Captcha = {
					initCaptcha:function(duration){
						var interval = duration || 1000*60*3 ;
						$.getJSON('https://secapi.qunar.com/api/noCaptcha/get.json?callback=?', function(captcha){
							util.cookie('QN254',captcha,'/',new Date(Date.now() + interval));
						});
						window.Timer = setTimeout(this.initCaptcha,interval);
					},
					refreshCaptcha:function(){
						clearTimeout(window.Timer);
						this.initCaptcha();
					}
				}
				_Captcha.initCaptcha();
				$.Captcha = _Captcha;
			},
			ready: function() {
				if(qt.firstData.isend) {
					qt.$('.card .over').removeClass('hide');
					qt.$('.go-other .over').removeClass('hide');
					return ;
				}

				qt.$('.card .voucher-info').removeClass('hide');

				if(qt.requestData.mobile) {
					qt.$('.operate .btn-box').removeClass('hide');
				}else {
					qt.$('.operate .input-box').removeClass('hide');
				}

				qt.qunarApi.ready(function () {
					QunarAPI.onMenuShare({
						title: '七夕夜朝思暮想，不如相约今晚！领券超值订酒店！【去哪儿网】', // 标题
						link: location.href, // 链接URL
						desc: '立即领取酒店代金券，超值酒店抢先订！', // 描述
						imgUrl: 'http://simg1.qunarzz.com/site/images/zhuanti/huodong/20160805qixi.png', // 分享图标
						success: function () {
						},// 用户确认分享后执行的回调函数
						cancel: function () {
						} // 用户取消分享后执行的回调函数
					});
				})
			}
		},
		events: {
			'input input[name="mobile"],input[name="vcode"]': 'verify',
			'tap .get-vcode': 'getVcode',
			'tap .submit': 'submit',
			'tap .jump-btn': 'toHotel'
		},
		handles: {
			verify: function (e) {
				var mobile = qt.$('input[name="mobile"]').val(),
					vcode= qt.$('input[name="vcode"]').val(),
					$vcodeLine = qt.$('.vcode-line');

				// 若 获取验证码行 不存在,则判断电话号符合要求,则激活提交按钮;  若 验证码行 存在,则确保电话号,验证码符合规范,且用户点击过 发送验证码,则激活提交按钮
				if(/^1[0-9]{10}$/.test(mobile) && $vcodeLine.hasClass('hide') ? true : ( /^\d{6}$/.test(vcode) && $vcodeLine.hasClass('send-succ') )) {
					qt.$('.err-tips').addClass('hide');
					qt.$('.submit').addClass('active');
					return ;
				}

				$('.submit').removeClass('active');
			},
			getVcode : function (e) {
				var $me = $(e.currentTarget),
					$mobile = qt.$('input[name="mobile"]'),
					$vcode= qt.$('input[name="vcode"]'),
					$errTips = $mobile.siblings('.err-tips'),
					mobile = $mobile.val();

				if($me.hasClass('disable')) {
					return false;
				}

				if (!/^\d{11}$/.test(mobile)) {
					$mobile.focus();
					$errTips.html('请输入正确手机号码').removeClass('hide');
					return false;
				}

				typeof QDevice !== 'undefined' && QDevice.getDevice &&  QDevice.getDevice(function(sessionId) {
					if (sessionId) { // 当前设备通过NoCaptcha验证
						$errTips.addClass('hide');
						$me.addClass('disable');
						$.ajax({
							url: '/api/common/user/getcode',
							type: "POST",
							data: {
								mobile: mobile
							},
							dataType: "json",
							timeout: 10000,
							error: function() {
								$me.removeClass('disable');
								qt.alert("网络请求错误，请重试");
							},
							success: function(res) {
								$me.removeClass('disable');
								if (res.ret) {
									qt.$('.vcode-line').addClass('send-succ');
									goTimer($me);
									$vcode.focus();
								} else {
									$errTips.html(res.msg).removeClass('hide');
								}
							}
						});
					}
				},'qunar.com');
			},
			submit : function (e) {
				var $me = $(e.currentTarget),
					$mobile = qt.$('input[name="mobile"]'),
					param = {
						action: 'submit',
						mobile: $mobile.val() || qt.requestData.mobile,
						vcode: qt.$('input[name="vcode"]').val()
					};

				if (!/^\d{11}$/.test(param.mobile)) {
					$mobile.focus();
					$mobile.siblings('.err-tips').html('请输入正确手机号码').removeClass('hide');
					return false;
				}

				if (!$me.hasClass('active')) {
					return false;
				}

				typeof QDevice !== 'undefined' && QDevice.getDevice &&  QDevice.getDevice(function(sessionId) {
					if (sessionId) { // 当前设备通过NoCaptcha验证
						$.ajax({
							url: "/api/activity/festivalVoucher",
							data: param,
							dataType: "json",
							error: function() {
								qt.alert("网络请求错误，请重试");
							},
							success: function(res) {
								if (res.ret) {
									var $voucher = qt.$('.voucher-info');
									qt.$('.card').removeClass('mt5');
									switch (res.errcode) {
										case 0:
											$voucher.find('.indate').addClass('hide');
											$voucher.find('.font-big').html('领取成功').removeClass('hide');
											qt.$('.operate').addClass('hide');
											qt.$('.go-other .success').removeClass('hide');
											break;
										case 1:
											$voucher.find('.indate').addClass('hide');
											$voucher.find('.font-big').html('已经领取过').removeClass('hide');
											qt.$('.operate').addClass('hide');
											qt.$('.go-other .success').removeClass('hide');
											break;
									}
								} else {
									$.Captcha.refreshCaptcha();
									switch (res.errcode) {
										case 2:
											qt.alert(res.msg);
											break;
										case -1:case -2:case -10:
										qt.$('.card .over').removeClass('hide');
										qt.$('.voucher-info').addClass('hide');
										qt.$('.operate').addClass('hide');
										qt.$('.go-other .over').removeClass('hide');
										break;
										case 102:
											qt.$('.card').addClass('mt5');
											qt.$('.vcode-line').removeClass('hide');
											qt.$('input[name="mobile"]').siblings('.err-tips').html(res.msg).removeClass('hide');
											$me.removeClass('active');
											break;
										default :
											qt.$('.code-box .err-tips').html(res.msg).removeClass('hide');
									}
								}

							}
						});
					}
				},'qunar.com');

			},
			toHotel: function () {
				var clientUrl = 'hotel/main';
				if( isClient ) {
					location.href = getClientUrl( clientUrl );
				}else {
					location.href ='http://touch.qunar.com/client?sScheme=0&downType=3&bd_source=' + qt.commonParam.bdSource + '&scheme=' + encodeURIComponent(clientUrl);
				}
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
