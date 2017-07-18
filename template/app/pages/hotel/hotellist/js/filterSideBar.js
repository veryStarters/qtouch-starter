import '../../../../common/component/range/index';
import '../../../../common/component/multiselector/index';
import starPriceBar from '../../index/tpl/star-price.tpl';
import recommendSortTpl from '../tpl/condition-filter/sort.tpl';
import starPriceTpl from '../tpl/condition-filter/star-price.tpl';
import locationAreaTpl from '../tpl/condition-filter/location-area.tpl';
import filterTpl from '../tpl/condition-filter/filter.tpl';

const FILTER_TITLE = ['推荐排序', '星级价格', '位置区域', '筛选'],
	RENAR_DATA = [{},{
		isHour: qt.requestData.type === '2',
		data: {
			//星级多选数据
			starData: [
				{dname: '经济型', qname: '1', checked: false},
				{dname: '二星', qname: '5', checked: false},
				{dname: '三星', qname: '2', checked: false},
				{dname: '四星', qname: '3', checked: false},
				{dname: '五星', qname: '4', checked: false}
			],
			//小时多选数据
			hourData: [
				{dname: '&lt; 3小时', qname: '0', checked: false},
				{dname: '3小时', qname: '1', checked: false},
				{dname: '4小时', qname: '2', checked: false},
				{dname: '&gt; 4小时', qname: '3', checked: false}
			],
			//正常星级价格范围
			normalPriceData: [0, 150, 300, 500, 800, '不限'],
			//钟点价格范围
			hourPriceData: [0, 50, 80, 100, '不限']
		}
	}];

let conditionFilterTpl = [recommendSortTpl, starPriceTpl, locationAreaTpl, filterTpl],
	filterCondition = {
		sort: qt.requestData.sort || '0',
		extra: qt.requestData.extra?
			$.type(qt.requestData.extra) === 'object'?
				qt.requestData.extra:
				JSON.parse(decodeURIComponent( qt.requestData.extra )):
			{}
	},
	locationTemp = {selectBox: [], record: false};

// 判断firstData中是否有数据,有的话则初始化筛选条件
if(qt.firstData.filterItem) {
	sortInit(qt.firstData.sort);
	starInit();
	locationInit(qt.firstData.locationFilterBasicInfo);
	filterInit(qt.firstData.filterItem);
}

