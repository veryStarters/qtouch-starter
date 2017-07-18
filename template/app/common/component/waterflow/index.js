/**
 * waterflow
 * zhan.chen
 * 2015.12.15
 *
 * 举个栗子：
 *
 * // 初始化waterflow组件
 * waterflow = new Waterflow({
 * 	 type: 'TYPE_DEFINE',
 *	 tpl: '<img width="100%" src="<%- big %>" title="<%- title %>" data-id="<%- idx %>" />',
 *	 list: curList
 * });
 * waterflow.init(qt.$('.imglist'));
 *
 * // 给waterflow组件添加 滑到底部加载更多 的处理
 * // 也可以打开autoLoadOnScroll开关，来使用默认的滚动加载，而省略下面的自己主动调用loadMore,
 * //    但这样做会劫持window的scroll事件，单页应用请慎用。
 * qt.onScrollStop((scrollTop) => {
 * 	 if (qt.$cur.attr('id').indexOf('Imagelist') > -1) {
 *	   let winHeight = window.innerHeight;
 *	   let scrollHeight = document.body.scrollHeight;
 *	   if (winHeight + scrollTop >= scrollHeight - 30) {
 *		   waterflow.loadMore();
 *	   }
 *	 }
 * });
 *
 */

import $ from 'zepto';
import _ from 'underscore';
import tpl from './waterflow.tpl';

class Waterflow {

	constructor (config) {

		// 组件本身的元素节点
		this.waterflow = null;

		// 标记
		this.updateviewFlag = 0; // 重绘标记
		this.completeloadFlag = false; // 加载完成标记

    this.emptyFunc = new Function;

    // 瀑布流元素内容类型
    this.TYPES = ['TYPE_DEFINE', 'TYPE_IMAGE'];
    this.TYPE_DEFINE = 0; // 自定义内容块
    this.TYPE_IMAGE = 1; // 仅图片

    // 内容块模板
    this.templates = [
      '', // 自定义内容
      '<img width="100%" src="<%- src %>" alt="<%- alt %>" title="<%- title %>" data-id="<%- id %>" />', // 图片内容块
    ];

    // 无分栏设置时，默认的最小列宽自动分配方案的最小列宽数值
    this.MIN_COLUME_WIDTH = 115;

    // 默认配置
    this.config = {
      // 初始数据
      list: [],

      // 内容块类型
      type: 'TYPE_IMAGE',

      // 自定义内容块模板
      tpl: '',

      // 间距设置
      padding: 5, // 两侧padding 单位px
      spacingX: 5, // 左右分栏间距 单位px
      spacingY: 5, // 上下模块间距 单位px

      /**
       * 分栏模式
       * - 以下三种模式任选一种
       * -- 1. columeWidth：按照设置的宽度，取屏幕最多可容纳的栏数
       * -- 2. columeCount：按照设置的分栏数目，均分屏幕
       * -- 3. minColumeWidth：按照设置的最小分栏宽度，计算屏幕最多可容纳的栏数，然后均分屏幕
       * - 三种模式只可选一种，若都设置，则上面的模式覆盖下面的模式
       * - 设置数值不为整数时，进行下取整。
       * - 设置处的分栏宽度不包含设置的spacingX值和padding值
       */
      columeWidth: 0, // 固定分栏宽度模式 单位px
      columeCount: 0, // 固定栏数模式 int
      minColumeWidth: this.MIN_COLUME_WIDTH, // 最小分栏宽度自动模式 单位px

      // 加载配置
      // lazyload: true, // 是否惰性加载图片
      firstLoadCount: 8, // 首次加载数目
      loadCount: 4, // 加载更多时加载的数目
			autoLoadOnScroll: false, // 滑动到窗口底部时自动加载更多，默认关闭
			saveMode: false, // 安全模式，开启后模块严格按照高度排列，但必须在数据中传入模块的width和height值

      /**
       * 异步获取数据
       * - 剩余数据量不足laodCount时，将剩余量全部显示，并调用load(callback)方法获取数据
       * -- 需要获取数组型数据，数组元素类型与初始数据list中的元素类型需一致
       * -- 获取到数据并组成相应数组newList后，必须调用callback(newList)
       * -- 若无数据（newList = null 或 空[]），则加载完毕
       * -- 加载完毕时，触发'waterflow-loadcomplete'事件，调用onLoadComplete回调函数
       * - 若只是一次性传入所有数据，则不必实现load函数。
       */
      load: (callback) => {
				callback(null);
			},

      // 事件 会同时调用回调函数和派发事件，回调和监听事件两者只需使用一个
      onBeforeLoad: this.emptyFunc, // 第一次加载之前  事件： 'waterflow_beforeload'
      onLoadMore: this.emptyFunc, // 每次加载更多之前  事件： 'waterflow_loadmore'
      onLoad: this.emptyFunc, // 第一次加载或加载更多完成时  事件： 'waterflow_load'
      onLoadComplete: this.emptyFunc, // 全部加载完成时  事件： 'waterflow_loadcomplete'
      onLoadError: this.emptyFunc, // 加载异常时  事件： 'waterflow_laoderror'
      onClick: this.emptyFunc, // 点击某个模块时  事件： 'waterflow_click'
    }

    // 替换配置
    this.config = $.extend({}, this.config, config);
    this.config.type = this.TYPES.indexOf(this.config.type);

    // 初始化内容块模板信息
    this.templates[this.TYPE_DEFINE] = this.config.tpl;

    // 内容块模板最终设置
    this.TEMPLATE = this.templates[this.config.type];

		// 列表数据
		this.list = this.config.list;
		// 当前已加载内容块数目
		this.curItemCount = 0;
		this.lastItemCount = 0; // 及时与curItemCount保持相同，重绘时使用

    // 分栏最终设置
    this.COLUME_COUNT = 0;
    this.COLUME_WIDTH = 0;
    this.WIN_WIDTH = window.innerWidth;
		this.columes = []; // 用数组记录每一栏的当前高度，从左往右，从0开始

    // 初始化分栏信息
    this.updateColumes();

	}

