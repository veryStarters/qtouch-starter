import $ from 'zepto';
import util from '../../core/util.js';
import calendarTpl from './tpl/calendar-tpl.tpl';

class Calendar {

    constructor($el, data) {
        this.currentDate = data.currentDate || util.dateToStr(new Date(), false);
        this.$el = $el || $('body');
        this.options = $.extend({

            //true为区间,false为单选
            isRange: false,
            startDate: this.currentDate,
            endDate: util.oneDayStr(data.startDate || this.currentDate, 90),
            selecteds: [],
            title: '选择入住离店日期',
	        autoRender: true,

            offDay: {},       // 调休 Map
            holiday: {},    // 假期 Map

            //日历页面进入退出前回调
            beforeShow: function () {},
            beforeHide: function () {},

            //选择状态改变回调
            onStateChange: function ($target) {},

            // 日期选择完回调
            onSelectedDone: function () {},

            beforeDestory: function () {}
        }, data);

        // rangeFrom | rangeTo
        this.range = 'rangeFrom';

        this.inHtml = `<span class="cal-mark">入住</span>`;
        this.outHtml = `<span class="cal-mark">离店</span>`;
        this.weekData = '周日 周一 周二 周三 周四 周五 周六'.split(' ');

        this.options.autoRender && Calendar._render(this);
    }

    //	render
    static _render(me) {
        me.$el.html(`<div id="qtCalendarBox">
		    <div class="c-header-fix">
			    <div class="header">${me.getHeader()}</div>
			    <div class="sub-header">${me.getSubHeader()}</div>
			</div>
			${me.getBody()}
		</div>`);
        me.initEvents();
    }

    //得到一个月具体每天信息
    static _getMonthData(param) {
        var resultData = {
            year: param.year,
            month: param.month,
            weeks: []
        };
        for (var i = 0, len = Math.ceil((param.days + param.week) / 7); i < len; i++) {
            var daysArray = [];
            for (var j = 1; j < 8; j++) {

                //now : 当前要渲染的是哪一天
                var now = i * 7 + j - param.week,
                    date = new Date(param.year, param.month - 1, now),
                    dateStr = util.dateToStr(date, false),
                    className, html;
                if (i == 0 && j < param.week + 1 || i == (len - 1) && now > param.days) {
                    className = 'null';
                    html = '';
                } else {

                    //开始日期之前、结束日期之后都disable, 加班日->weekday,假期->holiday,周六天->weekend
                    className = ( date < param.startDate || date > param.endDate ) ? 'disable' :
                        param.offDay[dateStr] ? 'weekday' :
                            param.holiday[dateStr] ? 'holiday' :
                                (date.getDay() == 0 || date.getDay() == 6) ? 'weekend' : '';
                    if (param.month == (param.nowDate.getMonth() + 1) && now == param.nowDate.getDate()) {
                        html = '今天';
                        className += ' today';
                    } else {
                        html = param.holiday[dateStr] ? param.holiday[dateStr] : now;
                    }
                    if (isNaN(html))className += ' chs';
                }

                daysArray.push({
                    className: className,
                    dateStr: dateStr,
                    html: html
                });
            }
            resultData.weeks.push(daysArray);
        }
        return resultData;
    }

    // 选中dom节点的动画
    static _selectedDom(me, $dom, html) {
        var position = $dom.find('p').position(),
            $el = me.$el,
            $circle = $el.find('.start-day-circle');
        if ($circle.length) {
            $circle.css('z-index', 100);
            $circle.css({
                transform: 'translate3d(' + -(position.left - $el.data('lastLeft') + 9) + 'px,' + -(position.top - $el.data('lastTop')) + 'px,0)',
            });
            $circle.animate({
                transform: 'translate3d(' + '0px,' + '0px,0)',
            }, 300, 'ease-in', function () {
                $dom.addClass('active');
                $circle.css('z-index', -1);
                $dom.append($circle);
                $dom.append(html);
            })
        } else {
            $dom.addClass('active');
            $circle = $('<span class="start-day-circle"></span>');
            $dom.append($circle);
            $dom.append(html);
        }

        $circle.css({
            top: position.top,
            left: position.left + 9
        });

        $el.data({lastTop: position.top, lastLeft: position.left + 9});
    }

    initEvents() {
        this.initSelecteds();
        this.$el.find('.days td').on('tap', $.proxy(function (e) {
            this.selectDay(e);
        }, this));
    }

    getHeader() {
        return `<nav class="icon previous left"></nav><div class="calendar-title">${this.options.title}</div>`;
    }

    getSubHeader() {
        return `<div class="calendar-head"><div class="qt-week-title"><table><tbody><tr><td class="weekend">日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class="weekend">六</td></tr></tbody></table></div></div>`;
    }

    getBody() {
        return `<div class="calendar-wrap">${ util.template(calendarTpl, {'data': this.getData()}) }</div>`;
    }