module.exports = {
	showFilterPanel: ($btnLi, $sideBar, callback, option) => {
		//$('.qt-mask').addClass('zIndex2');
		//得知当前所需渲染的 模板 及 title 为第几个
		var btnIndex = $btnLi.index();
		qt.showSidebar({
			events: {
				'tap .recommend-sort li': 'sortSelect',

				'tap .star-price-filter .submit': 'starPriceSubmit',
				'tap .star-price-filter .empty': 'starPriceEmpty',

				'tap .location-area-filter .radio-select li': 'locationRadioSelect',
				'tap .location-area-filter .checkbox-select li': 'locationCheckboxSelect',
				'tap .location-area-filter .checkbox-select .all': 'locationCheckboxAll',
				'tap .location-area-filter .left-nav li': 'locationTabSwitch',
				'tap .location-area-filter .second-nav li': 'locationTabSwitch',
				'tap .location-area-filter .submit': 'locationAreaSubmit',
				'tap .location-area-filter .empty': 'locationAreaEmpty',

				'tap .filter-filter p': 'filter',
				'tap .filter-filter .submit': 'filterSubmit',
				'tap .filter-filter .empty': 'filterEmpty',
				'tap .filter-filter .show-more': 'showMore'
			},
			template: qt.util.template(conditionFilterTpl[btnIndex], {data: RENAR_DATA[btnIndex]}),
			offsetY: option && option.headerIsHide ? 85: 126,
			zIndex: 7,
			beforeShow: function () {
				$btnLi.attr('id') === 'location-btn' &&
					$sideBar.height($(window).height() - $('.qt-sub-header').height() - 80);

				$sideBar.find('.operation-btn').removeClass('qt-hide');
				$sideBar.find('.content').css('height', $sideBar.height() - 50);
			},
			onShow: function () {
				switch ($btnLi.attr('id')) {
					case 'star-btn':
						renderStarPanel();
						qt.monitor('hotellist_change_star')
						break;
					case 'location-btn':
						let $selectBox = $sideBar.find('.select-box');

						// 若位置区域可选项为空,则返回
						if( !$selectBox.length ) {
							return false;
						}

						// 遍历位置区域所有选择面板,若无选中则选中 '不限',若有选中,则进入该面板
						$selectBox.each(function (index, item) {
							if($(item).hasClass('distance')) {
								!$(item).find('.active:not(.all)').length ?
									$(item).find('[data-value="10"]').addClass('active') :
									(showThisTab($(item)), locationTemp.selectBox = $(item));
							}
							!$(item).find('.active:not(.all)').length ?
								$(item).find('.all').addClass('active') :
								(showThisTab($(item)), locationTemp.selectBox = $(item));
						});
						if($selectBox.length === $sideBar.find('.select-box.qt-hide').length) {
							showThisTab($($selectBox[0]));
						}

						// 滚轮在当前选中位置
						let $curSelectBox = $('.select-box:visible'),
							$curSecondNav = $('.second-nav:visible');
						$curSecondNav.length && $curSecondNav.scrollTop($curSecondNav.find('.active')[0].offsetTop);
						$curSelectBox.scrollTop($curSelectBox.find('.active')[0].offsetTop);
						qt.monitor('hotellist_change_area');
						break;
					case 'filter-btn':
						// 若品牌高度小于135,则品牌不折叠
						if($sideBar.find('.show-some').height() <= 135) {
							$sideBar.find('.show-more').addClass('qt-hide');
						}

						// 滚轮在当前选中位置
						let $active = $('.filter-filter .active');
						$active.length && $('.filter-filter .content').scrollTop($active.parents('li')[0].offsetTop);
						qt.monitor('hotellist_filter');
						break;
				}
			},
			onHide: function ($sidebar) {
				//$('.qt-mask').removeClass('zIndex2');
				$btnLi.find('i').addClass('arrow-down-4').removeClass('arrow-up-4');
				$btnLi.removeClass('active');
			},
			onTapMask: function () {
				qt.hideSidebar();
			},

			// 排序
			sortSelect: function (e) {
				var currentLi = $(e.currentTarget),
					value = currentLi.data('value') + '';

				if( currentLi.hasClass('active') ) {
					qt.hideSidebar();
					return ;
				}

				currentLi.addClass('active')
					.siblings().removeClass('active');

				filterCondition.sort = value;
				$btnLi.find('span').changeHtml(currentLi.find('p').text());

				initData(RENAR_DATA[0], '', value);
				qt.hideSidebar();
				callback(filterCondition);
				qt.monitor('hotellist_change_sort')
			},

			// 星级价格置空
			starPriceEmpty: function () {
				$('.js-star', $sideBar).multiselector('chooseAll');

				let $hour = $('.js-hour', $sideBar);
				$hour.length && $hour.multiselector('toggle', $hour.find('.choose'));

				$('.js-range', $sideBar).range('moveTo', 0, '不限');
			},
			// 星级价格提交
			starPriceSubmit: function (e) {
				let showText = '',
					checkedData = {};
				//星级,小时
				_.each(['star', 'hour'], (selector) => {
					let $elem = $('.js-' + selector, $sideBar),
						checkedVal = '',
						checkedText = [],
						isStar = selector === 'star';

					if ($elem.length > 0) {
						checkedData[selector] = $elem.multiselector('status');
						checkedVal = checkedData[selector].map((item) => {
							return item.val;
						});

						isStar ? filterCondition.extra.L = checkedVal.join(',') : filterCondition.extra.DU = checkedVal.join(',');
						checkedText = initData(isStar ? RENAR_DATA[1].data.starData : RENAR_DATA[1].data.hourData, '', checkedVal);
						showText = showText.concat(checkedText.join('')+ ' ');
					}
				});

				//价格
				let priceRange = $('.js-range', $sideBar).range('getResult');
				checkedData.price = priceRange;
				filterCondition.extra.MIN = priceRange[0] > 0 ? priceRange[0] : 0;
				filterCondition.extra.MAX = priceRange[1] > 0 ? priceRange[1] : 0;

				starCache().set(checkedData);

				showText = showText.concat( getPriceText( priceRange ) );
				$btnLi.find('span').changeHtml(showText.trim() ? showText : FILTER_TITLE[1]);
				qt.hideSidebar();
				callback(filterCondition);
			},

			// 区域tab切换
			locationTabSwitch: function (e) {
				var currentLi = $(e.currentTarget),
					switchToDom = $('.' + currentLi.data('for'));
				if (currentLi.hasClass('active')) {
					return;
				}

				currentLi.addClass('active')
					.siblings().removeClass('active');
				switchToDom.removeClass('qt-hide')
					.siblings('div').addClass('qt-hide');

				// 如果含有二级tab,则激活二级tab
				!switchToDom.hasClass('select-box')
				&& switchToDom.find('.second-nav li.active').length === 0
				&& switchToDom.find('.second-nav li:eq(0)').trigger('tap');

				// 若上一个tab有选中项,则加小点标示
				if (locationTemp.selectBox.length && !locationTemp.record) {
					addRecordChecked(locationTemp.selectBox);
					locationTemp.record = true;
				}
			},
			locationRadioSelect: function (e) {
				var currentLi = $(e.currentTarget),
					selectBox = currentLi.closest('.select-box');

				currentLi.addClass('active')
					.siblings().removeClass('active');

				if (!currentLi.data('value')) {
					return;
				}

				// 若有其他tab中已有选中项,则去除
				locationTemp.selectBox.length
				&& selectBox.data('parent') != locationTemp.selectBox.data('parent')
				&& removeRecordChecked(locationTemp.selectBox);

				locationTemp.selectBox = selectBox;
				locationTemp.record = false;
			},
			locationCheckboxSelect: function (e) {
				var currentLi = $(e.currentTarget),
					selectBox = currentLi.closest('.select-box');

				if (currentLi.hasClass('active')) {
					currentLi.removeClass('active');
					currentLi.find('i').removeClass('checked');

					// 若取消当前选中项,再无其他选中项,则选中不限,并将选中项容器清空
					!selectBox.find('li.active').length
						&& selectBox.find('.all').addClass('active')
						&& ( locationTemp.selectBox = [] );

					return;
				}
				selectBox.find('.all').removeClass('active');
				currentLi.addClass('active').find('i').addClass('checked');

				// 若有其他tab中已有选中项,则去除
				locationTemp.selectBox.length
				&& selectBox.data('parent') != locationTemp.selectBox.data('parent')
				&& removeRecordChecked(locationTemp.selectBox);

				locationTemp.selectBox = selectBox;
				locationTemp.record = false;
			},
			locationCheckboxAll: function (e) {
				var $currentLi = $(e.currentTarget),
					$selectBox = $currentLi.closest('.select-box'),
					$checked = $selectBox.find('li.active');

				if ($currentLi.hasClass('active')) {
					return;
				}
				$currentLi.addClass('active');
				$checked.removeClass('active').find('i').removeClass('checked');

				locationTemp.selectBox = [];
				locationTemp.record = false;
			},
			locationAreaEmpty: function () {
				if (locationTemp.selectBox.length) {

					var activeLi = $sideBar.find('.select-box li.active:not(.all)');

					activeLi.removeClass('active').find('.checkbox').removeClass('checked');
					activeLi.siblings('.all').addClass('active');
					activeLi.parent('ul').siblings('.all').addClass('active');
					removeRecordChecked(activeLi.closest('.select-box'));

					locationTemp.selectBox = [];
					locationTemp.record = false;
				}
			},
			locationAreaSubmit: function () {
				let $selectBox = $sideBar.find('.select-box'),
					$checked = $selectBox.find('li.active:not(.all)'),
					type = $selectBox.hasClass('checkbox-select') ? 'checkbox' : 'radio',
					result = type === 'radio' ? $checked.data('value') : getValue();

				filterCondition.extra.LA = result ? locationTemp.selectBox.data('key') + '_' + result : '';

				$selectBox.hasClass('distance') && ( result = $checked.find('p').text());
				$btnLi.find('span').changeHtml(result? result.substr(0, 4) : FILTER_TITLE[btnIndex]);

				syncData($selectBox, RENAR_DATA[btnIndex]);
				qt.hideSidebar();
				callback(filterCondition);

				locationTemp.selectBox = [];
				locationTemp.record = false;

				function getValue() {
					var value = [];
					_.map($checked, function (item) {
						value.push($(item).data('value'));
					});
					return value.join(',');
				}
			},

			// 筛选
			filter: function (e) {
				var currentLi = $(e.currentTarget),
					countDom = $btnLi.find('.count'),
					currentCount = parseInt(countDom.text());

				if (currentLi.hasClass('active')) {
					currentLi.removeClass('active');
					currentCount === 1 ? countDom.text('').addClass('qt-hide') : countDom.text(currentCount - 1);
					return;
				}

				if(currentLi.closest('li').data('key') == 'CT' && currentLi.siblings().hasClass('active')) {
					currentLi.siblings().removeClass('active');
					countDom.text(parseInt(countDom.text()) - 1);
				}
				currentLi.addClass('active');
				!countDom.text() ? countDom.text(1) : countDom.text(parseInt(countDom.text()) + 1);
				countDom.removeClass('qt-hide');
			},
			filterSubmit: function () {
				let getValue = (dom) => {
					return _.map(dom, (item) => {
						return $(item).data('value');
					})
				};
				_.map($sideBar.find('li'), (item) => {
					let result = '',
						$activeDom = $(item).find('p.active');
					if ($activeDom.length) {
						result = result.concat(getValue($activeDom).join(','));
					}
					filterCondition.extra[$(item).data('key')] = result;

				});

				qt.hideSidebar();
				callback(filterCondition);
				initData(RENAR_DATA[3], '', getFilterCheckedData());
			},
			filterEmpty: function () {
				$sideBar.find('p.active').removeClass('active');
				$btnLi.find('.count').text('').addClass('qt-hide');
				filterCondition.filter = '';
			},
			showMore: function (e) {
				var currentLi = $(e.currentTarget);
				if(currentLi.hasClass('active')) {
					currentLi.removeClass('active')
						.removeClass('arrow-up-5').addClass('arrow-down-5')
						.parents('h5').siblings('.detail')
						.addClass('show-some');
					return ;
				}
				currentLi.addClass('active')
					.removeClass('arrow-down-5').addClass('arrow-up-5')
					.parents('h5').siblings('.detail')
					.removeClass('show-some');
			}
		});
	},
	// 重置筛选项数据
	refreshFilter: (data,options) => {
		_.each(options, function (value,key) {
			filterCondition.extra = qt.requestData.extra?
				$.type(qt.requestData.extra) === 'object'?
					qt.requestData.extra:
					JSON.parse(decodeURIComponent( qt.requestData.extra )):
			{};
			filterCondition.sort = qt.requestData.sort || '0';

			if(value) {
				switch (key) {
					case 'sort':
						sortInit(data.sort);
						break;
					case 'star':
						starInit();
						break;
					case 'local':
						locationInit(data.locationFilterBasicInfo);
						break;
					case 'filter':
						filterInit(data.filterItem);
						break;
				}
			}
		});
	},
	filterConditionChange: (extra, resData) => {

		extra = decodeURIComponent(extra || '{}');
		extra = JSON.parse(extra);
		filterCondition.extra = extra;
		filterCondition.sort = '0';

		sortInit(resData.sort);
		locationInit(resData.locationFilterBasicInfo);
		filterInit(resData.filterItem);
	},
	sortInit: sortInit
};