  updateColumes () { // 更新分栏信息
    let contentWidth = this.WIN_WIDTH - 2*this.config.padding,
      _columeWidth = this.config.columeWidth,
      _columeCount = this.config.columeCount,
      _minColumeWidth = this.config.minColumeWidth,
      _spacingX = this.config.spacingX;
    if (_columeWidth > 0) { // 固定列宽
      this.COLUME_COUNT = Math.floor((contentWidth+_spacingX) / (_columeWidth+_spacingX));
      this.COLUME_WIDTH = _columeWidth;
    } else if (Math.floor(_columeCount) === _columeCount && _columeCount > 0) { // 固定列数
      this.COLUME_COUNT = _columeCount;
      this.COLUME_WIDTH = ((contentWidth+_spacingX) / _columeCount) - _spacingX;
    } else { // 最小列宽自动分栏
      _minColumeWidth = _minColumeWidth > 0
        ? _minColumeWidth : this.MIN_COLUME_WIDTH;
      this.COLUME_COUNT = Math.floor((contentWidth+_spacingX) / (_minColumeWidth+_spacingX));
      this.COLUME_WIDTH = ((contentWidth+_spacingX) / this.COLUME_COUNT) - _spacingX;
    }
		this.columes = [];
		for (let i = 0; i < this.COLUME_COUNT; i ++) {
			this.columes.push(0);
		}
  }

	init (dom) { // 初始化组件
		this.initPage(dom);
		this.initEvent();
		this.loadFirst();
		return this.waterflow;
	}

	initPage (dom) {
		let template = [
			`<div class="z-waterflow">`,
				tpl,
			`</div>`
		].join('');
		$(dom).append(this.getContainerHtml(template));
		this.waterflow = $('.z-waterflow');
	}

	initEvent () {
		let eventHandler = this.getEventHandler();
		$(window).on('orientationchange', event => eventHandler.resize(event));
		// this.waterflow.parent().on('click', 'li.item', event => eventHandler.clickItem(event));
		this.waterflow.parent().on('tap', 'li.item', event => eventHandler.clickItem(event));
		if (this.config.autoLoadOnScroll) {
			$(window).on('scroll wheel orientationchange', event => eventHandler.scroll(event));
		}
	}

	getEventHandler () {
		let debouncedUpdateView = _.debounce(() => {
			// console.log('resize');
			this.updateView();
		}, 300);
		let debouncedLoadMore = _.debounce((count) => {
			// console.log('waterflow_loadmore');
			this.config.onLoadMore();
			this.waterflow.trigger('waterflow_loadmore');
			this.fillItems(count);
		}, 300);
		return {
			resize: () => {
				this.WIN_WIDTH = window.innerWidth;
				this.updateviewFlag ++;
				debouncedUpdateView();
			},
			scroll: () => {
				let winHeight = window.innerHeight;
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				let scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
				if (winHeight + scrollTop >= scrollHeight - 200 && !this.completeloadFlag) {
					debouncedLoadMore(this.config.loadCount);
				}
			},
			clickItem: (event) => {
				let target = $(event.target).closest('li.item');
				let index = parseInt(target.attr('id').replace('z-waterflow-item', ''), 10);
				// console.log('waterflow_click')
				this.config.onClick(index);
				this.waterflow.trigger('waterflow_click', {index: index});
			}
		}
	}

	getContainerHtml (template=tpl) { // 获取瀑布流图片容器html片段
		return _.template(template)({
			padding: this.config.padding,
			columes: this.COLUME_COUNT,
			width: this.COLUME_WIDTH,
			spacingX: this.config.spacingX
		});
	}

	updateView (count) { // 整体重绘组件
		this.updateColumes();
		let html = this.getContainerHtml(tpl);
		this.waterflow.html(html);
		// this.waterflow = $('.z-waterflow');
		// 重新加载相同数目的内容块,若传入的数目，则加载指定数目的内容块
		this.curItemCount = 0;
		this.fillItems(count || this.lastItemCount);
		this.updateviewFlag = 0; // 清空重绘标记
	}

