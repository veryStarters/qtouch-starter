/**
 * Created by lqq.li on 16/3/11.
 */

import pageTpl from './tpl/page.tpl';
import roomPreTpl from './tpl/room-pre.tpl';
import childrenAgeTpl from './tpl/children-age.tpl';

import roomSelectTpl from './tpl/side-bar/room-select.tpl';
import personSelectTpl from './tpl/side-bar/person-select.tpl';
import childrenSelectTpl from './tpl/side-bar/children-select.tpl';
import childrenAgeSelectTpl from './tpl/side-bar/children-age-select.tpl';

module.exports = (()=> {
	var util = qt.util,
		data = {};

	return qt.defineSubPage({
		config: {
			name: 'roomcountpage',
			animate: 'slideUp',
			forceRefresh: true,
			//页面初始化时执行
			init: function (requestData, subPage) {

				var inputInfo = qt.firstData.roomInfo.inputInfo;
				data = {
					childrenAgeOpts: inputInfo && inputInfo.childrenAgeOpts,
					defaultChildrenAge: inputInfo && inputInfo.childrenAgeOpts[0],
					adultsNumPreRoom: inputInfo && inputInfo.adultsNumPreRoom,
					defaultAdults: inputInfo && inputInfo.defaultAdults,
					childrensNumPreRoom: inputInfo && inputInfo.childrensNumPreRoom,
					defaultChildrens: inputInfo && inputInfo.defaultChildrens,
					maxPersonsPreRoom: inputInfo && inputInfo.maxPersonsPreRoom,
					maxRooms: qt.requestData.maxRooms,
					minRooms: qt.requestData.minRooms,
					curData: qt.getTransferData().curData ? qt.getTransferData().curData : {
						roomCount: requestData.roomCount,
						adultsCount: inputInfo.defaultAdults,
						childrenCount: inputInfo.defaultChildrens,
						childrenAge: inputInfo.childrenAgeOpts[0],
						detail: roomDataCreater(requestData.roomCount)

					}
				};
			},
			//页面渲染完成时执行
			ready: function (requestData, subPage) {
				var roomCountHtml = _.template(pageTpl, {data: data});
				//var personCountHtml = _.template(roomPreTpl, {data : data});
				$('.room-select-box').append(roomCountHtml);
			},
			onOpen: function () {

			},
			onBack: function () {
				qt.hideSidebar();
			}
		},
		events: {
			'tap .adult-count': 'adultCountSelect',
			'tap .child-count': 'childCountSelect',
			'tap .age-box div': 'childAgeSelect',
			'tap .room-count': 'roomCountSelect',
			'tap .submit': 'submit'
		},
		templates: {
			header: function () {
				return `<nav class="icon previous left"></nav><div class="qt-bb-x1 title">选择房间数及入住人</div>`;
			},
			body: function () {
				return '<div class="room-select-box"></div>'
			},
			footer: ''
		},
		handles: {
			adultCountSelect: function (e) {
				var $btn = $(e.currentTarget),
					roomIndex = parseInt($btn.closest('.box').attr('id').split('room')[1], 10),
					curValue = $btn.attr('data-value'),
					maxPerson = data.maxPersonsPreRoom - data.curData.detail[roomIndex].children;
				qt.showSidebar({
					events: {
						'tap .radio-box li': 'invoiceType'
					},
					type: 'bottom',
					template: _.template(personSelectTpl, {data: data, maxPerson: maxPerson, curValue: curValue}),
					offsetY: 0,
					onTapMask: function () {
						qt.hideSidebar();
					},
					invoiceType: function (e) {
						var $me = $(e.currentTarget),
							oldNum = data.curData.detail[roomIndex].adult,
							newNum = parseInt($me.attr('data-value'), 10);

						if ($me.hasClass('active')) {
							qt.hideSidebar();
							return false;
						}

						data.curData.detail[roomIndex].adult = newNum;

						$me.addClass('active').siblings().removeClass('active');
						$btn.attr('data-value', newNum);
						$btn.find('.val').text(newNum);

						qt.hideSidebar();
					}
				});
			},
			childCountSelect: function (e) {
				var $btn = $(e.currentTarget),
					roomIndex = parseInt($btn.closest('.box').attr('id').split('room')[1], 10),
					curValue = $btn.attr('data-value'),
					maxPerson = data.maxPersonsPreRoom - data.curData.detail[roomIndex].adult;

				qt.showSidebar({
					events: {
						'tap .radio-box li': 'invoiceType'
					},
					type: 'bottom',
					template: _.template(childrenSelectTpl, {data: data, maxPerson: maxPerson, curValue: curValue}),
					offsetY: 0,
					onTapMask: function () {
						qt.hideSidebar();
					},
					invoiceType: function (e) {
						var $me = $(e.currentTarget),
							oldNum = data.curData.detail[roomIndex].children,
							newNum = parseInt($me.attr('data-value'), 10);

						if ($me.hasClass('active')) {
							qt.hideSidebar();
							return false;
						}
						data.curData.detail[roomIndex].children = newNum;

						$me.addClass('active').siblings().removeClass('active');
						$btn.attr('data-value', newNum);
						$btn.find('.val').text(newNum);

						childrenCountChange(oldNum, newNum, $btn.siblings('.age-box'));

						qt.hideSidebar();
					}
				});
			},
			childAgeSelect: function (e) {
				var $btn = $(e.currentTarget),
					curValue = $btn.attr('data-value');
				qt.showSidebar({
					events: {
						'tap .radio-box li': 'invoiceType'
					},
					type: 'bottom',
					template: _.template(childrenAgeSelectTpl, {data: data, curValue: curValue}),
					offsetY: 0,
					onTapMask: function () {
						qt.hideSidebar();
					},
					invoiceType: function (e) {
						var $me = $(e.currentTarget);

						if ($me.hasClass('active')) {
							qt.hideSidebar();
							return false;
						}
						var roomIndex = parseInt($btn.closest('.box').attr('id').split('room')[1], 10),
							ageIndex = parseInt($btn.attr('id').split('child-age-')[1], 10),
							key = $me.attr('data-key'),
							value = $me.attr('data-value');
						data.curData.detail[roomIndex].age[ageIndex] = {key: key, value: value};

						$me.addClass('active').siblings().removeClass('active');
						$btn.attr('data-value', value);
						$btn.find('.val').text(key);

						qt.hideSidebar();
					}
				});
			},
			roomCountSelect: function (e) {
				var $btn = $(e.currentTarget);
				qt.showSidebar({
					events: {
						'tap .radio-box li': 'invoiceType'
					},
					type: 'bottom',
					template: _.template(roomSelectTpl, {data: data}),
					offsetY: 0,
					onTapMask: function () {
						qt.hideSidebar();
					},
					invoiceType: function (e) {
						var $me = $(e.currentTarget),
							oldNum = data.curData.roomCount;

						if ($me.hasClass('active')) {
							qt.hideSidebar();
							return false;
						}
						data.curData.roomCount = parseInt($me.attr('data-value'), 10);

						$me.addClass('active').siblings().removeClass('active');
						$btn.attr('data-value', data.curData.roomCount);
						$btn.find('.val').text(data.curData.roomCount);

						roomCountChange(oldNum, data.curData.roomCount);

						qt.hideSidebar();
					}
				});
			},
			submit: function (e, requestData, subPage) {
				var $me = $(e.currentTarget),
					adultsCount = 0,
					childrenCount = 0,
					guestInfos = [];

				if ($me.hasClass('active')) {
					return false;
				}
				$me.addClass('active');

				_.each(data.curData.detail, function (item) {
					adultsCount += item.adult;
					childrenCount += item.children;

					guestInfos.push({
						adultsNum: item.adult,
						childrenNum: item.children,
						childrenAges: _.map(item.age, function(iAge) {return iAge.value}).join(','),
						bedTypeId: ''
					});

				});

				data.curData.adultsCount = adultsCount;
				data.curData.childrenCount = childrenCount;
				data.curData.guestInfos = guestInfos;

				$.ajax({
					url: '/h5/hotel/hotelordercheckprice',
					type: "get",
					data: {
						checkInDate: qt.requestData.checkInDate || '',
						checkOutDate: qt.requestData.checkOutDate || '',
						wrapperId: qt.requestData.wrapperId || '',
						roomId: qt.requestData.roomId || '',
						hotelId: qt.requestData.hotelId || '',
						hotelSeq: qt.requestData.seq || '',
						planId: qt.requestData.planId || '',
						guestInfos: JSON.stringify(guestInfos),
						hotelPhone: qt.requestData.hotelPhone || '',
						otaPhone: qt.firstData.roomInfo.otaPhone || '',
						extraParam: qt.firstData.roomInfo.extraParam || ''
					},
					dataType: 'json',
					success: function (res) {
						if (!res)return;

						if (res.flag) {

							res.extraParam ? qt.firstData.roomInfo.extraParam = res.extraParam : '' ;
							qt.firstData.roomInfo.cancellation = res.cancellation;

							// 取消说明 修改

							qt.confirm({
								noHeader: true,
								contentCenter: true,
								message: res.changeTips,
								onOk: function () {
									subPage.back({
										room: data.curData,
										price: res.priceInfos,
										taxation: res.taxation
									});
								},
								onCancel: function () {
									$me.removeClass('active');
								}
							});

						} else {
							$me.removeClass('active');
							qt.alert({
								noHeader: true,
								message: res.msg
							})
						}
					},
					error: function (xhr) {
						$me.removeClass('active');
					}
				});


			}
		}
	});

	// 房间数改变
	function roomCountChange(oldNum, newNum) {
		var $box = $('.room-detail');

		if (oldNum > newNum) {
			for (var i = oldNum; i > newNum; i--) {

				$box.find('#room' + (i - 1)).remove();
				data.curData.detail.pop();
			}
			return false;
		}

		var roomHtml = [];
		for (var j = oldNum; j < newNum; j++) {
			roomHtml.push(_.template(roomPreTpl, {data: data, index: j}));
		}
		data.curData.detail = data.curData.detail.concat(roomDataCreater(newNum - oldNum));
		$box.append(roomHtml.join(''));
	}

	function childrenCountChange(oldNum, newNum, $box) {
		var roomIndex = parseInt($box.closest('.box').attr('id').split('room')[1], 10),
			detailData = data.curData.detail[roomIndex];

		if (newNum == 0) {
			detailData.age = [];
			$box.empty();
			return false;
		}

		if (oldNum > newNum) {
			for (var i = oldNum; i > newNum; i--) {
				$box.find('#child-age-' + (i - 1)).remove();
				detailData.age.pop();
			}
			return false;
		}

		var ageHtml = [];
		for (var j = oldNum; j < newNum; j++) {
			ageHtml.push(_.template(childrenAgeTpl, {data: data, index: j}));
		}
		detailData.age = detailData.age.concat(ageDataCreater(newNum - oldNum));

		$box.append(ageHtml.join(''));
	}

	// 房间数据生成器
	function roomDataCreater(count) {
		var inputInfo = qt.firstData.roomInfo.inputInfo,
			temp = [];
		for (var i = 0; i < count; i++) {
			temp.push({
				adult: inputInfo.defaultAdults,
				children: inputInfo.defaultChildrens,
				age: []
			});

			if (temp[i].children > 0 && temp[i].age.length == 0) {
				temp[i].age = temp[i].age.concat(ageDataCreater(temp[i].children));
			}
		}
		return temp;
	}

	// 年龄数据生成器
	function ageDataCreater(count) {
		var inputInfo = qt.firstData.roomInfo.inputInfo,
			temp = [];
		for (var i = 0; i < count; i++) {
			temp.push(inputInfo.childrenAgeOpts[0]);
		}
		return temp;
	}
})();