// 初始化
function sortInit(data) {
	data = !data ? qt.firstData.sort : data;

	let sortText = initData(data, '', filterCondition.sort || '0');
	sortText.length
		&& sortText[0] != qt.$('.sort-btn').find('span').text()
		&& qt.$('.sort-btn').find('span').changeHtml(sortText.join(' '));
	RENAR_DATA[0] = data;
}
function starInit() {
	let hourText = initData(RENAR_DATA[1].data.hourData, '', filterCondition.extra.DU ? filterCondition.extra.DU.split(',') : '');
	let starText = initData(RENAR_DATA[1].data.starData, '', filterCondition.extra.L ? filterCondition.extra.L.split(',') : '');

	let starPriceText = starText.concat(hourText).join('').concat( getPriceText( [filterCondition.extra.MIN || '0', filterCondition.extra.MAX || '不限'] ));
	starPriceText ? qt.$('.star-btn').find('span').changeHtml(starPriceText): qt.$('.star-btn').find('span').html(FILTER_TITLE[1]);
}
function locationInit(data) {
	if($.isEmptyObject(data)) {
		RENAR_DATA[2] = {errmsg: '暂无可选择位置区域'};
		return false;
	}
	let checkedText = filterCondition.extra.LA ?filterCondition.extra.LA.split('_')[1] : '',
		laText = initData(data, '', checkedText? checkedText.split(',') : '');
	laText.length ? qt.$('.location-btn').find('span').changeHtml(laText.join(' ')): qt.$('.location-btn').find('span').html(FILTER_TITLE[2]);
	RENAR_DATA[2] = data;
}
function filterInit(data) {
	data.brandCnt = brandCntToArray(data.brandCnt);
	data.isHour = qt.requestData.type == 2;

	var checkedData = getFilterCheckedData();
	let filterText = initData(data, '', checkedData);
	filterText.length ? qt.$('.filter-btn .count').changeHtml(filterText.length).removeClass('qt-hide') : qt.$('.filter-btn .count').text('').addClass('qt-hide');
	RENAR_DATA[3] = data;
}