	loadFirst () { // 初始内容加载
		// console.log('waterflow_beforeload');
		this.config.onBeforeLoad();
		this.waterflow.trigger('waterflow_beforeload');
		this.fillItems(this.config.firstLoadCount);
	}

	checkHeight () { // 检查高度 若已有最大高度小于窗口高度+150 则继续加载
		let height = _.min(this.columes);
		if (height - 300 < window.innerHeight) {
			this.fillItems(this.config.laodCount);
		}
	}

	updateColumeHeight (index) { // 根据colume的index来更新该colume的当前高度
		this.columes[index] = $(`#z-waterflow-colume${index}`).height();
		// console.log(index, '   ----    ', $(`#z-waterflow-colume${index}`).height());
	}

	getMinHeightColume () { // 获取height最小的colume的index
		let height = _.min(this.columes);
		return this.columes.indexOf(height);
	}

	fillOneItem () { // 加载this.list中下标为index的内容块
		try {
			let itemData = this.list[this.curItemCount],
				sizeStr = '';
			if(this.config.saveMode && itemData.width && itemData.height) { // 安全模式中，直接计算模块固定宽高
				let width = this.COLUME_WIDTH;
				let height = this.COLUME_WIDTH / itemData.width * itemData.height;
				sizeStr = `width:${width}; height:${height}`;
			}
			let	itemTpl = [
					`<li class="item" style="margin-top:${this.config.spacingY}px; ${sizeStr}" id="z-waterflow-item${this.curItemCount}">`,
						this.TEMPLATE,
					`</li>`
				].join(''),
				itemHtml = _.template(itemTpl)(itemData),
				columeIndex = this.getMinHeightColume();
			$(`#z-waterflow-colume${columeIndex}`).append(itemHtml);
			if(this.config.saveMode) { // 安全模式中，直接更新高度
				$(`#z-waterflow-item${this.curItemCount} img`).on('load', function () {
					$(this).css({opacity: 1});
				});
				this.updateColumeHeight(this.getMinHeightColume()); // 更新当前列高度
			}
			this.curItemCount ++; // 更新当前已加载数目
			if (this.updateviewFlag === 0) { // 没有处于重绘过程中，则可正常保存curItemCount副本
				this.lastItemCount = this.curItemCount;
			}
		} catch (err) {
			// console.log('waterflow_loaderror');
			this.config.onLoadError(err);
			this.waterflow.trigger('waterflow_loaderror', {err: err});
		}
	}

	fillItems (count = this.config.loadCount) {
		let listLength = this.list.length;
		if (count === 0) { // 本次加载完成
			// console.log('waterflow_load');
			this.config.onLoad();
			this.waterflow.trigger('waterflow_load');
			this.checkHeight();
			return;
		} else if (this.curItemCount >= listLength) { // 没有更多数据
			// 通过外部自定义方法加载更多数据
			this.config.load((newList) => this.load(newList, count));
			return;
		} else { // 递归加载
			this.fillOneItem();
			if(this.config.saveMode) { // 安全模式中，直接继续加载下一个模块
				this.fillItems(--count);
			} else { // 非安全模式中，延迟加载以等待高度更新
				setTimeout(() => {
					this.updateColumeHeight(this.getMinHeightColume()); // 更新当前列高度
					// $(`#z-waterflow-item${this.curItemCount-1}`).css({opacity: 1});
					$(`.z-waterflow .colume li img`).css({opacity: 1});
					this.fillItems(--count);
				}, 100);
			}
		}
	}

	load (newList, count) { // 通过外部自定义的方法加载更多数据,加载完成后的回调函数
		if (newList && newList.length > 0) { // 获取到更多的数据
			this.list.concat(newList);
			this.fillItems(count);
		} else { // 没有获取到更多的数据
			if (!this.completeloadFlag) {
				// console.log('waterflow_load');
				this.config.onLoad();
				this.waterflow.trigger('waterflow_load');
				this.completeloadFlag = true;
				// console.log('waterflow_loadcomplete');
				this.config.onLoadComplete();
				this.waterflow.trigger('waterflow_loadcomplete');
			}
		}
	}

	reload (list) { // 外部调用。重新加载整个组件，用于需要整体更新列表数据时
		if (list && list.length > 0) {
			this.completeloadFlag = false;
			this.list = list;
			this.curItemCount = 0;
			this.lastItemCount = 0;
			this.WIN_WIDTH = window.innerWidth;
			this.updateView(this.config.firstLoadCount);
		} else {
			this.updateView();
		}
	}

	loadMore (count = this.config.loadCount) { // 外部调用。加载更多
		if(!this.completeloadFlag) {
			// console.log('waterflow_loadmore');
			this.config.onLoadMore();
			this.waterflow.trigger('waterflow_loadmore');
			this.fillItems(count);
		}
	}


}

export default Waterflow;
