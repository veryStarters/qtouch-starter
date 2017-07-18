(function ($) {


    function Dialog(el, options) {
        this.$el = $(el);
        this.cfg = $.extend(Dialog.defaultOptions, options);
        this.init();
    }

	Dialog.defaultOptions = {
		zIndex: 10000,
		modal: true,
		title: '',
		okText: '确定',
		cancelText: '取消',
		hideAfterOk: true,
		hideAfterCancel: true,
		header: 
			'<div class="qt-dialog-close"></div>' +
			'<div class="qt-dialog-title"></div>',
		content: '',
		footer:
			'<div class="qt-dialog-btn ok">确定</div>' +
			'<div class="qt-dialog-btn cancel">取消</div>'
	};

	Dialog.getMask = function() {
		var $mask = $('.qt-dialog-mask');
		if (!$mask.length) {
			$mask = $('<div class="qt-dialog-mask"></div>');
			$mask.appendTo('body');
		}
		return $mask;
	};

    Dialog.prototype = {

        constructor: Dialog,

		tpl: 
			'<div class="qt-dialog-header">' +
			'</div>' +
			'<div class="qt-dialog-content">' +
			'</div>' +
			'<div class="qt-dialog-footer">' +
			'</div>', 

        init: function () {
            this.render();
            this.initEvent();
        },

		render: function() {
			var self = this;
			var elContent = self.$el.html();
			if (/^\s*$/.test(elContent)) {
				self.$el.addClass('qt-dialog');
				self.$el.append(self.tpl);
				self.setHeader(self.cfg.header);
				self.setContent(self.cfg.content);
				self.setFooter(self.cfg.footer);
			}
            self.setOkBtnText(self.cfg.okText);
            self.setCancelBtnText(self.cfg.cancelText);

			if ($.isFunction(self.cfg.onOk)) {
				self.on('ok', self.cfg.onOk);
			}
			if ($.isFunction(self.cfg.onCancel)) {
				self.on('cancel', self.cfg.onCancel);
			}
			self.setTitle(self.cfg.title);
		},

        initEvent: function () {
			var self = this;
			self.delegateEvent('click', '.qt-dialog-close', self.hide);
			self.delegateEvent('click', '.qt-dialog-btn.ok', self.ok);
			self.delegateEvent('click', '.qt-dialog-btn.cancel', self.cancel);
        },

		delegateEvent: function(type, selector, hanlder) {
			var self = this;
			self.$el.on(type, selector, $.proxy(hanlder, self));
		},

		show: function(position) {
			var self = this;
			self.trigger('beforeShow');
			if (self.stopShowSwitch) {
				self.resetStopShow();
				return;
			}
			if (self.cfg.modal) {
				self.showMask();
			}
			self.$el.addClass('show');
			self.$el.css('position', 'fixed');
			self.$el.css('z-index', self.cfg.zIndex);
			self.setPosition(position);
			self.trigger('afterShow');
		},

		hide: function() {
			var self = this;
			self.trigger('beforeHide');
			if (self.stopHideSwitch) {
				self.resetStopHide();
				return;
			}
			if (self.cfg.modal) {
				self.hideMask();
			}
			self.$el.removeClass('show');
			self.trigger('afterHide');
		},

		setPosition: function(position) {
			var self = this;
			if (position) {
				self.$el.css({
					left: position.left,
					right: position.right,
					top: position.top,
					bottom: position.bottom
				});
				return;
			}
			var width = $(window).width();
			var height = $(window).height();
			var dWidth = self.$el.width();
			var dHeight = self.$el.height();
			var left = (width - dWidth) / 2;
			var top = (height - dHeight) / 2;
			self.$el.css({
				left: left,
				top: top
			});

		},

		stopShow: function() {
			this.stopShowSwitch = true;
		},

		stopHide: function() {
			this.stopHideSwitch = true;
		},

		resetStopShow: function() {
			this.stopShowSwitch = false;
		},

		resetStopHide: function() {
			this.stopHideSwitch = false;
		},

		showMask: function() {
			var $mask = Dialog.getMask();
			$mask.addClass('show');
		},

		hideMask: function() {
			var $mask = Dialog.getMask();
			$mask.removeClass('show');
		},

		setTitle: function(title) {
			this.$('.qt-dialog-title').text(title);
		},

		$title: function() {
			return this.$('.qt-dialog-title');
		},

		setContent: function(content) {
			this.$('.qt-dialog-content').html(content);
		},

		$content: function() {
			return this.$('.qt-dialog-content');
		},

		setFooter: function(content) {
			this.$('.qt-dialog-footer').html(content);
		},

		$footer: function() {
			return this.$('.qt-dialog-footer');
		},

		setHeader: function(content) {
			this.$('.qt-dialog-header').html(content);
		},

		$header: function() {
			return this.$('.qt-dialog-header');
		},

		ok: function() {
			var self = this;
			self.trigger('ok');
			if (self.cfg.hideAfterOk) {
				self.hide();
			}
		},

		cancel: function() {
			var self = this;
			self.trigger('cancel');
			if (self.cfg.hideAfterCancel) {
				self.hide();
			}
		},

		//setTitle: function(text) {
		//	this.$('.qt-dialog-title').html(text);
		//},

		setOkBtnText: function(text) {
			this.$('.qt-dialog-btn.ok').html(text);
		},

		setCancelBtnText: function(text) {
			this.$('.qt-dialog-btn.cancel').html(text);
		},

		hideOkBtn: function() {
            this.$('.qt-dialog-btn.ok').hide();
		},

        hideCancelBtn: function () {
            this.$('.qt-dialog-btn.cancel').hide();
        },

		$: function() {
			return this.$el.find.apply(this.$el, arguments);
		},

		trigger: function() {
			return this.$el.trigger.apply(this.$el, arguments);
		}

    };

    $.pluginModularize('dialog', Dialog);

})(Zepto);