// 位置区域部分方法
function addRecordChecked(child) {
	var parentNav = $('.' + child.data('parent'));
	parentNav.length && addRecordChecked(parentNav.addClass('record'));
}
function removeRecordChecked(child) {
	var parentNav = $('.' + child.data('parent'));
	parentNav.length && removeRecordChecked(parentNav.removeClass('record'));

	if (child.hasClass('select-box')) {
		child.find('li.active').removeClass('active');
		child.find('.all').addClass('active');
		child.find('input:checked').prop('checked', false).removeClass('checked');
	}
}
function showThisTab(item) {
	var parentNav = $('.' + item.data('parent'));
	if (parentNav.length) {
		showThisTab(parentNav);
		parentNav.trigger('tap');
	}
}
function getParentText(child) {
	var parent = $('.' + child.data('parent'));
	return parent.data('parent') ? getParentText(parent) + '-' + parent.text() : parent.text();
}
function syncData(dom, data) {
	var child =dom.find('li.active:not(.all)'),
		$preSelected = dom.find('li.checked'),
		data = data,
		path = '',
		getObjByPath = (item) => {
			let tempData = data;
			path = $(item).data('path').split('-');
			path.shift();
			path.forEach(function (i) {
				tempData = tempData[i];
			});
			return tempData;
		};

	$preSelected.forEach(function (item) {
		let temp = getObjByPath(item);
		temp.checked = '';
	});
	child.forEach(function (item) {
		let temp = getObjByPath(item);
		temp.checked = 'checked';
	});
}

