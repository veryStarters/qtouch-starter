import qt from 'qt';
import Calendar from '../../../../common/component/calendar/index.js';

module.exports = (()=> {
	return qt.defineSubPage({
		config: {
			name: 'calendarpage',
			fixedSubHeader: true,
			forceRefresh: true,
			animate: 'slideDown',
			init: function () {},
			ready: function (requestData, subPage) {
				var $el = qt.$('.calendar-box'),
					options = qt.getTransferData(),
					calendar;

				// 用户选取完毕回调,返回主页面
				options.onSelectedDone = $.proxy(function () {
					subPage.back(calendar.getSelectedTimeInfo());
				}, this);

				// 是否自动渲染 false
				options.autoRender = false;

				$.ajax({
					url: '/api/hotel/holiday',
					success: function (res) {

						if (res.ret && res.data) {
							options.holiday = res.data.holiday;
							options.offDay = res.data.tiaoxiuMap;
						}

						calendar = new Calendar($el, options);
						$el.html( calendar.getBody() );
						calendar.initEvents();
					},
					error: function () {

						calendar = new Calendar($el, options);
						$el.html( calendar.getBody() );
						calendar.initEvents();
					}
				});
			}
		},
		events: {},
		templates: {
			header: function () {
				return `<nav class="icon previous left"></nav><div class="calendar-title">${qt.getTransferData().title}</div>`;
			},
			subHeader: function () {
				return `<div class="calendar-head"><div class="qt-week-title"><table><tbody><tr><td class="weekend">日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class="weekend">六</td></tr></tbody></table></div></div>`;
			},
			body: function () {
				return '<div class="calendar-box"></div>'

			},
			footer: ''
		},

		handles: {}
	});
})();