/**
 * Created by hongyu.feng on 2015/5/15.
 */
;(function($, undefined) {

    "use strict";

    Module.defaultOptions = {
        className: {
            disabled : 'disabled',
            checked  : 'checked'
        },
        tplData: [],
        onEnabled: function() {},
        onDisabled: function() {},
        onChecked   : function(){},
        onUnchecked : function(){}
    };

    function Module(ele, options) {
        this.$ele = $(ele);
        this.options = $.extend(Module.defaultOptions, options || {});
        this.init();
    }

    Module.prototype = {

        constructor: Module,

        init: function() {
            if(this.$ele.find('input[type="checkbox"]').length > 0) {
                this.$child = this.$ele.find('input[type="checkbox"]');
            }else {
                this.render();
            }
            this.initEvents();
        },

        render: function() {
            var opt = this.options.tplData;
            var tpl = [];
            if($.isArray(opt)) {
                opt.forEach(function(val) {
                    tpl.push('<input type="checkbox" ' +(val.checked && "checked")+ ' name="'+val.name+'">');
                });
                this.$ele.append(tpl.join(''));
            }else {
                throw 'switcher options tplData error!';
            }
        },

        disable: function(index) {
            var $ele = index ? $(this.$child.get(index)) : this.$child;
            $ele.prop('disabled', 'disabled');
            $ele.addClass(this.options.className.disabled);
            this.options.onDisabled.call($ele);
        },

        enable: function(index) {
            var $ele = index ? $(this.$child.get(index)) : this.$child;
            $ele.prop('disabled', false);
            $ele.removeClass(this.options.className.disabled);
            this.options.onEnabled.call($ele);
        },

        initEvents: function() {
            var me = this;
            this.$ele.on('click', 'input[type="checkbox"]', function(e) {
                if($(this).prop('checked')) {
                    me.options.onChecked.call($(this), e);
                }else {
                    me.options.onUnchecked.call($(this), e);
                }
            });
        },
        getChooseStatus: function(type) {
            var returnValue = {};
            if(type == 'array') {
                returnValue = [];
                this.$child.each(function(index) {
                    returnValue.push($(this).prop('checked'));
                });
            }else {
                this.$child.each(function(index) {
                    returnValue[$(this).prop('name') || index] = $(this).prop('checked');
                });
            }
            return returnValue;
        }


    };

    $.pluginModularize('switcher', Module);
})(Zepto);