// star-price渲染
function renderStarPanel() {
	let starPanel = $('.star-price-filter');
	switch (qt.requestData.type) {
		case '2':
			$('.js-star', starPanel).multiselector({
				tplData: RENAR_DATA[1].data.starData
			});

			$('.js-hour', starPanel).multiselector({
				tplData: RENAR_DATA[1].data.hourData,
				fontSize: 12,
				multi: false
			});
			$('.js-range', starPanel).range({
				division: RENAR_DATA[1].data.hourPriceData,
				defVal: [filterCondition.extra.MIN, filterCondition.extra.MAX ? filterCondition.extra.MAX : '不限'] || []
			});

			break;
		default :
			$('.js-star', starPanel).multiselector({
				tplData: RENAR_DATA[1].data.starData
			});
			$('.js-range', starPanel).range({
				division: RENAR_DATA[1].data.normalPriceData,
				defVal: [filterCondition.extra.MIN, filterCondition.extra.MAX ? filterCondition.extra.MAX : '不限'] || []
			});

			break;
	}
}

// 通过当前价格数组得到显示的价格文本
function getPriceText(arr) {
	let text = '';
	if (arr.join('') != '0不限') {
		text = '&yen;' + arr[0];
		text += arr[1] === '不限' ? '-' + '不限' : '-&yen;' + arr[1];
	}
	return text;
}

