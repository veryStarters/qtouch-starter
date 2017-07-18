
(function ($) {

    function Tip(el, options) {
        this.$el = $(el);
        this.cfg = $.extend(Tip.defaultOptions, options);
        this.init();
    }

	Tip.defaultOptions = {
		content: '',
		duration: 2000,
		effect: 'slideup',
		autoHide: true,
		position: 'static'
	};

	Tip.effectMap = {

	};

	Tip.effectDuration = 300;

    Tip.prototype = {
		
		constructor: Tip,
		
		tpl: '<div class="qt-tip-content"></div>',

		init: function() {
			this.render();
			this.initEvent();
		},

		render: function() {
			var self = this;
			self.$el.addClass('qt-tip');
			self.$el.append(self.tpl);
			self.$content = self.$el.find('.qt-tip-content');
			self.setContent(self.cfg.content);
			self.hideAfterDuration();
		},

		initEvent: function() {

		},

		show: function(content) {
			var self = this;
			if (typeof content === 'object') {
				var cfg = $.extend(Tip.defaultOptions, content);
				self.setContent(cfg.content);
				self.setEffect(cfg.effect);
				self.setDuration(cfg.duration);
				self.setAutoHide(cfg.autoHide);
				self.setPosition(cfg.position);
			} else {
				self.setContent(content);
			}


			self.moveToPosition();
			var effectClz = self.getEffectClass();
			self.$el
				.addClass('show')
				.removeClass(effectClz + 'out')
				.addClass(effectClz + 'in');
			if (self.cfg.autoHide) {
				self.hideAfterDuration();
			}
		},

		moveToPosition: function() {
			var self = this;
			var pos = self.cfg.position;
			if (pos === 'static') {
				self.$el.removeClass('fixed');
				return;
			}
			self.$el.addClass('fixed')
			if (pos === 'top') {
				self.$el.css({
					left: 0,
					top: 0
				});
				return;
			}

			if (pos === 'bottom') {
				self.$el.css({
					left: 0,
					bottom: 0
				});
				return;
			}

			if (typeof pos === 'object') {
				self.$el.css(pos);
			}
		},

		changeMessageTypeClass: function(clz) {
			this.$el
				.removeClass('info warn success error')
				.addClass(clz);
			return this;
		},

		info: function(content) {
			this
				.changeMessageTypeClass('info')
				.show(content);
		},

		warn: function(content) {
			this
				.changeMessageTypeClass('warn')
				.show(content);
		},

		success: function(content) {
			this
				.changeMessageTypeClass('success')
				.show(content);
		},

		error: function(content) {
			this
				.changeMessageTypeClass('error')
				.show(content);
		},

		hide: function() {
			var self = this;
			var effectClz = self.getEffectClass();

			self.$el
				.removeClass(effectClz + 'in')
				.addClass(effectClz + 'out');

			window.clearTimeout(self.startHideTimer);
			window.clearTimeout(self.endHideTimer);
			self.endHideTimer= window.setTimeout(function() {
				self.$el
					.removeClass('show')
					.removeClass(effectClz + 'out');
			}, Tip.effectDuration);
		},

		hideAfterDuration: function() {
			var self = this;
			if (self.cfg.duration) {
				window.clearTimeout(self.startHideTimer);
				self.startHideTimer = window.setTimeout($.proxy(self.hide, self), self.cfg.duration);
			}
		},

		getEffectClass: function() {
			var self = this;
			var effectClz = Tip.effectMap[self.cfg.effect];
			return effectClz ? effectClz: self.cfg.effect;
		},

		setContent: function(content) {
			if (content !== undefined && content !== null) {
				this.cfg.content = content;
				this.$content.html(content);
			}
		},

		setEffect: function(effect) {
			if (effect !== undefined && effect !== null ) {

				var effectClz = this.getEffectClass();
				this.$el
					.removeClass(effectClz+'in')
					.removeClass(effectClz+'out');
				this.cfg.effect = effect;
			}
		},

		setDuration: function(duration) {
			duration = window.parseInt(duration, 10);
			if (window.isNaN(duration)) {
				this.cfg.duration = duration;
			}
		},

		setAutoHide: function(autoHide) {
			this.cfg.autoHide = autoHide;
		},

		setPosition: function(position) {
			this.cfg.position = position;
		}

	};

	$.pluginModularize('tip', Tip);
})(Zepto);
