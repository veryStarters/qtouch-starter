/**
 * Created by chengyu.wang on 16/03/07.
 */
import qt from 'qt';
import bodyTpl  from './tpl/body.tpl';

module.exports = (()=> {
	return qt.defineSubPage({
		config: {
			name: 'roompreference',
			forceRefresh: true,
			animate: 'slideUp',
			init: function () {

			},
			ready: function (requestData, subPage) {
				var data = qt.getTransferData();
				var choosed = data.choosed; //传递过来选中的数据

				//先处理数据
				_.each(data.specialRequireOpts, function (item, index) {
					if (choosed[item.title]) {
						//传过来有选中值情况
						_.each(item.fields, function (obj, i) {
							if (obj.key == choosed[item.title]) {
								obj.checked = true;
							} else {
								obj.checked = false;
							}
						})
					} else {
						//传过来无选中 默认选中第一个
						_.each(item.fields, function (obj, i) {
							if (i == 0) {
								obj.checked = true;
							} else {
								obj.checked = false;
							}
						})
					}
				})
				var $html = _.template(bodyTpl, data);
				$('#qt_page_roompreference .qt-page-body').empty().append($html).removeClass('qt-hide');

				//渲染多选
				if (data.otherRequireOpts.length > 0) {
					//房间要求 多选的可能
					if (choosed['房间要求']) {
						var values = choosed['房间要求'].split(';');

						_.each(values, function (item) {
							var index = $.inArray(item, data.otherRequireOpts);
							$('.room-preference-container .choose-content').eq(index).addClass('choosed');
						})
					}
				}

				//其他要求
				if (choosed['其他要求']) {
					$('.other-preference-container .qt-switch').addClass('active');
					$('.other-preference-container .other-wrapper').find('.other-textarea').val(choosed['其他要求']).end().show();
					$('.other-textarea').trigger('input');
				}
			}
		},
		events: {
			'tap .cancel-choosed': 'cancelRoomPreference',
			'tap .approve-choosed': 'approveRoomPreference',
			'tap .qt-switch': 'toggleOtherPreference',
			'tap .choose-content': 'toggleRoomPreference',
			'input .other-textarea': 'inputChange'
		},
		templates: {
			header: function () {
				return `<nav class="left cancel-choosed">取消</nav><div class="title qt-bb-x1">住宿偏好</div><nav class="right approve-choosed">完成</nav>`;
			},
			body: '',
			footer: ''
		},

		handles: {
			//取消
			cancelRoomPreference: function (e, requestData, subPage) {
				subPage.back({_self_: true});
			},
			//完成
			approveRoomPreference: function (e, requestData, subPage) {
				//待会选中数据
				var data = {};

				//单选要求
				_.each($('.checkmark'), function (dom, i) {
					var key = $(dom).closest('.preference-container').find('.title-content').text();
					var value = $(dom).closest('li').find('.choose-content').text();

					data[key] = value;
				})

				//房间要求
				if ($('.room-preference-container').find('.choosed').length > 0) {
					var value = [];
					_.each($('.choosed'), function (dom, i) {
						value.push($(dom).text())
					})
					data['房间要求'] = value.join(',');
				}
				//其他要求
				if ($('.other-preference-container').find('.qt-switch').hasClass('active')) {
					data['其他要求'] = $('.other-preference-container').find('.other-textarea').val() == '' ? '无其他要求' : $('.other-preference-container').find('.other-textarea').val();
				} else {
					data['其他要求'] = '';
				}
				subPage.back(data);
			},
			//切换要求
			toggleRoomPreference: function (e, requestData, subPage) {
				var $target = $(e.currentTarget);
				//打钩的
				if ($target.closest('.preference-list').length > 0) {
					$target.closest('.preference-content-wrapper').find('.checkmark').removeClass('checkmark');
					$target.closest('.preference-content-wrapper').find('.qt-color-header').removeClass('qt-color-header');
					$target.addClass('qt-color-header');
					$target.closest('li').find('.icon').addClass('checkmark');
				} else {
					$target.toggleClass('choosed');
				}
			},
			//切换其他要求
			toggleOtherPreference: function (e, requestData, subPage) {
				var $target = $(e.currentTarget);
				$target.toggleClass('active');
				$target.closest('.preference-content-wrapper').find('.other-wrapper').toggle();
			},

			inputChange: function () {
				var valLen = $('.other-textarea').val().length;
				var maxLen = parseInt($('.other-textarea').attr('maxlength'), 10);
				$('.rest-num').text(maxLen - valLen);
			}
		}
	});
})();
