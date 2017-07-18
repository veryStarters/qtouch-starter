/**
 * imagebrowser
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
import tpl from './imagebrowser.tpl';

class Imagebrowser {

	constructor (config) {

		// 组件本身的元素节点
		this.imagebrowser = null;
    //
		// // 标记
		// this.updateviewFlag = 0; // 重绘标记
		this.completeloadFlag = false; // 加载完成标记

		// 常量
		this.ANIMATION_TIME = 0.35;
		this.WIN_WIDTH = $(window).width();
		this.POSITION = {
			'POS_TOP': 'top',
			'POS_BOTTOM': 'bottom'
		}
    this.emptyFunc = new Function;


    // 默认配置
    this.config = {
      // 初始数据
      list: [], // 数据列表
			index: 0, // 初始图片下标

      // 图片及信息模板
      tplImage: '<img width="100%" src="<%- src %>" alt="<%- alt %>" title="<%- title %>" data-id="<%- id %>" />',
			tplInfo: '<p><span><%- title %></span><span style="margin-left:10px;"><%- index %> / <%- total %></span></p>',

      // 信息栏设置
      displayInfoText: true, // 是否展示信息栏开关
      position: 'POS_BOTTOM', // 信息栏的位置
			margin: 10, // 信息栏距离上/下边界的距离 单位px

			// 图片操作设置
			enableZoom: true, // 允许两指触摸图片缩放
			enableDoubleTapZoom: true, // 允许双击图片缩放
			enableZoomTransform: true, // 允许单张图片放大后移动观看
			enableFastSwitch: true, // 允许图片快速切换操作
			maxZoomRatio: 2, // 最大缩放倍率 number 必须大于1
			minZoomRatio: 0.5, // 最小缩放倍率 number 必须小于1大于0
			zoomOverflowRatio: 0.3, // 放大溢出回弹倍率 number 比如最大倍率为2，双指缩放可以达到2+0.3=2.3倍，松手后回弹到2倍
			zoomSensibility: 6, // 调节两指缩放的灵敏度 number 必须大于0
			minSwitchBoundaryToWindow: 1/3, // 图片切换边界距离（相对窗口宽度） number 必须小于1大于0  即图片滑过窗口宽度的1/3比例后切换到下一张

      // 加载设置
      // lazyload: true, // 是否惰性加载图片
      loadRadius: 3, // 加载半径 即前后加载的数量 比如当前为第5张，加载半径为3，则加载第3-8张

      /**
       * 异步获取数据
       * - 图片数据不足时，将调用load(callback)方法获取更多数据，添加到数组后面
       * -- 需要获取数组型数据，数组元素类型与初始数据list中的元素类型需一致
       * -- 获取到数据并组成相应数组newList后，必须调用callback(newList)
       * -- 若无数据（newList = null 或 空[]），则加载完毕
       * -- 加载完毕时，触发'imagebrowser_loadcomplete'事件，调用onLoadComplete回调函数
       * - 若只是一次性传入所有数据，则不必实现load函数。
       */
      load: (callback) => {
				callback(null);
			},

      // 事件 会同时调用回调函数和派发事件，回调和监听事件两者只需使用一个
    	onBeforeFirstLoad: this.emptyFunc, // 第一次加载之前  事件： 'imagebrowser_beforefirstload'
			onFirstLoad: this.emptyFunc, // 第一次加载之后  事件： 'imagebrowser_firstload'
      onBeforeLoad: this.emptyFunc, // 加载更多之前  事件： 'imagebrowser_beforeload'
      onLoad: this.emptyFunc, // 加载更多之后  事件： 'imagebrowser_load'
			onLoadComplete: this.emptyFunc, // 加载完成没有更多  事件： 'imagebrowser_loadcomplete'
			onLoadError: this.emptyFunc, // 加载异常时  事件： 'imagebrowser_laoderror'
			onBeforeSlide: this.emptyFunc, // 能够滑动到上/下一张图片之前  事件： 'imagebrowser_beforeslide'
			onSlide: this.emptyFunc, // 滑动到上/下一张图片之后  事件： 'imagebrowser_slide'
			onBeforeZoom: this.emptyFunc, // 缩放图片之前 携带缩放前倍率  事件： 'imagebrowser_beforezoom'
			onZoom: this.emptyFunc, // 缩放图片之后 携带缩放后倍率  事件： 'imagebrowser_zoom'
			onTap: this.emptyFunc, // 点击某张图片时	 事件： 'imagebrowser_tap'

    }

    // 替换配置
    this.config = $.extend({}, this.config, config);

		// 模板
		this.TPL_IMAGE = this.config.tplImage;
		this.TPL_INFO = this.config.tplInfo;

		// 数据相关
		this.list = this.config.list;
		this.length = 0;
		this.loadRadius = this.config.loadRadius;
		this.curIndex = this.config.index;
		this.beginIndex = 0;
		this.endIndex = 0;

		// 操作相关
		this.boundaryWidth = 0;
		this.zoomRatio = 1.0; // 缩放倍率
		this.middleZoomRatio = 1.5; // 中间放大倍率

		this.updateConfig();

	}

	updateConfig () { // 更新初始化信息
		// 数据相关
		this.length = this.list.length;
		this.loadRadius = this.config.loadRadius > 0 && this.config.loadRadius <= this.length/2 ? Math.floor(this.config.loadRadius) : Math.floor(this.length/2);
		this.curIndex = Math.floor(this.config.index);
		this.beginIndex = (this.curIndex - (this.loadRadius - 1)) > 0 ?
					(this.curIndex - (this.loadRadius - 1)) : 0;
		this.endIndex = (this.curIndex + this.loadRadius) < this.length ?
					(this.curIndex + this.loadRadius) : this.length;
		if (this.loadRadius < 2) {
			this.loadRadius = 2;
		}
		if (this.length < 4) {
			this.beginIndex = 0;
			this.endIndex = this.length;
		}
		// 操作相关
		this.WIN_WIDTH = $(window).width();
		this.boundaryWidth = this.WIN_WIDTH * this.config.minSwitchBoundaryToWindow;
		this.zoomRatio = 1.0; // 缩放倍率
		this.middleZoomRatio = 1 + (this.config.maxZoomRatio - 1) / 2; // 中间放大倍率
	}

	init (dom) { // 初始化组件
		this.initPage(dom);
		this.initEvent();
		this.loadFirst();
		return this.imagebrowser;
	}

	initPage (dom) {
		$(dom).append(this.getContainerHtml());
		this.imagebrowser = $('.z-imagebrowser');
		this.updateContainer();
	}

	getContainerHtml () { // 获取html片段
		return _.template(tpl)({
			displayInfoText: this.config.displayInfoText,
			position: this.POSITION[this.config.position],
			margin: this.config.margin
		});
	}

	updateContainer () { // 更新图片容器 添加到dom中
		this.imagebrowser.find('.list').html();
		this.addContainer(this.length);
	}

	addContainer (len) { // 添加指定数量的图片容器
		let container = [];
		for (let i = 0; i < len; i ++) {
			container.push([
				`<li id="z-imagebrowser-image${i}" data-index="${i}" style="width:${this.WIN_WIDTH}px">`,
					'<div class="container">',
						'<div class="image-scale" style="transform: scale(1)">',
							'<div class="image-translate" style="transform: translate(0, 0)">',
								'<div class="image-container"></div>',
							'</div>',
						'</div>',
					'</div>',
				'</li>'
			].join(''));
		}
		this.imagebrowser.find('.list').append(container.join(''));
	}

	getTranslate (element, ops) { //获取传入元素的translate值， ops来表示x坐标还是y坐标
		let reg = null;
		switch (ops) {
			case 'x':
				reg = /\(([^,)]*),/;
				break;
			case 'y':
				reg = /,([^,]*)\)/;
				break;
		}
		return parseInt(element.css('-webkit-transform').match(reg)[1], 10);
	}

	checkSlideEdge (targetTranslate) { // 检查是否滑动超过指定回弹边界
		let listWidth = parseInt(this.imagebrowser.find('.list').css('width'), 10);
		let plusEdge = this.boundaryWidth;
		let minusEdge = this.WIN_WIDTH - listWidth - this.boundaryWidth;
		if (targetTranslate > plusEdge) {
			return plusEdge;
		} else if (targetTranslate < minusEdge) {
			return minusEdge;
		} else {
			return targetTranslate;
		}
	}

	getZoomRatio (touches, startRange) { //根据当前双指间距计算缩放倍率
		let x1 = touches[0].screenX;
		let y1 = touches[0].screenY;
		let x2 = touches[1].screenX;
		let y2 = touches[1].screenY;
		let curRange = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)); //当前两之间的长度
		let curZoomRatio = curRange / startRange; //当前缩放倍率
		curZoomRatio = 1 + (curZoomRatio - 1) * 0.01 * this.config.zoomSensibility; //按照设置的灵敏度调整缩放倍率
		curZoomRatio = curZoomRatio * this.zoomRatio; //在当前缩放倍率上继续缩放
		curZoomRatio = curZoomRatio > this.config.minZoomRatio && (curZoomRatio < this.config.maxZoomRatio + this.config.zoomOverflowRatio && curZoomRatio || this.config.maxZoomRatio + this.config.zoomOverflowRatio) || this.config.minZoomRatio; //控制缩放倍率在设置的最大最小倍率之间
		return curZoomRatio;
	}

	initEvent () {
		let eventHandler = this.getEventHandler();
		let listSelector = '.z-imagebrowser .list';
		$(window).on('resize orientationchange', event => eventHandler.resize(event))
			.on('touchstart', listSelector, event => eventHandler.touchStart(event))
			.on('touchmove', listSelector, event => eventHandler.touchMove(event))
			.on('touchend', listSelector, event => eventHandler.touchEnd(event))
			.on('tap', '.z-imagebrowser .list li', event => eventHandler.tap(event));
	}

	getEventHandler () { // 事件处理器
		let startTime = 0,
			startPointX = 0,
			startPointY = 0,
			lastPointX = 0,
			lastPointY = 0,
			singleTouchFlag = false, // 单指触摸标记 开启后将禁止双指操作 直到手指全部离开屏幕
			doubleTouchFlag = false, // 双指触摸标记 开启后将禁止单指操作 直到手指全部离开屏幕
			startRange = 0,
			zoomTouchesCount = 0, // 缩放操作过程中 触摸屏幕的手指数目
			tapTimes = 0; // tap次数
		return {
			resize: () => {
				this.WIN_WIDTH = window.innerWidth;
				let winHeight = window.innerHeight;
				this.boundaryWidth = this.WIN_WIDTH * this.config.minSwitchBoundaryToWindow;
				this.imagebrowser.css({height: winHeight}).find('.list li').css({width: `${this.WIN_WIDTH}px`});
				this.moveTo(this.curIndex);
			},
			touchStart: (event) => {
				event.preventDefault();
				switch (event.touches.length) {
					case 1: // 单指触摸 - 准备移动
						startTime = event.timeStamp;
						startPointX = event.touches[0].screenX;
						startPointY = event.touches[0].screenY;
						lastPointX = startPointX;
						lastPointY = startPointY;
						break;
					case 2: // 两指触摸 - 准备缩放
						if (this.config.enableZoom) { // 设置允许缩放操作
							let x1 = event.touches[0].screenX;
							let y1 = event.touches[0].screenY;
							let x2 = event.touches[1].screenX;
							let y2 = event.touches[1].screenY;
							// 计算两指间的初始长度，用于计算放大倍数
							startRange = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
							if (singleTouchFlag) { // 在单指操作过程中加入第二个手指时 不生效 不进入缩放操作
								zoomTouchesCount = 0;
							} else { // 记录缩放操作手指数目为2
								zoomTouchesCount = 2;
							}
						}
						break;
					default:
				}
			},
			touchMove: (event) => {
				event.preventDefault();
				switch (event.touches.length) {
					case 1: // 单指触摸 - 移动判断
						let curPointX = event.touches[0].screenX;
						let deltaX = curPointX - (lastPointX || curPointX);
						lastPointX = curPointX;
						if (this.zoomRatio === 1) { // 单指触摸 - 无缩放 - 进行滑动图片
							singleTouchFlag = true; // 将单指触摸标记开启
							let curTranslate = this.getTranslate(this.imagebrowser.find('.list'), 'x');
							let targetTranslate = curTranslate + deltaX;
							targetTranslate = this.checkSlideEdge(targetTranslate);
							this.move(targetTranslate);
						} else { // 单指触摸 - 有缩放 - 进行单张图片平移
							if (this.config.enableZoomTransform) { // 设置允许缩放后平移
								if (!doubleTouchFlag) { // 不是在两指操作过程中
									let curPointY = event.touches[0].screenY;
									let deltaY = curPointY - (lastPointY || curPointY);
									lastPointY = curPointY;
									deltaX /= 3; // 缓动
									deltaY /= 3; // 缓动
									let zoomElement = this.imagebrowser.find(`.list li:eq(${this.curIndex})`).find('.image-translate');
									let curTranslateX = this.getTranslate(zoomElement, 'x');
									let curTranslateY = this.getTranslate(zoomElement, 'y');
									let targetTranslateX = curTranslateX + deltaX;
									let targetTranslateY = curTranslateY + deltaY;
									this.zoomMove(targetTranslateX, targetTranslateY);
								}
							}
						}
						break;
					case 2: // 两指触摸 - 进行缩放
						if (this.config.enableZoom) { // 设置允许缩放操作
							if (!singleTouchFlag) { // 不是在单指操作过程中加入第二个手指
								doubleTouchFlag = true; // 则开启双指触摸标记
								// console.log('imagebrowser_beforezoom');
								this.config.onBeforeZoom(this.zoomRatio);
								this.imagebrowser.trigger('imagebrowser_beforezoom', {zoomRatio: this.zoomRatio});
								this.zoomRatio = this.getZoomRatio(event.touches, startRange);
								this.zoom(this.zoomRatio);
								// console.log('imagebrowser_zoom');
								this.config.onZoom(this.zoomRatio);
								this.imagebrowser.trigger('imagebrowser_zoom', {zoomRatio: this.zoomRatio});
							}
						}
						break;
					default:
				}
			},
			touchEnd: (event) => {
				switch (zoomTouchesCount) {
					case 0: // 单指触摸 - 松开手指
						if (this.zoomRatio === 1) { // 无缩放 - 计算总滑动距离和时间
							let endTime = event.timeStamp;
							let deltaTime = endTime - (startTime || endTime);
							let curPointX = event.changedTouches[0].screenX;
							let deltaDistance = curPointX - (startPointX || curPointX);
							this.moveEnd(deltaDistance, deltaTime);
							singleTouchFlag = false; // 关闭单指触摸标记 本次单指触摸操作结束
						}
						break;
					case 1: // 两指缩放 - 松开第二个手指
						this.zoomEnd(this.zoomRatio);
						doubleTouchFlag = false; // 关闭两指触摸标记 本次两指触摸操作结束
						zoomTouchesCount = 0;
						break;
					case 2: // 两指缩放 - 松开第一个手指
						zoomTouchesCount --;
						break;
					default:
						zoomTouchesCount = 0;
				}
			},
			tap: (event) => {
				tapTimes ++;
				setTimeout(() => {
					switch (tapTimes) {
						case 0:
							break;
						case 1: // 单击
							tapTimes = 0;
							let index = $(event.target).closest('li').data('index');
							// console.log('imagebrowser_tap', index);
							this.config.onTap(index);
							this.imagebrowser.trigger('imagebrowser_tap', {index: index});
							break
						default: // 两次及以上均算两次tap
							tapTimes = 0;
							if (this.config.enableDoubleTapZoom) { // 设置允许双击缩放
								if (!singleTouchFlag) { // 不是在单指操作过程中
									// console.log('imagebrowser_beforezoom', this.zoomRatio);
									this.config.onBeforeZoom(this.zoomRatio);
									this.imagebrowser.trigger('imagebrowser_beforezoom', {zoomRatio: this.zoomRatio});
									if (this.zoomRatio < this.middleZoomRatio) {
										this.zoomRatio = this.middleZoomRatio;
									} else if (this.zoomRatio >= this.middleZoomRatio && this.zoomRatio < this.config.maxZoomRatio) {
										this.zoomRatio = this.config.maxZoomRatio;
									} else {
										this.zoomRatio = 1;
									}
									this.zoom(this.zoomRatio, this.ANIMATION_TIME);
									this.zoomEnd(this.zoomRatio, this.ANIMATION_TIME);
									// console.log('imagebrowser_zoom', this.zoomRatio);
									this.config.onZoom(this.zoomRatio);
									this.imagebrowser.trigger('imagebrowser_zoom', {zoomRatio: this.zoomRatio});
								}
							}
					}
				}, 250);
			}
		};
	}

	loadFirst () { // 初始化时加载
		// console.log('imagebrowser_beforefirstload');
		this.config.onBeforeFirstLoad();
		this.imagebrowser.trigger('imagebrowser_beforefirstload');
		// console.log('beginIndex : ', this.beginIndex, '; endIndex : ', this.endIndex);
		for (let i = this.beginIndex; i < this.endIndex; i ++) {
			this.fillOneImage(i);
		}
		// console.log('imagebrowser_firstload');
		this.config.onFirstLoad();
		this.imagebrowser.trigger('imagebrowser_firstload');
		this.moveTo(this.curIndex);
	}

	fillOneImage (index) { // 根据index加载一张图片到容器中
		try {
			if (this.list[index] && !this.list[index].loaded) {
				this.imagebrowser.find('.list').find(`li:eq(${index})`).find('.image-container').html(_.template(this.TPL_IMAGE)(this.list[index]));
				this.list[index].loaded = true;
			}
		} catch (err) {
			// console.log('imagebrowser_loaderror');
			this.config.onLoadError(err);
			this.imagebrowser.trigger('imagebrowser_loaderror', {err: err});
		}
	}

	fillImages () { // 根据beginIndex endIndex curIndex loadRadius 来加载图片
		if (this.beginIndex > 0 && this.curIndex - this.beginIndex < this.loadRadius-1) {
			// 还未加载到第一张 且有需要向前加载时
			this.beginIndex --;
			// console.log('imagebrowser_beforeload');
			this.config.onBeforeLoad();
			this.imagebrowser.trigger('imagebrowser_beforeload');
			this.fillOneImage(this.beginIndex);
			// console.log('imagebrowser_load');
			this.config.onLoad();
			this.imagebrowser.trigger('imagebrowser_load');
		}
		if (this.endIndex + 1 <= this.length && this.endIndex - this.curIndex <= this.loadRadius) {
			// 还未加载到最后一张 且有需要向后加载时
			this.endIndex ++;
			// console.log('imagebrowser_beforeload');
			this.config.onBeforeLoad();
			this.imagebrowser.trigger('imagebrowser_beforeload');
			this.fillOneImage(this.endIndex-1);
			// console.log('imagebrowser_load');
			this.config.onLoad();
			this.imagebrowser.trigger('imagebrowser_load');
		} else if (this.endIndex + 1 > this.length && this.endIndex - this.curIndex <= this.loadRadius) {
			// 加载到最后一张了 但有需要向后加载时 执行load函数加载更多数据 若无数据 则加载完毕

			this.config.load((newList) => this.load(newList));
		}
	}

	load (newList) { // 通过外部自动以的方法加载更多数据，加载完成后的回调函数
		if (newList && newList.length > 0) { // 获取到更多的数据
			this.list.concat(newList);
			this.addContainer(newList.length); // 获取到多少数据则插入多少图片容器
			this.length = this.list.length;
			this.fillImages();
		} else { // 没有获取到更多的数据
			if (!this.completeloadFlag) {
				this.completeloadFlag = true;
				// console.log('imagebrowser_loadcomplete');
				this.config.onLoadComplete();
				this.imagebrowser.trigger('imagebrowser_loadcomplete');
			}
		}
	}

	updateInfo (index) { // 根据index更新info区域信息
		this.imagebrowser.find('.info').html(_.template(this.TPL_INFO)(this.list[index]));
	}

	move (distance, time=0) { // 移动ul图片列表
		this.imagebrowser.find('.list').css({
			"-webkit-transform": `translate(${distance}px, 0)`,
			"transform": `translate(${distance}px, 0)`,
			"-webkit-transition": `-webkit-transform ${time}s linear`,
			"transition": `transform ${time}s linear`
		});
	}

	moveTo (index, time=0) { // 移动到index这张图的位置
		this.move(-1*index*this.WIN_WIDTH, time);
		this.updateInfo(index);
	}

	moveEnd (deltaDistance, deltaTime) { // 滑动结束后 根据滑动距离和时长 判断是否切换图片和加载图片
		let speed = deltaDistance / deltaTime;
		let highSpeed = .5 * this.boundaryWidth / 200; // 快速滑动的速度标准
		let plusHighSpeed = this.config.enableFastSwitch && speed > highSpeed; // 是否达到向前快速滑动
		let minusHighSpeed = this.config.enableFastSwitch && speed < -1 * highSpeed; // 是否达到向后快速滑动
		let canMovePrevious = this.curIndex - 1 >= this.beginIndex; // 是否可以向前滑动
		let canMoveNext = this.curIndex + 1 < this.endIndex; // 是否可以向后滑动
		if (canMovePrevious && (deltaDistance > this.boundaryWidth || plusHighSpeed)) {
			// 向前滑动一张
			// console.log('imagebrowser_beforeslide', this.curIndex);
			this.config.onBeforeSlide(this.curIndex);
			this.imagebrowser.trigger('imagebrowser_beforeslide', {index: this.curIndex});
			this.curIndex --;
		} else if (canMoveNext && (deltaDistance < -1 * this.boundaryWidth || minusHighSpeed)) {
			// 向后滑动一张
			// console.log('imagebrowser_beforeslide', this.curIndex);
			this.config.onBeforeSlide(this.curIndex);
			this.imagebrowser.trigger('imagebrowser_beforeslide', {index: this.curIndex});
			this.curIndex ++;
		} else {
			this.moveTo(this.curIndex, this.ANIMATION_TIME);
			return;
		}
		this.moveTo(this.curIndex, this.ANIMATION_TIME);
		// console.log('imagebrowser_slide', this.curIndex);
		this.config.onSlide(this.curIndex);
		this.imagebrowser.trigger('imagebrowser_slide', {index: this.curIndex});
		this.fillImages();
	}

	zoom (zoomRatio, time = 0) { // 缩放图片
		let zoomElement = this.imagebrowser.find(`.list li:eq(${this.curIndex})`).find('.image-scale');
		zoomElement.css({
			"-webkit-transform": `scale(${zoomRatio})`,
			"transform": `scale(${zoomRatio})`,
			"-webkit-transition": `-webkit-transform ${time}s ease-out`,
			"transition": `transform ${time}s ease-out`
		});
	}

	zoomMove (targetTranslateX, targetTranslateY, time = 0) { // 缩放中图片平移
		let zoomRatio = this.zoomRatio;
		if (zoomRatio >= 1) {
			let zoomElement = this.imagebrowser.find(`.list li:eq(${this.curIndex})`).find('.image-translate');
			// 左右方向的单向最大可移动距离
			// let maxTranslateX = (zoomRatio - 1) / (2 * zoomRatio) * zoomElement.width() / zoomRatio;
			let maxTranslateX = (zoomElement.width() - this.WIN_WIDTH) / 2 / zoomRatio;
			maxTranslateX = maxTranslateX > 0 && maxTranslateX || 0;
			// 上下方向的单向最大可移动距离
			// let maxTranslateY = (zoomRatio - 1) / (2 * zoomRatio) * zoomElement.height() / zoomRatio;
			let maxTranslateY = (zoomElement.height() - window.innerHeight) / 2 / zoomRatio;
			maxTranslateY = maxTranslateY > 0 && maxTranslateY || 0;
			targetTranslateX = Math.abs(targetTranslateX) > maxTranslateX ? (Math.abs(targetTranslateX) / targetTranslateX * maxTranslateX) : targetTranslateX;
			targetTranslateY = Math.abs(targetTranslateY) > maxTranslateY ? (Math.abs(targetTranslateY) / targetTranslateY * maxTranslateY) : targetTranslateY;
			// $('.iv-title').html('maxTranslateY: ' + maxTranslateY + ' ; targetTranslateY: ' + targetTranslateY + ' ; >0?: ' + (Math.abs(targetTranslateY) > maxTranslateY));
			zoomElement.css({
				"-webkit-transform": `translate(${targetTranslateX}px, ${targetTranslateY}px)`,
				"transform": `translate(${targetTranslateX}px, ${targetTranslateY}px)`,
				"-webkit-transition": `-webkit-transform ${time}s ease-out`,
				"transition": `transform ${time}s ease-out`
			});
		}
	}

	zoomEnd (zoomRatio) { // 缩放结束时的回弹处理
		if (zoomRatio < 1.3) { // 缩放结束时 若缩放倍率小于1.3 均弹回到无缩放大小
			this.zoomRatio = 1;
			this.zoomMove(0, 0, this.ANIMATION_TIME);
			this.zoom(this.zoomRatio, this.ANIMATION_TIME);
		}
		if (zoomRatio > this.config.maxZoomRatio) { // 缩放结束时 若缩放倍率大于设置的最大缩放倍率 则弹回最大倍率
			this.zoomRatio = this.config.maxZoomRatio;
			this.zoom(this.zoomRatio, this.ANIMATION_TIME);
			// this.zoomMove(0, 0, this.ANIMATION_TIME);
		}
	}

}

export default Imagebrowser;
