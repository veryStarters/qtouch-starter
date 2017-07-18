/**
 * Created by chengyu.wang on 16/03/07.
 */
import qt from 'qt';
import userTpl from './tpl/user-list.tpl';

module.exports = (()=> {

	var selectArray = [];//选中的id
	var listData = [];//全部
	return qt.defineSubPage({
		config: {
			name: 'adduserpage',
			fixedSubHeader: true,
			forceRefresh: true,
			animate: 'slideUp',
			init: function () {
			},
			ready: function (requestData, subPage) {
				var $el = qt.$('.add-user-box'),
					options = qt.getTransferData();

				$.ajax({
					url: qt.commonParam.host.userCenter+'/webapi/contact/query/',
					dataType: 'jsonp',
					data: {
						csrfToken: qt.util.cookie('csrfToken')
					},
					success: function (res) {
						if (res.ret && res.data) {
							//缓存返回的常用联系人列表
							var responseData = res.data.contactList;
							listData = responseData;

							if (responseData.length > 0) {
								//遍历数据
								_.each(responseData, function (item, index) {
									if (options.rooms > 1 && $.inArray(item.name, options.currentChoosed) > -1) {
										item.checked = "checked";

										selectArray.push(item.id);
									} else {
										item.checked = "";
									}
								})

								//处理列表
								var $list = _.template(userTpl, {data: responseData});
								$el.empty().append($list)
							} else {
								$el.empty().append('<div class="no-data">没有常用联系人数据</div>');

								//提交按钮置灰
								$('.approve-add').addClass('disabled');
							}

							//处理展示还可以选择多少
							if (options.rooms > 1) {
								$('.choose-available .remain-num').text(options.rooms - options.currentChoosed.length);
							} else {
								$('.choose-available').hide();
							}
						}
					},
					error: function () {
						qt.alert({
							animate: 'slideDownIn',
							noHeader: true,
							contentCenter: true,
							message: '请求失败！'
						})
					}
				});

			},
			onBack: function () {
				selectArray = [];
			}
		},
		events: {
			'tap .user-item': 'toggleSelect',
			'tap .approve-add': 'approveSelect'
		},
		templates: {
			header: function () {
				return `<nav class="icon previous left"></nav><div class="title qt-bb-x1">选择常用联系人</div>`;
			},
			body: function () {
				return `<div class="add-user-box"></div>
                <div class="qt-bg-white qt-bt-x1 fixed submit-box">
                    <div class="qt-font12 choose-tip">
                        <p class="qt-grey fixed-notice">每间需指定一位入住人</p>
                        <p class="qt-grey choose-available">还可以选择<span class="remain-num">2</span>位</p>
                    </div>
                    <div class="qt-white approve-add">提交</div>
                </div>`

			},
			footer: ''
		},

		handles: {
			toggleSelect: function (e) {
				//传递过来的可选数
				var availableChoosed = qt.getTransferData().rooms;

				var $ele = $(e.currentTarget);
				var id = $ele.attr('data-id');

				var checkbox = $ele.find('.checkbox');//当前选中
				var $remainNumEle = $('.remain-num');
				var choosedNum = $ele.parent().find('.checked').length;//当前选中数

				if (availableChoosed == 1) {
					if (checkbox.hasClass('checked')) {
						//取消选中
						checkbox.removeClass('checked');
						selectArray = [];
					} else {
						$ele.parent().find('.checked').removeClass('checked');
						selectArray = [];
						checkbox.addClass('checked');
						selectArray.push(id);
					}
				} else {
					//多于1个房间
					if (checkbox.hasClass('checked')) {
						var index = $.inArray(id, selectArray);//在选中的位置
						selectArray.splice(index, 1);
						//取消选中
						checkbox.removeClass('checked');
						$remainNumEle.text(availableChoosed - choosedNum + 1);
					} else {
						//选中
						if (choosedNum == availableChoosed) {

							qt.alert({
								animate: 'slideDownIn',
								noHeader: true,
								contentCenter: true,
								message: '您的选择已达上限！'
							})
						} else {
							checkbox.addClass('checked');
							selectArray.push(id);
							$remainNumEle.text(availableChoosed - choosedNum - 1);
						}
					}
				}
			},

			approveSelect: function (e, requestData, subPage) {
				//置灰的情况下点击无反应
				if (!$('.approve-add').hasClass('disabled')) {
					var checkedName = [];
					_.each(selectArray, function (value) {
						_.each(listData, function (item) {
							if (item.id == value) {
								var obj = {
									name: item.name,
									mobile: item.mobile
								}
								checkedName.push(obj);
							}
						})
					})
					subPage.back(checkedName);
				}
				selectArray = [];
			}
		}
	});
})();
