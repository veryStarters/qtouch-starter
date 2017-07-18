/**
 * 滑动tab标签
 * zhan.chen
 * 2015.7.25
 *
 * constructor params:
 * 	list: tab数据数组  必须
 * 		例如：list = ["tab1", "tab2", ...]
 * 	callback: 点击某个tab激活后的回调函数 将获取点击的tab的idx，然后调用callback(idx)，传入时需绑定this  必须
 *  idx: 初始active的tab的index 从0开始 可选  默认idx=0
 *
 * init params:
 * 	dom: 需要放置本滑动tabs的空容器元素
 *
 * usage:
 * 	import TabSlider from '...';
 * 	var tabs = new TabSlider(list, callback.bind(this), idx);
 * 	tabs.init(dom);
 * 	//简写为 new TabSlider(list, callback.bind(this), idx).init(dom);
 *
 */

// 'use strict'; 类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。

import $ from 'zepto';
import _ from 'underscore';
import tpl from './tabslider.tpl';

class TabSlider {

	constructor (list, tplTab, idx=0, callback=new Function) {
		this.tplTab = tplTab || '<span class="item"><%- tab %></span>';
		this.template = tpl.replace('[tplTab]', this.tplTab);
		this.tabList = list;
		this.len = list.length;
		this.curTab = idx<this.len&&idx||0;
		this.callback = callback;
		this.startX = 0;
		this.tmpX = 0;
		this.tabs = null;
		this.tabsWidth = 0;
		this.winWidth = 0;
		this.hresholdWidth = 0;
		this.ANIMATE_TIME = 0.3;
		this.TAB_HEIGHT = 42;
	}

	init (dom) {
		this.initPage(dom);
		this.checkWidth();
		this.initEvent();
		return this.tabs;
	}

	initPage (dom) {
		$(dom).append(_.template(this.template)(this.tabList));

		this.tabs = $('.qt-tabslider');
		if (this.tabs.length <= 0) {
			return;
		}
		this.tabs.parent().height(this.TAB_HEIGHT);
		this.tabs.find(`li:eq(${this.curTab})`).addClass('active');
	}

	initEvent () {
		$(window).on('resize', () => {
			this.checkWidth();
			this.eventOnAndOff();
		}).on('tap', '.qt-tabslider', event => this.eventTap(event));
		this.eventOnAndOff();
	}

	eventOnAndOff () {
		if (this.tabsWidth <= this.winWidth) {
			this.tabs.off('touchstart').off('touchmove').off('touchend');
		} else {
			$(window).on('touchstart', '.qt-tabslider', event => this.eventTouchStart(event))
			.on('touchmove', '.qt-tabslider',  event => this.eventTouchMove(event))
			.on('touchend', '.qt-tabslider', event => this.eventTouchEnd(event));
		}
	}

	eventTap (event) {
		let idx = $(event.target).closest('li').data('idx')*1;
		if (idx === this.curTab) {
			return;
		}
		if (idx>=0) {
			this.activateTab(idx);
		}
	}

	eventTouchStart (event) {
		event.preventDefault();
		if (event.touches.length===1) {
			this.startX = event.touches[0].screenX;
			this.tmpX = this.startX;
		}
	}

	eventTouchMove (event) {
		event.preventDefault();
		let x = event.touches[0].screenX;
		let deltaX = x - (!!this.tmpX&&this.tmpX||x);
		this.tmpX = x;
		let curLeft = this.getCurLeft();
		let deltaLeft = curLeft + deltaX;
		deltaLeft = deltaLeft<((this.winWidth-this.hresholdWidth)-this.tabsWidth) && ((this.winWidth-this.hresholdWidth)-this.tabsWidth) || deltaLeft;
		deltaLeft = deltaLeft>this.hresholdWidth && this.hresholdWidth || deltaLeft;
		// 以上：保证滑动边界不超过屏幕的5分之一
		this.move(deltaLeft);
	}

	eventTouchEnd () {
		this.moveBack();
	}

	checkWidth () {
		this.winWidth = $(window).width();
		this.hresholdWidth = Math.floor(this.winWidth/5);
		let liNodes = this.tabs.find('li');
		this.tabsWidth = 0;
		_.each(liNodes, li => { this.tabsWidth += $(li).width(); });
		this.tabs.css({
			width: `${this.tabsWidth}px`
		});
		this.moveTo(this.curTab);
	}

	getCurLeft () { //获取当前左位移量
		return parseInt(this.tabs.css('-webkit-transform').match(/\(([^,]*),/)[1], 10);
	}

	move (deltaLeft, time=0) { //滑动tabs
		this.tabs.css({
			'-webkit-transform': `translate3d(${deltaLeft}px, 0, 0)`,
			'transform': `translate3d(${deltaLeft}px, 0, 0)`,
			'transition': `all ${time}s ease-out`
		});
	}

	moveBack () { //用于滑动超出总长度时回弹
		let curLeft = this.getCurLeft();
		if (curLeft > 0) {
			this.move(0, this.ANIMATE_TIME);
		} else if (curLeft < this.winWidth-this.tabsWidth ) {
			this.move(this.winWidth-this.tabsWidth, this.ANIMATE_TIME);
		}
	}

	moveTo (idx, time=0) { //根据tab的id来滑动到相应位置
		if (idx === 0) {
			this.move(0, time);
			return;
		}
		let preTab = this.tabs.find(`li:eq(${idx - 1})`);
		let preTabWidth = preTab.width(); //上一个tab的宽度
		let preWidth = 0; //本tab之前所有tab的宽度和
		for (let prev = preTab; prev.length>0; prev = prev.prev()) {
			preWidth += prev.width();
		}
		let deltaLeft = Math.floor(1.5*preTabWidth) - preWidth; //前面预留1.5倍上一tab宽度
		deltaLeft = deltaLeft<this.winWidth-this.tabsWidth && this.winWidth-this.tabsWidth || deltaLeft;
		deltaLeft = deltaLeft<0 && deltaLeft || 0;
		this.move(deltaLeft, time);
	}

	activateTab (idx) { //根据tab的id激活tab并产生回调
		this.curTab = idx;
		let activeTab = this.tabs.find(`li:eq(${idx})`);
		activeTab.addClass('active').siblings('li').removeClass('active');
		this.moveTo(idx, this.ANIMATE_TIME);
		// 回调 或 发出事件
		this.callback(idx);
		this.tabs.trigger('clicktabslider', {idx: idx});
	}

}

export default TabSlider;