// 筛选数据中的品牌
function brandCntToArray(obj) {
	let tempArray = [];
	_.each(obj, (item, index, parent) => {
		tempArray = tempArray.concat(item);
	});
	return tempArray;
}
function getFilterCheckedData() {
	let extra = filterCondition.extra,
		checkedData = _.union(
			extra.C && extra.C.split(','),
			extra.BR && extra.BR.split(','),
			extra.RT && extra.RT.split(','),
			extra.HT && extra.HT.split(','),
			extra.RI && extra.RI.split(','),
			extra.BN && extra.BN.split(','),
			extra.CT && extra.CT.split(',')
		);

	checkedData = _.filter(checkedData, function(item) {return item != undefined});
	return checkedData;
}

function starCache() {
	const KEY = 'TOUCH_START_PRICE_BAR';

	const DEF_STR = {
		normal: {},
		hour: {}
	};

	let store = qt.util.localStorage;
	let type = qt.requestData.type == 2 ? 'hour': 'normal';
	let str = store.getItem(KEY);
	str = str ? JSON.parse(str) : DEF_STR;

	return {
		set: (val) => {
			str[type] = val;
			store.setItem(KEY, JSON.stringify(str));
		}
	}
}

// 数据初始化
function initData(data, path, initValue) {
	let checkedText = [],
		isChild = (data) => {
			if ($.type(data) === 'object') {
				var hasChild = false;
				for (var i in data) {
					if ($.type(data[i]) === 'object' || $.type(data[i]) === 'array') {
						hasChild = true;
						break;
					}
				}
				return !hasChild;
			}
			return false;
		},
		isChecked = (val) => {
			let res = _.filter(initValue, function(item,index, arr) {
				if(item == val) {
					arr.splice(index,1);
					return val == item;
				}

			});
			return res.length;
		};

	// 因为数组传的是引用,所有将initValue转化为数组,以便查找完的文本从initValue中删除
	$.type(initValue) != 'array' && ( initValue = [initValue] );

	// 1. 判断是不是叶子节点
	if (isChild(data)) {

		data['path'] = path;
		data['qname'] && isChecked(data['qname']) ?
			( data['checked'] = true, checkedText.push(data['dname']) ) :
			data['checked'] = false;

		// 2. 是否是对象
	} else if ($.type(data) === 'object') {
		var keys = Object.keys(data);
		keys.forEach(function (k) {
			checkedText = checkedText.concat(initData(data[k], path + "-" + k, initValue));
		})

		// 3. 是否是数组
	} else if ($.type(data) === 'array') {
		data.forEach(function (item, i) {
			checkedText = checkedText.concat(initData(item, path + "-" + i, initValue));
		})
	}

	return checkedText;
}

