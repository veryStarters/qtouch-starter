/**
 * Created by taoqili on 15/9/25.
 */
import calendar from '../../../common/sub-pages/calendar/index';
import citySelectPage from '../../../common/sub-pages/citySelect/index';
import keywordPage from '../../../common/sub-pages/keywordSelect/index';
import calendarHandle from '../../../common/sub-pages/calendar/canlendar-handle';
import filterSideBar from './filterSideBar';

import listTpl from '../tpl/list.tpl';
import listLiTpl from '../tpl/listLi.tpl';
import timeSelectTpl from '../tpl/time-select.tpl';
import errTpl from '../tpl/err.tpl';
import map from './map-page';

module.exports = (()=> {

	var util = qt.util,
		currentPage = 'list',
		filterCondition = qt.requestData,
		headerIsHide,
		PAGE_TYPE = qt.requestData.type == 2 ? 'hour' : 'normal';

	filterCondition.extra = encodeURIComponent($.type(qt.requestData.extra) === 'object' ?
		JSON.stringify(qt.requestData.extra) :
	qt.requestData.extra || '{}');

	return qt.definePage(map.mix({
		config: {
			fixedSubHeader: true,
			init: function (requestData) {
			},
			ready: function (requestData) {

				// 同步城市到缓存
				syncLocalCityKey(requestData);

				initCalendar();

				map.core.store.set('isGj', qt.firstData.isGJ);
				map.core.store.set('condition', filterCondition);
				map.core.events.on('showMap', function () {
					qt.$('.nearby-hotel').addClass('qt-hide');
					qt.$('#sort-btn').addClass('qt-hide');
					currentPage = 'map';
				}).on('showList', function () {
					qt.requestData.localSearch != 1 && qt.$('.nearby-hotel').removeClass('qt-hide');
					qt.$('#sort-btn').removeClass('qt-hide');
					currentPage = 'list';

					loadData(function () {
						qt.showTips();
						filterCondition.page = 1;
					}, function (res) {
						var $list = qt.$('.list-content .content');

						$list.fadeOut(100, function () {
							$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
								qt.scrollTo(0);
							});
						});

					});
				}).on('changeCondition', function (e, condition, resData) {
					filterSideBar.filterConditionChange(condition.extra, resData.res.data);
					filterCondition = condition;
				}).on('setcity', function (e, res) {
					setCitySelected({
						city: util.formatCity(res.city),
						address: res.city + res.district + res.street
					});
				});

				//浮层红包
				RedLayer && RedLayer.buildFloatingLayer('huodong1', qt.commonParam.cookieBdSource);

				//TODO 待观察效果
				setTimeout(function () {
					var te = document.createElement('script');
					te.addEventListener('load', function () {
						var img = document.createElement("img");
						img.src = '//te.hotel.qunar.com/fp-clct/one.gif?u=' + $te('lvZbPP*-');
					});
					document.body.appendChild(te);
					te.src = "//te.hotel.qunar.com/render/te";
				}, 2000);

				if(_.has(qt.requestData, 'couponsSelected') && qt.requestData.couponsSelected != -1) {
					qt.showTips({
						message: '预订友谊券标签的酒店可立减￥20',
						mask: false,
						position:'bottom'
					});
					setTimeout(qt.hideTips, 5000);
				}

			},
			backMonitor: function (requestData) {
				//显式返回来源页面的，优先返回
				if (requestData.back === 'history') {
					history.go(-1);
					return;
				}

				var ref = document.referrer;
				if (!ref
					|| ref.indexOf('qunar.com') === -1
				) {
					window.location.href = '/hotel/';
					return;
				}
				history.go(-1);
			}
		},
		events: {
			'tap .city-change': 'cityChange',
			'tap .key-search': 'toKeywordSelect',
			'tap .key-search-icon': 'toKeywordSelect',
			'tap .nearby-hotel': 'nearbyHotel',
			'tap .time-condition': 'timeChange',
			'tap .empty-keywords': 'emptyKeywords',
			'tap .condition-select li': 'conditionChange',
			'tap .coupons-btn': 'couponsBtnToggle',
			'tap .list-content li': 'toDetail',
			'tap .load-more': 'addMorePage'
		},
		templates: {},
		handles: {
			// 城市切换
			cityChange: function (e, requestData) {

				let roomType = (requestData.type == 2) ? 'hour-room' : 'normal-room',
					city = qt.$('.city-change').attr('data-city');
				var openData = {
					data: {
						type: roomType,
						city: city
					},
					onBack: function (data) {
                        if (!data || data._self_ || data == city) {
                            return false;
                        }
						setCitySelected({city: data });
					}
				};
				citySelectPage.open(openData);
				qt.monitor('hotellist_change_city')
			},

			// 关键字选择
			toKeywordSelect: function (e) {
				var $keywords = qt.$('.key-search');
				keywordPage.open({
					data: {
						isNormal: PAGE_TYPE == 'normal',
						dname: _.unescape($keywords.data('dname')),
						qname: $keywords.data('qname'),
						city: qt.$('.city-change').data('city')
					},
					onBack: function (data) {
						if (!data || data._self_) {
							return false;
						}

						keywordChange(data);
					}
				});
			},

			// 附近酒店
			nearbyHotel: function (e) {
				var $cur = $(e.currentTarget);

				if ($cur.hasClass('active')) {
					return false;
				}

				$cur.addClass('active').html('定位中…');

				util.location(function (data) {

					qt.href().param({
						city: '',
						sort: 0,
						extra: '',
						keywords: '',
						location: data.qPoint,
						localSearch: 1
					}).replace();

					// 加载数据
					loadData(function () {
						qt.showTips();
						filterCondition.page = 1;
					}, function (res) {
						var $list = qt.$('.list-content .content');

						// 城市关键字初始化
						qt.$('.city-search').html(res.data.address);
						qt.$('.key-search').html('酒店名/地名');
						qt.$('.key-search-icon').hide();

						$list.fadeOut(100, function () {
							$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
								qt.scrollTo(0);
							});
						});
						filterSideBar.refreshFilter(res.data, {sort: true, star: true, local: true, filter: true});

					});

					$cur.removeClass('active').addClass('qt-hide').html('附近酒店');
				}, function (data) {

                    qt.alert({
                        title: '定位失败！',
                        message: '<div class="qt-font14 qt-lh">您可以在设置中开启定位服务和WIFI，以提高定位成功率。或在搜索框中输入您想找的地名或酒店名</div>',
                        okText: '知道了',
                    });
					$cur.removeClass('active').html('附近酒店');
				});
				qt.monitor('hotellist_nearby_hotel')
			},

			// 更改日期
			timeChange: function (e) {
				var currentDom = $(e.currentTarget),
					currentHour = new Date().getHours(),
					selectedDate = getCurrentSelectDate(currentDom),
					data = {
						currentDate: qt.commonParam.currentDateStr || '',
						selecteds: selectedDate,
						isRange: selectedDate.length == 1 ? false : true,   // false 为单天,true 为两天
						title: '选择入住离店日期'
					};

				//若当前时间小于早上六点,则询问是否为凌晨入住
				if (currentHour < 6) {
					qt.confirm({
						message: '是否凌晨入住？',
						onOk: function () {
							var currentDate = util.dateToStr(new Date()),
								preDate = util.preDayStr(currentDate);

							filterCondition.needLCRZ = 1;

							calendarOpen($.extend(data, {
								startDate: preDate,
								selecteds: [preDate, currentDate]
							}), currentDom);
						},
						onCancel: function () {
							filterCondition.needLCRZ = 2;
							calendarOpen(data, currentDom);
						}
					})
				} else {
					calendarOpen(data, currentDom);
				}
				qt.monitor('hotellist_change_calendar')
			},

			// subheader中条件筛选
			conditionChange: function (e) {
				var $currentDom = $(e.currentTarget),
					$sideBar = $('.qt-sidebar.top');

				// 若当前筛选为active状态,或者 城市 定位 都为空, 则返回
				if ($currentDom.hasClass('active') || !filterCondition.city && !filterCondition.location) {
					qt.hideSidebar();
					return;
				}
				$currentDom.siblings('.active').length && qt.hideSidebar(1);
				//$sideBar.css('z-index', '7');
				$currentDom.addClass('active').find('i').removeClass('arrow-down-4').addClass('arrow-up-4');

				filterSideBar.showFilterPanel($currentDom, $sideBar, $.proxy(conditionCallBack, this), {headerIsHide: headerIsHide});

			},

			// 清除关键字
			emptyKeywords: function (e) {
				keywordChange({dname: '', qname: ''});
			},

			// 友谊券开关切换
			couponsBtnToggle: function (e) {
				var $me = $(e.currentTarget).find('.qt-switch'),
					$box = qt.$('.coupons-box'),
					$open = $box.find('.open'),
					$close = $box.find('.close');

				if($me.hasClass('active')) {
					$me.removeClass('active');
					$close.removeClass('qt-hide');
					$open.addClass('qt-hide');
					filterCondition.couponsSelected = '0';
					qt.monitor('hotellist-coupons-switch-close');
				}else {
					$me.addClass('active');
					$open.removeClass('qt-hide');
					$close.addClass('qt-hide');
					filterCondition.couponsSelected = '1';
					qt.monitor('hotellist-coupons-switch-open');
				}

				// 加载数据
				loadData(function () {
					qt.showTips();
					filterCondition.page = 1;
				}, function (res) {
					var $list = qt.$('.list-content .content');

					$list.fadeOut(100, function () {
						$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
							qt.scrollTo(0);
						});
					});

				});
			},

			// 加载更多
			addMorePage: function (e) {
				var $current = $(e.currentTarget),
					page = parseInt(filterCondition.page) + 1;

				if ($current.hasClass('active') || $current.text().trim() === '已加载全部') {
					return false;
				}
				$current.addClass('active');

				loadData(function () {
					qt.$('.load-more .spinner').removeClass('qt-hide');
					filterCondition.page = page;
				}, function (res) {
					qt.$('.load-more .spinner').addClass('qt-hide');
					renderNextPage(res.data, page);
				});
			},

			// 进详情页
			toDetail: function (e) {
				let $current = $(e.currentTarget),
					$timeSelect = qt.$('.time-condition p'),
					param = {
						city: qt.$('.city-change').data('city'),
						checkInDate: $timeSelect[0] ? $($timeSelect[0]).data('date') : '',
						checkOutDate: $timeSelect[1] ? $($timeSelect[1]).data('date') : '',
						location: filterCondition.location || '',
						seq: $current.data('id'),
						clickNum: $current.data('click'),
						type: filterCondition.type || '0',
						extra: filterCondition.extra || '{}',
						sort: filterCondition.sort || '0'
					};
				window.location.href = '/hotel/hoteldetail?' + util.param2query(param)
			}
		}
	}));

	// 日历初始化
	function initCalendar() {
		if (!$(qt.$('.time-condition p')[0]).data('date')) {
			var calendarDate = calendarHandle.getShowDate(),
				$box = qt.$('.time-condition'),
				isRange = qt.requestData.type == '2' ? false : true,
				data = isRange ? calendarDate.storeDate.range : calendarDate.storeDate.single;

			$box.changeHtml(util.template(timeSelectTpl, {detail: data.detail}));

			isRange ?
				qt.href().param({checkInDate: data.detail[0].date, checkOutDate: data.detail[1].date}).replace() :
				qt.href().param('checkInDate', data.detail[0].date).replace();
			return;
		}
	}

	//从dom中获取当前页面默认的入住,离店时间
	function getCurrentSelectDate(currentDom) {
		var selectDate = [];
		_.forEach(currentDom.find('p'), function (item) {
			selectDate.push(qt.$(item).data('date'));
		});
		return selectDate;
	}

	//打开日历页面
	function calendarOpen(opts, currentDom) {
		calendar.open({
			data: opts,
			onBack: function (data) {
				if (!data || data['_self_']) {
					return false;
				}

				data.isRange = opts.isRange;
				currentDom.html(util.template(timeSelectTpl, {detail: data.detail}));

				if (data.isRange) {
					qt.href().param({checkInDate: data.detail[0].date, checkOutDate: data.detail[1].date}).replace();
					filterCondition.checkInDate = data.detail[0].date;
					filterCondition.checkOutDate = data.detail[1].date;
				} else {
					qt.href().param('checkInDate', data.detail[0].date).replace();
					calendarHandle.changePartStore(data.isRange ? 'range' : 'single', data);
				}

				currentPage === 'map' ?
					map.core.events.triggerHandler('filterConditionChange', filterCondition) :
					loadData(function () {
						qt.showTips();
						filterCondition.page = 1;
					}, function (res) {
						var $list = qt.$('.list-content .content');
						$list.fadeOut(100, function () {
							$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
								qt.scrollTo(0);
							});
						});

					});

				calendarHandle.changePartStore(data.isRange ? 'range' : 'single', data);
			}
		});

	}

	//设置城市关键字
	function setCitySelected(data) {
		var $citySelect = qt.$('.city-change'),
			city = data.city || '';
		$citySelect.attr('data-city', city)
			.changeHtml('<span class="city-search">' + (data.address || city) + '</span><span class="icon arrow-down-4"></span>', 'popup');

		filterCondition.city = decodeURIComponent(filterCondition.city || '');

		let cityChange = filterCondition.city != city;

		if (!cityChange || data.address !== undefined) {
			return;
		}

		let conditionOption = {
			sort: cityChange,
			star: cityChange,
			local: cityChange,
			filter: cityChange
		};

		// 因location比城市优先级高,城市改变时须清空location,否则不生效
		qt.href().param({city: city, keywords:'', location: '', localSearch: ''}).replace();

		qt.$('.key-search').changeHtml('酒店名/地名')
			.attr('data-dname', '')
			.attr('data-qname', '');
		qt.$('.empty-keywords').hide();

		if(cityChange){
            qt.href().param({extra: '', sort: '0'}).replace();
        }
		qt.requestData.localSearch !== 1 && qt.$('.nearby-hotel').hasClass('qt-hide') && qt.$('.nearby-hotel').removeClass('qt-hide');

		if (currentPage === 'map') {
			map.core.events.triggerHandler('filterConditionChange', [filterCondition, function (data) {
				filterSideBar.refreshFilter(data, conditionOption);
			}]);
		} else {
			loadData(function () {
				qt.showTips();
				filterCondition.page = 1;
			}, $.proxy(function (conditionOption, res) {
				var $list = qt.$('.list-content .content');

				$list.fadeOut(100, function () {
					$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
						qt.scrollTo(0);
					});
				});

				filterSideBar.refreshFilter(res.data, conditionOption);
			}, this, conditionOption));
		}
	}

	//加载url与本地存储中城市和关键字
	function syncLocalCityKey(newData) {
		var type = (newData.type == 2) ? 'hour-room' : 'normal-room',
			requestCity = newData.city || '',
			requestKeywords = newData.keywords || '';
		var keywordData = JSON.parse(util.localStorage.getItem('TOUCH_CHECKED') || '{}'),
			data = keywordData[type] || {};
		if (requestKeywords || !requestKeywords && data.city !== requestCity) {
			data.dname = requestKeywords;
			data.qname = requestKeywords;
		}
		data.city = requestCity;

		keywordData[type] = data;
		util.localStorage.setItem('TOUCH_CHECKED', JSON.stringify(keywordData));
	}

	// 关键字改变
	function keywordChange(data) {
		var $keywords = qt.$('.key-search'),
			$empty = qt.$('.empty-keywords');

		$keywords.changeHtml(data.dname || '酒店名/地名')
			.attr('data-dname', data.dname)
			.attr('data-qname', data.qname);
		data.dname ? $empty.show() : $empty.hide();

		filterCondition.keywords = decodeURIComponent(filterCondition.keywords || '');

		let keywordChange = data.qname != filterCondition.keywords;

		if (!keywordChange) {
			return;
		}

		let conditionOption = {
			sort: keywordChange,
			star: keywordChange,
			local: keywordChange,
			filter: keywordChange
		};

		// 因location比城市优先级高,城市改变时须清空location,否则不生效
		qt.href().param({keywords: data.qname}).replace();
		keywordChange && qt.href().param({extra: '', sort: '0'}).replace();

		if (currentPage === 'map') {
			map.core.events.triggerHandler('filterConditionChange', [filterCondition, function (data) {
				filterSideBar.refreshFilter(data, conditionOption);
			}]);
		} else {
			loadData(function () {
				qt.showTips();
				filterCondition.page = 1;
			}, $.proxy(function (conditionOption, res) {
				var $list = qt.$('.list-content .content');

				$list.fadeOut(100, function () {
					$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
						qt.scrollTo(0);
					});
				});

				filterSideBar.refreshFilter(res.data, conditionOption);
			}, this, conditionOption));
		}

	}

	// 数据加载
	function loadData(beforeCallBack, sucCallBack) {
		var $list = qt.$('.list-content .content'),
			error = function (tpl, msg) {
				$list.html(util.template(tpl, {errmsg: msg || '非常抱歉,加载失败'}));
			};

		beforeCallBack && beforeCallBack();

		initFilterData(filterCondition);

		$.ajax({
			url: '/api/hotel/hotellist?' + qt.util.param2query(filterCondition),
			dataType: 'json',
			async: true,
			success: function (res) {

				// 若有错误提示,提示关闭
				qt.$('.tips').hide();

				if (res.ret) {

					sucCallBack && sucCallBack(res);
					qt.hideTips();

					if (res.data.isGJ) {
						map.core.store.set('isGj', true);
						$('#toggleMap').addClass('qt-hide');
					}
					else {
						map.core.store.set('isGj', false);
						$('#toggleMap').removeClass('qt-hide');
					}
				} else {
					error(errTpl, res.msg);
				}
			},
			error: function (res) {
				// 若有错误提示,提示关闭
				qt.$('.tips').hide();

				error(errTpl, res.msg);
			}
		});
	}

	// 整理参数,将为空的参数删掉
	function initFilterData(data) {
		_.map(data, function (value, key, item) {
			$.type(value) === 'object' ?
			_.size(value) === 0 && delete item[key] :
			!value && delete item[key];
		});
	}

	// 渲染下一页
	function renderNextPage(data, page) {
		let $more = qt.$('.load-more'),
			$ul = qt.$('.list-content ul'),
			lastIndex = $ul.children().length,
			scrollTop = $more.offset().top - 228;

		$more.removeClass('active');

		$ul.append(util.template(listLiTpl, {data: data, isHour: qt.requestData.type == 2}));
		page == data.totalPage && $more.changeHtml('已加载全部');
		qt.scrollTo(scrollTop, function () {
			qt.flash($ul.children().get(lastIndex), true)
		});

	}

	// subpage中条件筛选回调
	function conditionCallBack(data) {

		filterCondition = $.extend(filterCondition, data);

		initFilterData(filterCondition.extra);

		$.isEmptyObject(filterCondition.extra) ?
			delete filterCondition.extra :
			( filterCondition.extra = encodeURIComponent(JSON.stringify(filterCondition.extra)));

		qt.href().param({'extra': filterCondition.extra || '', 'sort': filterCondition.sort || '0'}).replace();

		if (currentPage === 'list') {

			loadData(function () {
				qt.showTips();
				filterCondition.page = 1;
			}, function (res) {
				var $list = qt.$('.list-content .content');
				$list.fadeOut(100, function () {
					$list.html(util.template(listTpl, {data: res.data, isHour: qt.requestData.type == 2})).fadeIn(200, function () {
						qt.scrollTo(0);
					});
				});

			});
		} else {
			map.core.events.triggerHandler('filterConditionChange', $.extend(filterCondition, {
				extra: filterCondition.extra
			}));
		}


	}

	//function autoHideHeader() {
	//	var $header = qt.$('.qt-header'),
	//		$subHeader = qt.$('.qt-sub-header');
	//	//头隐藏
	//	qt.onScroll(function (dir, scrollTop) {
	//		if ($header.parents('.qt-hide').length || $subHeader.parents('.qt-hide').length) {
	//			return;
	//		}
	//		var $actSidebar = $('.qt-sidebar.active');
	//		if (dir === "up") {
	//			if (scrollTop >= 90) {
	//				if (!headerIsHide) {
	//					$header.animate({
	//						'-webkit-transform': 'translateY(-50px)',
	//						transform: 'translateY(-50px)'
	//					});
	//				}
	//				if (!headerIsHide) {
	//					$('.qt-sub-header').animate({
	//						'-webkit-transform': 'translateY(-40px)',
	//						transform: 'translateY(-40px)'
	//					});
	//				}
	//				if (!headerIsHide && $actSidebar.length) {
	//					$actSidebar.animate({
	//						'-webkit-transform': 'translateY(-40px)',
	//						transform: 'translateY(-40px)'
	//					});
	//				}
	//				headerIsHide = true;
	//			}
	//		} else {
	//
	//			if (headerIsHide) {
	//				$subHeader.animate({
	//					'-webkit-transform': 'translateY(0)',
	//					transform: 'translateY(0)'
	//
	//				});
	//			}
	//			if (headerIsHide) {
	//				$header.animate({
	//					'-webkit-transform': 'translateY(0)',
	//					transform: 'translateY(0)'
	//				});
	//			}
	//			if (headerIsHide && $actSidebar.length) {
	//				$actSidebar.animate({
	//					'-webkit-transform': 'translateY(0)',
	//					transform: 'translateY(0)'
	//				});
	//			}
	//			headerIsHide = false;
	//		}
	//	}, 10)
	//}
})();