    //初始化选中日期
    initSelecteds() {
        var params = this.options,
            $el = this.$el,
            $next,  //离店日期
            $pre;   //入住日期

        !params.selecteds.length && params.selecteds.push(params.startDate);

        //若初始选中的入住日期小于开始时间,则将开始日期设置为入住日期
        if (util.compareDate(params.startDate, params.selecteds[0])) {
            params.selecteds = [params.startDate];
        }

        $pre = $el.find('td[data-day="' + params.selecteds[0] + '"]').not('.null');

        //先重置样式
        $el.find('td.active').removeClass('active').removeClass('pre');
        $el.find('.cal-mark').remove();
        $el.find('td.checked').removeClass('checked');
        $pre.addClass('pre');
        //$pre.append(this.inHtml);
        Calendar._selectedDom(this, $pre, this.inHtml);

        //若isRange为true，则选中两个日期，selecteds[1]为空则渲染selecteds[0]的下一天
        if (params.isRange) {
            if (params.selecteds.length < 2 || params.selecteds[1] === $pre.data('day')) {
                params.selecteds[1] = util.oneDayStr(params.selecteds[0], 1);
            }
            $next = $el.find('td[data-day="' + params.selecteds[1] + '"]').not('.null');
            if (this.range == 'rangeTo') {
                $next.addClass('checked');
            } else {
                //Calendar._selectedDom(this, $next, this.outHtml);
                $next.addClass('active');
                $next.append(this.outHtml);
            }
        }
    }

    //渲染数据的生成及返回
    getData() {
        //    开始日期、结束日期、当前日期、调休日期，假期
        var startDate = util.strToDate(this.options.startDate),
            endDate = util.strToDate(this.options.endDate),
            nowDate = util.strToDate(this.currentDate), // 今天  TODO  接受服务器日期纠正;
            offDay = this.options.offDay,
            holiday = this.options.holiday,

            startMonths = [startDate.getFullYear(), startDate.getMonth() + 1],
            endMonths = [endDate.getFullYear(), endDate.getMonth() + 1],
            year = startMonths[0],
            month = startMonths[1],
            renderData = [];

        while (year < endMonths[0] || (year == endMonths[0] && month <= endMonths[1])) {

            var days = new Date(year, month, 0).getDate(), //当月总天数
                week = new Date(year, month - 1, 1).getDay() || 0; //1号周几

            renderData.push(Calendar._getMonthData({
                year: year,
                month: month,
                days: days,
                week: week,
                offDay: offDay,
                holiday: holiday,
                nowDate: nowDate,
                startDate: startDate,
                endDate: endDate
            }));

            var nextMonth = new Date(year, month, 1);
            year = nextMonth.getFullYear();
            month = nextMonth.getMonth() + 1;
        }

        return renderData;
    }

    //响应选择事件
    selectDay(e) {
        var options = this.options,
            $target = $(e.currentTarget);

        //若点击项为 不可操作项 ,则返回
        if ($target.hasClass('disable') || $target.hasClass('null')) return;

        //是 区间选择 还是 单选
        if (options.isRange) {

            //当前是选择 入住 还是 离店
            if (this.range == 'rangeFrom') {

                options.selecteds[0] = $target.data('day');

                //若 结束日期 小于 当前的入住日期 ,则设置结束日期为 入住日期 的 下一天
                if (options.selecteds.length == 2 && options.selecteds[0] > options.selecteds[1]) {
                    options.selecteds[1] = util.oneDayStr(options.selecteds[0], 1);
                }
                this.range = 'rangeTo';
                this.initSelecteds();

                // 状态改变回调
                options.onStateChange.call(this, $target);
            } else {
                //入住日期 不可点
                if ($target.hasClass('pre')) return;

                // 若 选中日期 小于 当前入住时间 , 则重置入住时间并返回
                if (util.compareDate(options.selecteds[0], $target.data('day'))) {
                    options.selecteds[0] = $target.data('day');
                    this.initSelecteds();
                    return false;
                }

                this.$el.find('.checked').removeClass('checked');
                options.selecteds[1] = $target.data('day');
                this.range = 'rangeFrom';
                $target.addClass('active');
                $target.append(this.outHtml);

                // 状态改变回调
                options.onStateChange.call(this, $target);
                // 日期选择完回调
                options.onSelectedDone();
                // 自动渲染开启,则调用hide
                options.autoRender && this.hide();
            }
        } else {
            this.$el.find('td.active').removeClass('active').find('.cal-mark').remove();
            options.selecteds = [$target.data('day')];
            $target.addClass('active').append(this.inHtml);

            // 状态改变回调
            options.onStateChange.call(this, $target);
            // 日期选择完回调
            options.onSelectedDone();
            // 自动渲染开启,则调用hide
            options.autoRender && this.hide();
        }
    }

    //获取当前选中元素
    getSelecteds() {
        return this.options.selecteds;
    }

    //计算选中日期详细信息,及间隔天数
    getSelectedTimeInfo() {
        var selectedDate = this.options.selecteds,
            currentDate = this.currentDate,
            timeInfo = {dateCount: 0, detail: []},
            weekData = this.weekData;

        $.each(selectedDate, function (index, item) {
            let tempItem = item.split(item[4]);
            let week = new Date(item).getDay();

            timeInfo.detail.push({
                week: weekData[week],
                year: tempItem[0],
                month: tempItem[1],
                day: tempItem[2],
                date: item,
                isToday: item === currentDate,
                isTomorrow: item === util.oneDayStr(currentDate, 1),
                isHouTian: item === util.oneDayStr(currentDate, 2) // 是否后天
            });
        });

        if (selectedDate.length == 2) {
            timeInfo.dateCount = util.getDateDiff(selectedDate[0], selectedDate[1]);
        } else {
            timeInfo.dateCount = 1;
        }

        return timeInfo;
    }
    show() {
        this.options.beforeShow.call(this);
        this.$el.show();
    }

    hide() {
        this.options.beforeHide.call(this);
        this.$el.hide();
    }

    destory() {
        this.options.beforeDestory.call(this);
        this.$el.remove();
    }
}

module.exports = Calendar;
