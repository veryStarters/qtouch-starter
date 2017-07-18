/**
 * Created by sublime.
 * @date   : 15-5-12
 * @author : liming.fan
 * @link   : touch.qunar.com
 */
'use strict'
;(function($) {

	function Panel(ele, options) {
		this.$ele = $(ele);
		this.options = $.extend({}, this.defaultOptions, options || {});
        this.init();
        this.initEvent();
	}

	Panel.prototype = {
		constructor: Panel,		

		init: function() {
			var $ele = this.$ele,
				positions = ['left', 'right', 'top', 'bottom'],
				timings = ['ease-in', 'ease-out', 'linear', 'ease-in-out'],
				_position = this.options.position;				

			if (!$ele.hasClass('qt-panel')) {
				$ele.addClass('qt-panel');
			}
			
			if(positions.indexOf(_position) == -1) throw('the config of position is illegal');

			$ele.addClass('qt-panel-position-' + _position);
			this.options.animate && $ele.addClass('qt-panel-animate');
			this.options.display && $ele.addClass('qt-panel-display-' + this.options.display).addClass('qt-panel-closed');

			//设置动画方式及时间
			if(this.options.animate && this.options.timing && timings.indexOf(this.options.timing) != -1) {
				parseInt(this.options.duration, 10);
				$ele.css({
					'-webkit-transition': '-webkit-transform ' + this.options.duration + 'ms ' + this.options.timing, 
					'transition': 'transform ' + this.options.duration + 'ms ' + this.options.timing
				});
			}
			//page的设置
			if(this.options.page) this._pager();
			
			this._styler();			
			
			//panel内容是通过配置参数传
			if(this.options.content) {
				this.render();
			}
			
			//初始是关闭状态
			this._open = false;
		},

		/**
		 * render 渲染content内容 
		 */
		render: function() {
			this.$ele.append(this.options.content);				
		},

		initEvent: function() {
			var me = this,
				$ele = me.$ele;

			if(me.options.dismissible) {
				//TODO widgets whithin iframes, this.document
				$(document).on('click', function(e) {
					if($(e.target).hasClass('qt-panel-toggle')) return;
					me._open && me.close();					
				});			
			}

			//增加panel打开或关闭时候的动画回调
			$ele.on('webkitTransitionEnd transitionend', function() {
				if(me._open) {					
					$(me).trigger('afterOpen');
					if(me.options.page) {
						window.history.pushState({title: me.options.page}, me.options.title);
					}
				} else {
					$ele.addClass('qt-panel-closed');
					$(me).trigger('afterClose');
				}				
			});
			if(me.options.page) {
				$(window).on('popstate', function(e) {
					me.close(true);
				});
				$ele.on('click', '.qt-page-header-back', function() {
					window.history.back();
				});
			}

			$ele.on('click', function(e) {
				e.preventDefault(); e.stopPropagation(); return false;
			});			
		},
		_removeListener: function() {
			var me = this,
				$ele = me.$ele;

			if(me.options.dismissible) {
				$(document).off('click', function(e) {
					if($(e.target).hasClass('qt-panel-toggle')) return;
					me._open && me.close();					
				});			
			}
			if(me.options.page) {
				$(window).off('popstate', function(e) {
					me.close(true);
				});				
			}
			$ele.off();
			$ele.off('click', '.qt-page-header-back');
		},
		//page设置
		_pager: function() {
			var me = this,
				$ele = me.$ele,
				$pageId = this.options.page;

			$ele.css({
				'left': 0,
				'right': 0,
				'top': 0,
				'bottom': 0,
				'width': '100%'
			});
			var headerTpl = '<div class="qt-page-header">'+
							'<span class="qt-page-header-back"></span>' +
							'</div>';

			$ele.prepend(headerTpl);
			
		},
		//设置自定义的样式
		_styler: function() {
			var _position = this.options.position;
			
			if(_position == 'left' || _position == 'right') {
				if(this.options.page) var width = $(window).width() + 'px';
				else var width = this.options.width;
			} else if(_position == 'top' || _position == 'bottom') {
				if(this.options.page) var height = $(window).height() + 'px';
				else var height = this.options.height;
			}				
			
			//设置宽高,从options.width 中取
			if(width) {
				_position == 'left' && (this.closeStyle = generateStyle('-' + width, 'x'));
				_position == 'right' && (this.closeStyle = generateStyle(width, 'x'));
				this.closeStyle.width = width;
			} else if(height) {
				_position == 'top' && (this.closeStyle = generateStyle('-' + height, 'y'));
				_position == 'bottom' && (this.closeStyle = generateStyle(height, 'y'));
				this.closeStyle.height = height;
			}
			this.openStyle = {
				'-webkit-transform': 'translate3d(0, 0, 0)',
				'transform': 'translate3d(0, 0, 0)',				
			}
			this.closeStyle && this.$ele.css(this.closeStyle);
		},
		

		open: function() {
			var me = this,
				$ele = me.$ele;
			//关闭其他已经打开的panel	
			/*$('.qt-panel').each(function(index, panel){
				$(panel).hasClass('className') && $(panel).data('panel').close();				
			});*/
			this._open = true;
			$(this).trigger('boforeOpen');
			this.closeStyle && $ele.css(this.openStyle);
			$ele.addClass('qt-panel-open').removeClass('qt-panel-closed');
			this.lock && this._mask.show();
			if(!this.options.animate) {
				$(this).trigger('afterOpen');
			}				
		},
		close: function() {
			//invokeByUser: bool,标识close是由程序触发or用户
			if(this.options.page && !arguments[0]) {
				window.history.back();
				return;
			}
			var $ele = this.$ele;

			this._open = false;
			$(this).trigger('beforeClose');
			$ele.removeClass('qt-panel-open');
			this.closeStyle && $ele.css(this.closeStyle);					
			this.lock && this._mask.hide();
			//当没有设置动画时候
			if(!this.options.animate) {
				$ele.addClass('qt-panel-closed');
				$(this).trigger('afterClose');				
			}	
		},
		toggle: function() {
			this._open ? this.close() : this.open();
		},
		destory: function() {
			this._removeListener();
			this.$ele.remove();
			delete this;
		}
	};
	Panel.prototype._mask = $('<div class="qt-panel-mask">').width($(window).width()).appendTo($('body'));
	Panel.prototype.defaultOptions = {
		title: '去哪儿网',
		animate: true,
		duration: 300,  //动画时间，默认是300ms 
		position: 'left',
		display: 'overlay',
		dismissible: true,   //点击非panel区域关闭panel
		lock: false		
	};

	//dimension 设置 X | Y | Z 
	function generateStyle(value, dimension) {
		if(dimension == 'x') {
			return  {
						'-webkit-transform': 'translate3d(' + value + ', 0, 0)',
						'transform': 'translate3d(' + value + ', 0, 0)'
				    };					
		} else if(dimension == 'y') {
			return {
						'-webkit-transform': 'translate3d(0, ' + value + ', 0)',
						'transform': 'translate3d(0, ' + value + ', 0)'
				    };
		}
	}	

	//插件化 & 模块化
    $.pluginModularize('panel', Panel);

})(Zepto);